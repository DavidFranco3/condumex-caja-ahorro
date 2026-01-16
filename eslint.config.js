const neostandard = require('neostandard')
const reactPlugin = require('eslint-plugin-react')
const globals = require('globals')

module.exports = [
  // 1. Cargamos la configuración base de NeoStandard
  ...neostandard({
    // neostandard ya incluye configuraciones modernas, 
    // pero puedes añadir 'ignores' aquí si necesitas.
  }),

  // 2. Configuración específica para React
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'], // Aplica a estos archivos
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
        ...globals.browser, // Reemplaza a env: { browser: true }
        ...globals.node     // Reemplaza a env: { node: true }
      },
    },
    settings: {
      react: {
        version: 'detect', // Tu configuración original
      },
    },
    // Aquí definimos las reglas
    rules: {
      // Cargamos las reglas recomendadas de React manualmente
      ...reactPlugin.configs.recommended.rules,

      // TUS REGLAS PERSONALIZADAS:
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
]