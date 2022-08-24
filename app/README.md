#### 设置自动打开浏览器

在 package.json 中添加 --open

```js
"scripts": {
    "serve": "vue-cli-service serve --open",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
},
```

#### eslint 关闭与否

在根目录下创建 vue.config.js 文件，配置如下：

```js
module.exports = {
	// 关闭 eslint
	lintOnSave: false,
};
```

不过还是建议打开，可以提供相应的提示，代码更加精简、有序

#### 为 src 文件夹配置别名

在根目录下创建 jsconfig.json 文件，配置如下：

```js
{
	"compilerOptions": {
		"baseUrl": "./",
		"paths": {
			"@/*": ["src/*"]
		}
	},
	"exclude": ["node_modules", "dist"]
}
```
