const webpack = require("webpack");
const pkg = require("./package.json");
const env = require("yargs").argv.env;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const libraryName = pkg.name;

let outputFile, mode;
const minOutputFileName = libraryName + ".min.js";
if (env === "build") {
  mode = "production";
  outputFile = minOutputFileName;
} else {
  mode = "development";
  outputFile = libraryName + ".js";
}

module.exports = {
  entry: [__dirname + "/index.js"],
  mode: mode,
  output: {
    path: __dirname,
    filename: outputFile,
    library: "customProtocolCheck",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false
    }),
    new CopyPlugin([
      {
        from: minOutputFileName,
        to: __dirname + "/demo/" + minOutputFileName,
        force: true
      }
    ])
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        /* Uglifying plugin */
        sourceMap: true
      })
    ]
  },
  devServer: {
    compress: false,
    port: 9999
  }
};
