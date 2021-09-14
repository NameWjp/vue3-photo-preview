# vue3-photo-preview
vue3 的图片预览组件

### 特点
1. 基于 typescript 
2. 支持桌面端和移动端
3. 支持左右切换导航、上/下滑关闭、双击放大/缩小、双指放大/缩小、键盘导航/关闭、点击切换控件

Demo: [https://namewjp.github.io/vue3-photo-preview/](https://namewjp.github.io/vue3-photo-preview/)

## 开始使用
### 安装
```
npm install -S vue3-photo-preview
```
### 全局注册
```js
import vue3PhotoPreview from 'vue3-photo-preview';
import 'vue3-photo-preview/dist/index.css';

app.use(vue3PhotoPreview);
```

### 使用
```html
<template>
  <photo-provider>
    <photo-consumer v-for="src in imgList" :intro="src" :key="src" :src="src">
      <img :src="src" class="view-box">
    </photo-consumer>
  </photo-provider>
</template>
```

## API
### PhotoProvider
| 名称 | 类型 | 描述 | 默认值 |
| :-----| :---- | :---- | :---- |
| photoClosable | boolean | 图片点击是否关闭 | false |
| maskClosable | boolean | 背景点击是否关闭 | true |
| shouldTransition | boolean | 箭头切换是否需要过渡 | false |

### PhotoConsumer
| 名称 | 类型 | 描述 | 默认值 |
| :-----| :---- | :---- | :---- |
| *src | string | 图片地址 | - |
| intro | string | 图片介绍 | '' |

## 本地开发调试

1. 在根目录依次执行
```bash
# 安装依赖
npm ci

# 构建一次结果
npm run build

# 实时编译代码
npm run dev
```

2. 进入 example 目录依次执行
```bash
# 安装依赖
npm ci 

# 实时编译代码
npm run dev
```

此时，修改 **根目录** 或者 **example目录** 的任何代码都会导致项目重新打包构建。 


参考：[https://github.com/MinJieLiu/react-photo-view](https://github.com/MinJieLiu/react-photo-view)
