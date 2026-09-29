import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

// Exercise the actual data module without adding a runtime or test dependency.
const source = await readFile(
  new URL('../app/data/workshops.ts', import.meta.url),
  'utf8',
)
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
})
const data = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)

test('October 2026 starts on Thursday and includes each day once', () => {
  const weeks = data.calendarWeeks()
  assert.equal(weeks.length, 5)
  assert.deepEqual(weeks[0], [null, null, null, 1, 2, 3, 4])
  assert.deepEqual(weeks[4], [26, 27, 28, 29, 30, 31, null])
  assert.deepEqual(
    weeks.flat().filter(Boolean),
    Array.from({ length: 31 }, (_, i) => i + 1),
  )
})

test('all 14 activities have unique URLs and available images', async () => {
  assert.equal(data.workshops.length, 14)
  assert.equal(new Set(data.workshops.map((item) => item.id)).size, 14)
  for (const workshop of data.workshops) {
    assert.equal(workshop.id, `oct-${String(workshop.day).padStart(2, '0')}`)
    assert.ok(workshop.price > 0)
    await access(
      new URL(`../public${data.workshopImage(workshop)}`, import.meta.url),
    )
  }
})

test('filters include activities with more than one category', () => {
  const expected = {
    Todos: 14,
    Ramos: 7,
    Navidad: 6,
    Técnica: 1,
    Emprendimiento: 2,
  }
  for (const [category, count] of Object.entries(expected))
    assert.equal(data.filterWorkshops(category).length, count)
  for (const id of ['oct-09', 'oct-23']) {
    assert.ok(data.filterWorkshops('Ramos').some((item) => item.id === id))
    assert.ok(data.filterWorkshops('Navidad').some((item) => item.id === id))
  }
})

test('dates do not change with the server or browser timezone', () => {
  assert.equal(data.workshopWeekday(data.workshops[0]), 'Jueves')
  assert.equal(
    data.workshopFullDate(data.workshops[0]),
    'Jueves 1 de octubre de 2026',
  )
  assert.equal(data.workshopWeekday(data.workshops[13]), 'Viernes')
})

test('WhatsApp inquiries use the right contact, activity, price and date', () => {
  for (const workshop of data.workshops) {
    const primary = new URL(data.whatsappLink(workshop))
    const alternate = new URL(data.whatsappLink(workshop, true))
    assert.equal(primary.origin, 'https://wa.me')
    assert.equal(primary.pathname, '/525516424315')
    assert.equal(alternate.pathname, '/525560919763')
    const text = primary.searchParams.get('text')
    assert.ok(text.includes(workshop.name))
    assert.ok(text.includes(`${workshop.day} de octubre de 2026`))
    assert.ok(text.includes(`${data.workshopPrice(workshop.price)} MXN`))
    assert.equal(text, alternate.searchParams.get('text'))
  }
})
