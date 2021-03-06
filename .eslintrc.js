module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: { jest: true },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'babel'],
  rules: {
    'prettier/prettier': ['error'],
    'linebreak-style': 'off',
    'babel/new-cap': 1,
    'babel/no-invalid-this': 1,
    'babel/no-unused-expressions': 1,
    'babel/valid-typeof': 1,
    'no-await-in-loop': 0, //允许在循环中使用await
  },
}
