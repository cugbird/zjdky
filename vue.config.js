const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    publicPath: "/",
    outputDir: "dist",
    assetsDir: "",
    lintOnSave: true,
    runtimeCompiler: false,
    configureWebpack: {
        plugins: [
            new CopyPlugin([
                {from: 'static', to: 'static'}
            ])
        ],
    },
    devServer: {
        port: 8081
    }
}