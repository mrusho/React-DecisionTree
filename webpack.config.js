module.exports = {
  mode: 'development',
  entry: './src/app.tsx',
  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
  },
  output: {
    filename: "biomarker.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader'
      }
    ]
  },
  devtool: 'source-map'
};
