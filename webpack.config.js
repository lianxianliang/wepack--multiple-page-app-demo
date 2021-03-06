const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

const plugins = [
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin(),
];
const entry={};

glob.sync('./src/page/**/entry.js') .forEach(function(src) {
	var name=src.split('/')[3];
	plugins.push(new HtmlWebpackPlugin({
		template: './src/page/' + name + '/html.js', //指定模板
		filename: name + '.html', //指定打包的html文件名称
		inject: 'head', //js放到头部
		chunks: [name] //指定页面加载的entry
	}))
	entry[name]=src;
})

module.exports = {
	entry: entry,
	devtool: 'eval-source-map',
	output: {
		path: __dirname + '/dist',
		filename: 'static/js/[name].js',
		publicPath: '/'
	},
	devServer: {
		contentBase: "./", //本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		port: 4399,
		inline: true,
	},
	module: {
		rules: [{
			test: /(\.jsx|\.js)$/,
			use: {
				loader: "babel-loader",
				options: {
					presets: [
						"es2015"
					]
				}
			},
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			use: [{
				loader: "style-loader"
			}, {
				loader: "css-loader",
				// options: {
				//     modules: true
				// }
			}]
		}, {
			test: /\.json$/,
			loader: 'json-loader'
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				name: 'static/img/[name].[hash:7].[ext]'
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			query: {
				limit: 10000,
				name: 'static/fonts/[name].[hash:7].[ext]'
			}
		}, {
			test: /\.ejs$/,
			// include: dirVars.srcRootDir,
			loader: 'ejs-loader',
		}]
	},
	plugins: plugins
}
