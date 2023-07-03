## ChatGPT - Genie AI  插件微调

### 1. 菜单翻译

![image-20230703120919524](README.assets/image-20230703120919524.png)

### 2. 默认使用接口代理

https://proxy.aidashi.wiki/

免费key，无需翻墙， 详情访问上面的链接

### 3. Prompt 调整，增加中文响应

![1](README.assets/1.png)



建议先阅读教程《借助ChatGPT提高编程效率指南》：https://mp.weixin.qq.com/s/DBi6EqrKnDCf5oe1IL5H5A

### 4. 增加模型

新增并默认使用最新的模型：`gpt-3.5-turbo-16k-0613`

支持大段代码提问。

### 5. 打包成  `.vsix` 文件

打包后的文件，可以直接安装到vscode

```bash
# 安装打包工具
npm install -g vsce
# 打包
vsce package
```

