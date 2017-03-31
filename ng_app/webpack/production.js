var path = require('path'),
    webpack = require("webpack"),
    basedir = path.dirname(__dirname),
    libPath = path.join(basedir, 'lib'),
    pkgPath = path.join(basedir, 'package.json'),
    djangoRoot = path.join(basedir, '..'),
    pkg = require(pkgPath),
    HtmlWebpackPlugin = require('html-webpack-plugin');

var folder_name = path.join('static', 'ng_app')

var config = {
    entry: path.join(libPath, 'index.ts'),
    output: {
        path: path.join(djangoRoot),
        filename: path.join(folder_name, 'bundle.js')
    },
    historyApiFallback: true,
    module: {
        loaders: [
        {
            test: /\.tpl.html$/,
            loader: 'file?context=./lib&name=/' + path.join(folder_name, 'templates', '[path][name].html')
        },

        {
            test: /\.(png|jpg)$/,
            loader: 'file?name=/' + path.join(folder_name, 'img', '[name].[ext]') // inline base64 URLs for <=10kb images, direct URLs for the rest
        },
        {
            test: /\.css$/,
            loader: "style!css"
        },
        {
            test: /\.scss$/,
            loader: "style!css!sass"
        },
        {
            test: /\.ts$/,
            exclude: /(node_modules)/,
            loader: "ts-loader"
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file?name=/' + path.join(folder_name, 'fonts', '[name].[ext]')
        }
        ]
    },
    plugins: [
        // HtmlWebpackPlugin: Simplifies creation of HTML files to serve your webpack bundles : https://www.npmjs.com/package/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: path.join(folder_name, 'index.html'),
            pkg: pkg,
            template: path.join(libPath, 'index.html')
        }),

        // OccurenceOrderPlugin: Assign the module and chunk ids by occurrence count. : https://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
        new webpack.optimize.OccurenceOrderPlugin(),

        new webpack.optimize.DedupePlugin(),

        new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = config;