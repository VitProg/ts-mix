const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProd = process.argv.includes('--production');
const isWatch = process.argv.includes('--watch');

module.exports = [
    {
        watch: isWatch,
        mode: isProd ? 'production' : 'development',
        target: 'web',
        entry: {
            'ts-mix': path.resolve(__dirname, 'src', 'index.ts'),
        },
        output: {
            pathinfo: false,
            filename: isProd ? 'index.js' : undefined,
            path: path.resolve(__dirname, isProd ? 'dist' : 'test'),
            publicPath: '/',
            libraryTarget: 'umd',
            library: 'ts-mix',
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        plugins: isProd ? [] : [
            new CopyPlugin([
                'src/index.html',
            ]),
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve(__dirname, isProd ? 'tsconfig.prod.json' : 'tsconfig.es2015.json'),
                                compilerOptions: {
                                    sourceMap: !!isProd,
                                },
                            },
                        },
                    ],
                    enforce: 'pre',
                },
            ],
        },
        devtool: 'inline-source-map',
        stats: 'verbose',
        optimization: isProd ?
            {
                minimizer: [
                    new TerserPlugin({
                        cache: true,
                        parallel: true,
                        terserOptions: {
                            compress: false,
                            mangle: false,
                            keep_classnames: true,
                            keep_fnames: true,
                            output: {
                                comments: false,
                                beautify: true,
                            },
                        },
                        sourceMap: false,
                    }),
                ],
            } : undefined,
    },
];
