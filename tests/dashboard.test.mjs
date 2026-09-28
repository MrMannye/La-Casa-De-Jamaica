import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

async function loadModule(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  })
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
  )
}
const { workshops } = await loadModule('../app/data/workshops.ts')
const { createDemo, summarize, courseStats, filterBookings, newestBookings } =
  await loadModule('../app/data/dashboard.ts')
const { courses, bookings } = createDemo(workshops)

test('demo is deterministic, clearly fictitious, and contains unique reservations', () => {
  assert.deepEqual(createDemo(workshops), { courses, bookings })
  assert.equal(courses.length, 14)
  assert.equal(bookings.length, 68)
  assert.equal(new Set(bookings.map((b) => b.id)).size, bookings.length)
  assert.ok(bookings.every((b) => b.name.endsWith(' Demo')))
  for (const booking of bookings) {
    const course = courses.find((c) => c.id === booking.courseId)
    assert.ok(course)
    assert.equal(booking.amount, course.price * booking.quantity)
  }
})

test('only paid bookings contribute to revenue, seats and occupancy', () => {
  const totals = summarize(courses, bookings)
  const paid = bookings.filter((b) => b.status === 'paid')
  const pending = bookings.filter((b) => b.status === 'pending')
  assert.equal(
    totals.revenue,
    paid.reduce((sum, b) => sum + b.amount, 0),
  )
  assert.equal(
    totals.seats,
    paid.reduce((sum, b) => sum + b.quantity, 0),
  )
  assert.equal(totals.purchases, paid.length)
  assert.equal(
    totals.pendingAmount,
    pending.reduce((sum, b) => sum + b.amount, 0),
  )
  assert.equal(totals.capacity, 168)
  assert.equal(totals.occupancy, Math.round((totals.seats / 168) * 100))
  assert.equal(
    summarize(
      courses,
      bookings.filter((b) => b.status !== 'paid'),
    ).revenue,
    0,
  )
  assert.equal(summarize([], []).occupancy, 0)
})

test('per-workshop totals reconcile with the summary and available seats', () => {
  const stats = courses.map((c) => courseStats(c, bookings))
  const totals = summarize(courses, bookings)
  assert.equal(
    stats.reduce((sum, s) => sum + s.revenue, 0),
    totals.revenue,
  )
  assert.equal(
    stats.reduce((sum, s) => sum + s.seats, 0),
    totals.seats,
  )
  assert.ok(stats.every((s) => s.seats + s.available === 12))
})

test('reservation filters combine course, status and accent-insensitive search', () => {
  const lucia = filterBookings(bookings, { query: '  lucia  ' })
  assert.ok(lucia.length > 0)
  assert.ok(lucia.every((b) => b.name === 'Lucía Demo'))
  const selected = filterBookings(bookings, {
    courseId: 'oct-01',
    status: 'paid',
    query: 'lc-0001',
  })
  assert.equal(selected.length, 1)
  assert.equal(selected[0].id, 'LC-0001')
  assert.deepEqual(filterBookings(bookings, { query: 'sin resultados' }), [])
})

test('recent reservations are sorted without mutating the source', () => {
  const before = bookings.map((b) => b.id)
  const sorted = newestBookings(bookings)
  assert.deepEqual(
    bookings.map((b) => b.id),
    before,
  )
  for (let i = 1; i < sorted.length; i++)
    assert.ok(sorted[i - 1].created >= sorted[i].created)
})
