const path = require('path');

module.exports = {
    entry: './main',
    output: {
        path: __dirname,
        fileName: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    }
};