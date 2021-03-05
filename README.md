# Chunk Change Time Webpack Plugin

A Webpack plugin to record chunk chang time

<a href="https://www.npmjs.com/chunk-change-time-webpack-plugin" target="_blank"><img src="https://img.shields.io/npm/v/chunk-change-time-webpack-plugin.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/chunk-change-time-webpack-plugin" target="_blank"><img src="https://img.shields.io/npm/l/chunk-change-time-webpack-plugin.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/chunk-change-time-webpack-plugin" target="_blank"><img src="https://img.shields.io/npm/dm/chunk-change-time-webpack-plugin.svg" alt="NPM Downloads" /></a>

### install

```javascript

npm i chunk-change-time-webpack-plugin

```
### API

| name | valueType | value/def-value| description |
|----|----|----|----|
|name | string |chunk-change-time-webpack-plugin | custom name|
|ignoreSorceMapInfoBool | boolen | true | ingore sorce-map file change information|

### use

```javascript

new chunkChangeWebpackPlugin({
    name:'chunk-change-time-webpack-plugin',
    ignoreSorceMapInfoBool:true, 
}),
```



### result

![png](./src/img.png)
