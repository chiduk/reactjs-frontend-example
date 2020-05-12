const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [
        'babel-polyfill'
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            { test: /\.css$/, use: 'css-loader' },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(gif|svg|jpg|png)$/,
                loader: "file-loader",
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }

        ]
    }
};