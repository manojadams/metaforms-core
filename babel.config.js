const presets = [
  "@babel/preset-env",
  "@babel/preset-react",
  [
    "@babel/preset-typescript",
    {
      "isTSX": true,
      "allExtensions": true,
      "allowDeclareFields": true
    }
  ]
];

module.exports = { presets };