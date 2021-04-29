const path = require('path');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: {
        index: './src/index.tsx',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'OrderableList',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true,
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            src: path.join(__dirname, 'src'),
        },
        modules: [
            path.join(__dirname, 'src'),
            'node_modules'
        ],
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
              test: /\.(ts|tsx)$/,
              loader: "ts-loader",
              exclude: [path.resolve(__dirname, "node_modules")],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]_[local]_[hash:base64:3]',
                                exportLocalsConvention: 'dashes',
                            },
                        },
                    },
                    'sass-loader',
                ],
                exclude: [path.resolve(__dirname, "node_modules")],
            },
        ]
    },
    externals: {
      // Don't bundle react or react-dom      
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "React",
        root: "React"
      },
      "react-dom": {
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "ReactDOM",
        root: "ReactDOM"
      }
    }
};