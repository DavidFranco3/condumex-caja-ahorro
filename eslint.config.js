const neostandard = require('neostandard')
const reactPlugin = require('eslint-plugin-react')
const globals = require('globals')

module.exports = [
  ...neostandard({
    // 1. IMPORTANTE: Ignoramos las carpetas de compilación
    ignores: ['dist', 'build', 'node_modules', 'coverage', '*.min.js'],
  }),

  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // 2. Definimos tus variables globales para que no marquen error
        Swal: 'readonly',     // SweetAlert
        moment: 'readonly',   // Moment.js
        test: 'readonly',     // Pruebas (Jest/Vitest)
        expect: 'readonly',   // Pruebas
        describe: 'readonly', // Pruebas
        it: 'readonly',       // Pruebas
        vi: 'readonly'        // Vitest (si lo usas)
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,

      // Reglas de React que ya tenías desactivadas
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // 3. Suavizamos reglas estrictas para facilitar la migración
      // Cambiamos "error" a "warn" (advertencia amarilla)
      'no-unused-vars': 'warn',
      eqeqeq: 'warn',
      'no-undef': 'error', // Esto sí debe ser error (variables que no existen)

      // Reglas de estilo (opcional, si te molestan mucho las sangrías)
      '@stylistic/jsx-closing-tag-location': 'warn',
      '@stylistic/jsx-indent': 'off' // A veces pelea con los formateadores
    },
  },
]
