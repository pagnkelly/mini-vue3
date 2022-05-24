# mini-vue3
vue3的mini仓库，用于学习理解vue3


## 代码阅读指南

> 根据tests和example目录查看。（由于代码都是由TDD模式驱动编写，所以，根据测试用例，查看具体实现，是一种比较思路清晰的方式,而非从入口看，部分看完再综合看一下会记忆深刻）

### tests目录

```sh
# npm test
# yarn test
# 全部文件
pnpm test
# 个别文件
pnpm test [相应文件]

```

### example目录

安装vscode插件

![live-server](https://gift-static.hongyibo.com.cn/static/kfpub/7632/WX20220522-215018@2x.png)

![use](https://gift-static.hongyibo.com.cn/static/kfpub/7632/WX20220522-215053@2x.png)

### Vue整体架构/目录

```

                                    +---------------------+
                                    |                     |
                                    |  @vue/compiler-sfc  |
                                    |                     |
                                    +-----+--------+------+
                                          |        |
                                          v        v
                      +---------------------+    +----------------------+
                      |                     |    |                      |
        +------------>|  @vue/compiler-dom  +--->|  @vue/compiler-core  |
        |             |                     |    |                      |
   +----+----+        +---------------------+    +----------------------+
   |         |
   |   vue   |
   |         |
   +----+----+        +---------------------+    +----------------------+    +-------------------+
        |             |                     |    |                      |    |                   |
        +------------>|  @vue/runtime-dom   +--->|  @vue/runtime-core   +--->|  @vue/reactivity  |
                      |                     |    |                      |    |                   |
                      +---------------------+    +----------------------+    +-------------------+
```

可以按照 `reactivity` => `runtime-core` => `runtime-dom` => `compiler-core`的顺序去看

## 个人理解

### reactivity

无非那么几个api

|api|一句话|
|---|---
|reactive| 基于proxy, get收集依赖，set触发依赖
|ref| 针对value的get/set做收集触发依赖，如果value是个对象，其实是个reactive
|effect|依赖收集触发都和他相关，和响应式对象绑定
|computed | 基于effect,配合value的get操作，对值缓存
|readonly| 基于proxy, 只读，不能set
|shallowReadonly | 浅层readonly

### runtime-core

### runtime-dom

操作真实dom的操作都在这个模块

```js
// 创建元素
createElement,
// 设置属性
patchProps,
// 插入节点
insert,
// 删除节点
remove,
// 设置文本元素
setElementText
```

### compiler-dom
目标：实现template TO code
方式：把`ast` `transform` 成容易 生成代码的样子
```js

// <div>hi,{{message}}</div>


exports[`codegen element 1`] = `
"const { toDisplayString:_toDisplayString, createElementVNode:_createElementVNode } = Vue
return function render(_ctx, _cache){return _createElementVNode('div', null, 'hi,' + _toDisplayString(_ctx.message))}"
`;
```