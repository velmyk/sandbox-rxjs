const path = require('path');

module.exports = {
    context: path.join(__dirname, 'ps-course'),
    entry: './main',
    output: {
        path: path.join(__dirname, 'ps-course'),
        filename: 'bundle.js'
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