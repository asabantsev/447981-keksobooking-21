const path = require("path");

module.exports = {
  entry: [
      "./js/util.js",
      "./js/backend.js",
      "./js/card.js",
      "./js/filter.js",
      "./js/pin.js",
      "./js/map.js",
      "./js/form.js",
      "./js/preview.js",
      "./js/main.js",
  ],
  output: {
      filename: "bundle.js",
      path: path.resolve(__dirname),
      iife: true
  },
  devtool: false
};
