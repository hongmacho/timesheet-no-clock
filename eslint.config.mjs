import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules',
      '.next',
      '.git',
      '**/*.test.ts',
      '**/*.test.tsx',
      'postcss.config.js',
      'next.config.ts',
      '.omc/**',
    ],
  },
]
