## webpack
打包主要处理3个模块的内容，
1. babel-loader/ts-loader/ts 处理 js/ts/jsx/tsx 
2. css/less 模块化
3. 语法检查和风格检查
4. 开发服务器 热更新
5. 优化 代码分割 动态导入


## 语法检查，类型检查和格式检查
依赖 eslint eslint-typescript 插件 和 eslint-prettier 以及 vscode 开启相关配置


## typescript
babel 和 tsc 的编译流程大同小异，都有把源码转换成 AST 的 Parser，都会做语义分析（作用域分析）和 AST 的 transform，最后都会用 Generator（或者 Emitter）把 AST 打印成目标代码并生成 sourcemap。

但是 babel 不做类型检查，也不会生成 d.ts 文件。tsc 支持最新的 es 标准特性和部分草案的特性（比如 decorator），而 babel 通过 @babel/preset-env 支持所有标准特性，也可以通过 @babel/proposal-xx 来支持各种非标准特性，支持的语言特性上 babel 更强一些。

tsc 没有做 polyfill 的处理，需要全量引入 core-js，而 babel 的 @babel/preset-env 会根据 targets 的配置按需引入 core-js，引入方式受 useBuiltIns 影响 (entry 是在入口引入 targets 需要的，usage 是每个模块引入用到的)。

## css less 
MiniCssExtractPlugin 代替 style-loader 将 css 打包到单独的 css 文件，css-loader 将 css 转成 js 模块
less和css 同时开启 模块化。css module 特性：1. 样式只在当前模块有效，不会污染全局 2. 通过js对象形式获取样式类名
