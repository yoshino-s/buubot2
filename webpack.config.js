/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DtsBundleWebpack = require("dts-bundle-webpack");

const PATHS = {
  src: path.join(__dirname, "./src"),
  dist: path.join(__dirname, "./dist"),
};

module.exports = {
  target: "node",
  mode: "development",
  entry: {
    "mirai-bot": PATHS.src + "/index.ts",
  },
  output: {
    path: PATHS.dist,
    filename: "[name].js",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DtsBundleWebpack({
      name: "mirai-bot",
      main: "dist/index.d.ts",
      removeSource: true,
    }),
  ],
};
