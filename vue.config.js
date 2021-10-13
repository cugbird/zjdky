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
        module: {
            rules: [
                {
                    test: /\.glsl$/,
                    use: [
                        {
                            loader: 'webpack-glsl'
                        }
                    ]
                }
            ]
        }
    },
    // chainWebpack: (config) => {
        
    // },
    devServer: {
        port: 8081
    }
}