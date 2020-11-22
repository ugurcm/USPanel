require("@babel/polyfill");

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
var env = (process.env.NODE_ENV || 'development').trim();

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js", ],
  //entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index_bundle.js',
    publicPath: '/'  //react router dom linklerin çalışası için
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.css$/,
        use: [
          env !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/img/[name]-[hash:6].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts-[name]-[hash:6].[ext]',
            }
          }
        ]
      },
    ]
  },
  plugins:[
    new Dotenv({
      path: './.env', 
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/html/index.html',
      favicon: "./src/assets/img/favicon.ico",
    }),
    new webpack.ProvidePlugin({   
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),
    /*new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', 
      DEBUG: false,
      base_url: 'http://localhost:8080/',
      api_url: 'http://192.168.99.103:8081/',
    })*/
    // eger klasorde yüklenecek dosyalar varsa ve bu dosyalar import edilemiyorsa 
    // copyPlugin ile bu dosyaları root klasörün altına yükleyebiliyoruz.
    // bu şekilde webpack dev serverda da çalışıyor.
    new CopyPlugin([    
      { from: './node_modules/tinymce/skins', to: './skins' }
    ]),
    
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './Admin/',
    hot: true,
    host: '0.0.0.0',
  }
}