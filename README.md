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
`runtime-core`主要针对vue的js模块代码进行解析，生成虚拟dom,通过`runtime-dom`挂载到页面上。

主要流程是`h(createVNode)`生成虚拟dom，通过`patch`深层递归遍历,针对不同类型的节点进行处理，最后`mount`到真实的dom节点。

还有在更新的时候，为了达到最小的操作dom，减少成本，从而优化的diff更改前后节点，找到最少的更新操作。这就涉及了面试常问的问题

Q: 响应式数据变更时，vue是如何update的？

Q: diff算法的实现是怎样的？

当然还有一些问题你可以从源码中了解

Q: setup返回的数据是怎么给render用的？

Q: nextick的实现？

Q: emit的实现？

Q: renderSlots的实现?

Q: provide, inject的实现?相同的key使用的是哪个？

Q: $el,$slots,$props的实现?

Q: template和render同时存在时会用哪个？(这块`runtime-core`和`compile-core`联系了起来)

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

方式：`parse`出`ast`，把`ast` `transform` 成容易 生成代码的样子
```js

// <div>hi,{{message}}</div>


exports[`codegen element 1`] = `
"const { toDisplayString:_toDisplayString, createElementVNode:_createElementVNode } = Vue
return function render(_ctx, _cache){return _createElementVNode('div', null, 'hi,' + _toDisplayString(_ctx.message))}"
`;

核心: 三个模块`parse` `transform` `codegen`

`parse`

针对不同的类型文本进行解析成ast节点，例如: 文本节点，{{插值节点}}, <div>标签节点</div>

`transform`

编写根据类型解析的transform插件，对接入的顺序有所要求，目的还是根据ast节点，构造成后面`codegen`阶段容易拼接的形态

`codegen`

以字符串的形式根据节点生成上面例子中的代码。

```