# mini-vue3
vue3的mini仓库，用于学习理解vue3


## 代码阅读指南

> 根据tests和example目录查看。（由于代码都是由TDD模式驱动编写，所以，根据测试用例，查看具体实现，是一种比较思路清晰的方式）

### tests目录

```sh
# npm test
yarn test [相应文件]
yarn test 全部文件
```

### example目录

安装vscode插件

![live-server](https://gift-static.hongyibo.com.cn/static/kfpub/7632/WX20220522-215018@2x.png)

![use](https://gift-static.hongyibo.com.cn/static/kfpub/7632/WX20220522-215053@2x.png)

### 整体架构/目录

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