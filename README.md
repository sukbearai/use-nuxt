<br>

<p align="center">
<img src="https://api.iconify.design/fluent-emoji:dog-face.svg" style="width:100px;" />
</p>

<h1 align="center">UseNuxt</h1>

<p align="center">
一个快速用于 QT Web 前端的基础模板，用 Nuxt 3.13.0 开发！🫶
</p>

## 使用

```bash
corepack enable
npx degit sukbearai/qt-web-ui my-qt-webui
cd my-qt-webui
pnpm i # If you don't have pnpm installed, run: npm install -g pnpm
```

## QT调试

```c++
// c++ 开启调试端口
qputenv("QTWEBENGINE_REMOTE_DEBUGGING", "6483");

// 浏览器访问调试端口 chrome://inspect/#devices
```

## 部署

配置访问路径

```ts
export default defineNuxtConfig({
  app: {
    baseURL: '/'
  }
})
```

打包编译

```bash
pnpm run generate
```

将`.output`文件夹下的整个`public`目录内容放置于文件服务器访问目录即可

## 致谢

- [vitesse-nuxt](https://github.com/antfu/vitesse-nuxt)
- [element-plus-nuxt](https://github.com/element-plus/element-plus-nuxt)
- [alova](https://github.com/alovajs/alova)
- [IofTV-Screen-Vue3](https://github.com/sukbearai/IofTV-Screen-Vue3)
