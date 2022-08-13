# y-packaging

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).




## npm create
```
npm publish --access=public
```


## npm update
```
npm version后面参数说明：
patch：小变动，比如修复bug等，版本号变动 v1.0.0->v1.0.1
minor：增加新功能，不影响现有功能,版本号变动 v1.0.0->v1.1.0
major：破坏模块对向后的兼容性，版本号变动 v1.0.0->v2.0.0
```

从npm上面卸载自己发布的包
npm unpublish <package-name> -f