module.exports = {
	entry: {
		bundle: "./src/index.tsx",
	},
	mode: 'development',
	output: {
		filename: "[name].js",
		globalObject: 'this',
		library: "Dispilio",
		libraryTarget: "umd",
		path: __dirname + "/dist",
		publicPath: '/dist/',
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".wasm"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
			}
		]
	}
}
