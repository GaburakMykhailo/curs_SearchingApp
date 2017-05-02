var resolve = require('path').resolve;

var webpack = require('webpack');

var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlPlugin = require("html-webpack-plugin");
var CopyPlugin = require("copy-webpack-plugin");

function isExternal(test) {
    return function (module) {
        var userRequest = module.userRequest;
        if (typeof userRequest !== 'string') return false;
        var match = userRequest.match(/(node_modules)(?:[\/\\]*)([^\/\\]*)/i);
        return match && (!test || test.test(match[2]));
    }
}

function sortPackages(packages) {
    return function sort(a, b) {
        if (packages.indexOf(a.names[0]) < 0) return 1;
        return (packages.indexOf(a.names[0]) > packages.indexOf(b.names[0])) ? 1 : -1;
    }
}

var isDebug = process.env.NODE_ENV !== 'production';
var add = function (e, c = true) { return c ? e : undefined; }
var addProduction = function(e) { return add(e, !isDebug); }
var addDevelopment = function (e) { return add(e, isDebug); }
var notEmptyItems = function (element, def = []) {
    if (Array.isArray(element)) return element.filter(e => !!e);
    if (typeof element === 'object') return Object.keys(element).reduce((result, key) => {
        if (!!element[key]) result[key] = element[key];
        return result
    }, {});
    return element || def;
};

var dest = 'build';

var config = {
    entry: {
        app: [
            'babel-polyfill',
            './index.tsx' // the entry point of our app
        ]
    },
    output: {
        filename: '[name].bundle.js',

        path: resolve(__dirname, dest),

        publicPath: './'
        // necessary for HMR to know where to load the hot update chunks
    },

    context: resolve(__dirname, 'client'),

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['node_modules']
    },

    module: {
        rules: [
            {
                test: /\.js(x?)$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader?cacheDirectory',
                }]
            }, {
                test: /\.ts(x?)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory',
                    }, {
                        loader: 'ts-loader?' + JSON.stringify({
                            transpileOnly: true
                        })
                    }
                ]
            }, {
                test: /(client).*\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?modules&camelCase&sourceMap&importLoaders=1&localIdentName=[name]_[local]___[hash:base64:5]',
                        'postcss-loader?config=' + resolve(__dirname),
                        'typed-css-modules-loader?camelCase'
                    ]
                })
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "file-loader"
            }
        ]
    },

    devtool: isDebug ? 'inline-source-map' : undefined,

    plugins: notEmptyItems([
        //new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            minChunks: isExternal()
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'react',
            chunks: ['vendors'],
            minChunks: isExternal(/^react/i)
        }),

        addProduction(new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })),

        addProduction(new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),

        new ExtractTextPlugin({
            filename: 'style.css',
            disable: process.env.NODE_ENV !== 'production',
            allChunks: true
        }),

        new CopyPlugin([
            { from: '../node_modules/bootstrap/dist/css/bootstrap.min.css' },
        ]),

        new HtmlPlugin({
            filename: 'index.html',
            template: resolve(__dirname, './client/index.html'),
            chunksSortMode: sortPackages(['vendors', 'app'])
        }),

    ])
};

module.exports = config;
