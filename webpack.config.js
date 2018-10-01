const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   entry: './src/app.js',
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
   },
   module: {
      rules: [{
         test: /\.(s[ac]ss)$/,      
         use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
         ]
      },

      {
         test: /\.(jpg|png)$/,
         loader: 'file-loader',
         options: {
            name: '[name].[ext]'
         }
      },

      {
         test: /\.js$/,
         exclude: /node_modules/,
         loader: "babel-loader"
      }


   ]},
   plugins: [
      new MiniCssExtractPlugin({
         filename: "style.css"
      })
   ]
};

if(process.env.NODE_ENV === 'production'){
   module.exports.plugins.push(
      new webpack.optimize.UglifyJsPLugin()
   );
}