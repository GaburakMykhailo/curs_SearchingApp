module.exports = {
    plugins: [
        require('postcss-import')(),
        require('postcss-custom-properties')({ preserve: true }),
        require('autoprefixer')(),
        require('postcss-csso')()
    ]
};
