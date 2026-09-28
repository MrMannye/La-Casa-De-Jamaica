import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import prettier from 'eslint-config-prettier/flat'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: {
      'better-tailwindcss': {
        entryPoint: './app/globals.css',
        detectComponentClasses: true,
      },
    },
    rules: {
      ...betterTailwindcss.configs.correctness.rules,
      'better-tailwindcss/no-duplicate-classes': 'warn',
      'better-tailwindcss/enforce-canonical-classes': [
        'error',
        { rootFontSize: 16, collapse: false },
      ],
      // Selectors used by GSAP or custom CSS, rather than Tailwind utilities.
      'better-tailwindcss/no-unknown-classes': [
        'error',
        {
          ignore: [
            '^hero-(art|item|line|seal)$',
            '^bouquet-reveal$',
            '^workshop-reveal$',
            '^ribbon-track$',
            '^workshop-dialog$',
            '^dashboard-(shell|view)$',
            '^site-header$',
          ],
        },
      ],
    },
  },
  prettier,
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      '.pnpm-store/**',
    ],
  },
]

export default eslintConfig
