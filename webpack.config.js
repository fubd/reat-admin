const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
const chalk = require('chalk');
const os = require('os');

const HOSTNAME = 'http://localhost:4300';

const isProd = process.env.NODE_ENV === 'production';

const theme = {
  'primary-color': '#4072EE',
};

class EnhancedProgressPlugin extends webpack.ProgressPlugin {
  constructor() {
    super();
    this.lastPercentage = 0;
  }

  apply(compiler) {
    super.apply(compiler);

    compiler.hooks.compile.tap('EnhancedProgressPlugin', () => {
      this.startTime = Date.now();
    });

    compiler.hooks.done.tap('EnhancedProgressPlugin', () => {
      const endTime = Date.now();
      const buildTime = ((endTime - this.startTime) / 1000).toFixed(2);

      // 清除进度条
      process.stdout.write('\n\n');

      console.log(chalk.green('Build completed successfully!'));

      console.log('\n' + chalk.cyan('┌────────────────────────────────────────────────────┐'));
      console.log(chalk.cyan('│ ') + chalk.bold('Build Summary'));
      console.log(chalk.cyan('├────────────────────────────────────────────────────┤'));
      console.log(chalk.cyan('│ ') + chalk.white(`Time: `) + chalk.cyan(`${buildTime}s`));
      console.log(chalk.cyan('│ ') + chalk.white(`Mode: ${compiler.options.mode}`));

      // 添加服务器信息
      const port = compiler.options.devServer?.port || 8080;
      console.log(chalk.cyan('│ ') + chalk.white(`Loopback: `) + chalk.green(`http://localhost:${port}/`));
      console.log(
        chalk.cyan('│ ') + chalk.white(`Network (IPv4): `) + chalk.green(`http://${this.getIPv4()}:${port}/`),
      );

      console.log(chalk.cyan('└────────────────────────────────────────────────────┘'));
    });
  }

  handler(percentage, message, ...args) {
    const percent = Math.floor(percentage * 100);
    if (percent !== this.lastPercentage) {
      this.lastPercentage = percent;
      const progressBar = this.getProgressBar(percent);
      const status = `${message} ${args.join(' ')}`;
      process.stdout.write(`\r${progressBar} ${percent}% ${status}`);
    }
  }

  getProgressBar(percent) {
    const width = 20;
    const complete = Math.floor(width * (percent / 100));
    const incomplete = width - complete;
    return (
      chalk.cyan('[') +
      chalk.green('='.repeat(complete)) +
      chalk.white('>') +
      chalk.gray('-'.repeat(incomplete)) +
      chalk.cyan(']')
    );
  }

  getIPv4() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return '127.0.0.1';
  }
}

module.exports = {
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', 'd.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  entry: path.join(__dirname, 'src/index.tsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[contenthash:8].js',
    sourceMapFilename: '[contenthash:8].map',
    chunkFilename: '[contenthash:8].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: 'babel-loader',
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: (resourcePath) => resourcePath.endsWith('.module.less'),
                localIdentName: '[local]_[hash:base64:10]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: theme,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, './public/index.html'),
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash:8].css',
      ignoreOrder: true, // 避免 lazy 加载组件导致样式加载出错
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: '',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new EnhancedProgressPlugin(),
    new CleanWebpackPlugin(),
  ],

  devServer: {
    port: 10110,
    hot: true,
    compress: true,
    allowedHosts: 'all',
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: HOSTNAME,
        changeOrigin: true,
        pathRewrite: {'^/api': '/'},
        secure: false,
      },
    ],
  },

  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 50000,
      minChunks: 1,
      automaticNameDelimiter: '.',
      cacheGroups: {
        reacts: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
          priority: 10,
        },
        cores: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/](ahooks|axios|moment|lodash[A-Za-z0-9_\\-]*)[\\/]/,
          priority: 9,
        },
        antd: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@ant-design|antd|rc-[A-Za-z0-9_\\-]*)[\\/]/,
          priority: 8,
        },
        default: {
          minChunks: 1,
          priority: 1,
          reuseExistingChunk: true,
        },
      },
    },
  },

  stats: false,
};
