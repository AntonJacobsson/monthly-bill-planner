const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const {
  AureliaPlugin,
  ModuleDependenciesPlugin,
} = require("aurelia-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const ensureArray = (config) =>
  (config && (Array.isArray(config) ? config : [config])) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

const title = "Monthly Bill Planner";
const outDir = path.resolve(__dirname, "www");
const srcDir = path.resolve(__dirname, "src");
const baseUrl = "";

module.exports = ({ production, cordova } = {}, { analyze, hmr, port, host } = {}) => ({
  resolve: {
    extensions: [".ts", ".js"],
    modules: [srcDir, "node_modules"],

    alias: {
      "aurelia-binding": path.resolve(
        __dirname,
        "node_modules/aurelia-binding"
      ),
    },
  },
  entry: {
    app: ["aurelia-bootstrapper"],
  },
  mode: production ? "production" : "development",
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: production
      ? "[name].[chunkhash].bundle.js"
      : "[name].[hash].bundle.js",
    sourceMapFilename: production
      ? "[name].[chunkhash].bundle.map"
      : "[name].[hash].bundle.map",
    chunkFilename: production
      ? "[name].[chunkhash].chunk.js"
      : "[name].[hash].chunk.js",
  },
  optimization: {
    concatenateModules: false,
    runtimeChunk: true,
    moduleIds: "hashed",
    splitChunks: {
      hidePathInfo: true,
      chunks: "initial",
      maxSize: 200000,
      cacheGroups: {
        default: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 19,
          enforce: true,
          minSize: 30000,
        },
        vendorsAsync: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors.async",
          chunks: "async",
          priority: 9,
          reuseExistingChunk: true,
          minSize: 10000,
        },
        commonsAsync: {
          name: "commons.async",
          minChunks: 2,
          chunks: "async",
          priority: 0,
          reuseExistingChunk: true,
          minSize: 10000,
        },
      },
    },
  },
  performance: { hints: false },
  devServer: {
    contentBase: outDir,

    historyApiFallback: true,
    hot: hmr || false,
    port: port || 8080,
    host: host,
  },
  devtool: production ? "nosources-source-map" : "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          production !== true ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      { test: /\.html$/i, loader: "html-loader" },
      { test: /\.ts$/, loader: "ts-loader" },

      {
        test: /\.(png|gif|jpg|cur)$/i,
        loader: "url-loader",
        options: { limit: 8192 },
      },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff2" },
      },
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff" },
      },
      {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "file-loader",
      }
    ],
  },
  plugins: [
    new DuplicatePackageCheckerPlugin(),
    new AureliaPlugin(),
    new ModuleDependenciesPlugin({
      "aurelia-testing": ["./compile-spy", "./view-spy"],
    }),
    new HtmlWebpackPlugin({
      template: "index.ejs",
      metadata: { title, baseUrl, isCordova: cordova ? true : false, isProduction: production ? true: false },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),

    (cordova) ?
    new CopyPlugin({
      patterns: [
        { from: 'static', to: outDir },
        { from: 'src/locales/', to: 'locales/' }
      ],
    }) :

    new CopyPlugin({
      patterns: [
        { from: 'static', to: outDir },
        { from: 'manifest.json', to:outDir},
        { from: 'serviceworker.js', to:outDir},
        { from: 'src/locales/', to: 'locales/' }
      ],
    }), 
    
    new webpack.DefinePlugin({
      IS_PRODUCTION: production,
      IS_CORDOVA: cordova
    }),

    ...when(analyze, new BundleAnalyzerPlugin()),
    new CleanWebpackPlugin(),
  ],
});
