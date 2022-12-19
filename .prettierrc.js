/**
 * Prettier config file
 * @see https://prettier.io/docs/en/index.html
 * @see https://prettier.io/docs/en/options.html
 */
module.exports = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
  jsxBracketSameLine: true,
  bracketSpacing: false,
  bracketSameLine: true,
  tabWidth: 2,
  semi: true,
  importOrder: ['^/data/?(.*)$', '^/services/?(.*)$', '^/core/?(.*)$', '^/(?!public)(.*)$', '^./', '^/public/(.*)$'],
  importOrderSeparation: true,
};
