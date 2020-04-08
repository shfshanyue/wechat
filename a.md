## 01 http 状态码 502 和 504 有什么区别

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/51)

* 502 Bad Gateway
The server was acting as a gateway or proxy and received an invalid response from the upstream server.
收到了上游响应但无法解析

* 504 Gateway Timeout
The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
上游响应超时


## 02 什么是 virtual DOM，它的引入带了什么好处

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/70)

- 虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种 GUI。
-  vdom 把渲染过程抽象化了，从而使得组件的抽象能力也得到提升，并且可以适配 DOM 以外的渲染目标。


- Virtual DOM 在牺牲(牺牲很关键)部分性能的前提下，增加了可维护性，这也是很多框架的通性。
实现了对 DOM 的集中化操作，在数据改变时先对虚拟 DOM 进行修改，再反映到真实的 DOM中，用最小的代价来更新DOM，提高效率(提升效率要想想是跟哪个阶段比提升了效率，别只记住了这一条)。
- 打开了函数式 UI 编程的大门。
- 可以渲染到 DOM 以外的端，使得框架跨平台，比如 ReactNative，React VR 等。
- 可以更好的实现 SSR，同构渲染等。这条其实是跟上面一条差不多的。
- 组件的高度抽象化。

> 虚拟 DOM 的缺点
- 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。
- 虚拟 DOM 需要在内存中的维护一份 DOM 的副本(更上面一条其实也差不多，上面一条是从速度上，这条是空间上)。
- 如果虚拟 DOM 大量更改，这是合适的。但是单一的，频繁的更新的话，虚拟 DOM 将会花费更多的时间处理计算的工作。所以，如果你有一个DOM 节点相对较少页面，用虚拟 DOM，它实际上有可能会更慢。但对于大多数单页面应用，这应该都会更快。


## 03 http proxy 的原理是什么

<blockquote> 更多描述: 如 `webpack-dev-server` 可以设置 proxy，`nginx` 也可以设置 </blockquote>

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/82)

todo

## 04 随着 http2 的发展，前端性能优化中的哪些传统方案可以被替代

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/85)

1. 雪碧图
1. 资源文件合并

## 05 http2 与 http1.1 有什么不同

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/86)

1. 多路复用
1. 二进制分帧
1. server push
1. 头部压缩

可参考文章 [http2 详解](https://juejin.im/post/5b88a4f56fb9a01a0b31a67e)

## 06 你们的前端代码上线部署一次需要多长时间，需要人为干预吗

<blockquote> 更多描述: 更短的部署时间，更少的人为干预，更有利于敏捷开发 </blockquote>

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/95)

TODO

## 07 gzip 的原理是什么

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/109)

`gzip` 使用了 `LZ77` 算法与 `Huffman` 编码来压缩文件，重复度越高的文件可压缩的空间就越大。

## 08 http 响应头中的 ETag 值是如何生成的

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/112)

关于 `etag` 的生成需要满足几个条件

1. 当文件不会更改时，`etag` 值保持不变。所以不能单纯使用 `inode`
1. 便于计算，不会特别耗 CPU。这样子 `hash` 不是特别合适
1. 便于横向扩展，多个 `node` 上生成的 `etag` 值一致。这样子 `inode` 就排除了

关于服务器中 `etag` 如何生成可以参考 [HTTP: Generating ETag Header](https://stackoverflow.com/questions/4533/http-generating-etag-header)

**那么在 `nginx` 中的 `etag` 是如何生成的？**

### nginx 中 ETag 的生成

我在网上找到一些资料与源代码了解到了 `etag` 的计算方法。由 `python` 伪代码表示计算方法如下

``` python
etag = '{:x}-{:x}'.format(header.last_modified, header.content_lenth)
```

源码: [ngx_http_core_modules.c](https://github.com/nginx/nginx/blob/6c3838f9ed45f5c2aa6a971a0da3cb6ffe45b61e/src/http/ngx_http_core_module.c#L1582)

``` c
etag->value.len = ngx_sprintf(etag->value.data, "\"%xT-%xO\"",
                                  r->headers_out.last_modified_time,
                                  r->headers_out.content_length_n)
                      - etag->value.data;
```

**总结：`nginx` 中 `etag` 由响应头的 `Last-Modified` 与 `Content-Length` 表示为十六进制组合而成。**

随手在我的k8s集群里找个 `nginx` 服务测试一下

``` bash
$ curl --head 10.97.109.49
HTTP/1.1 200 OK
Server: nginx/1.16.0
Date: Tue, 10 Dec 2019 06:45:24 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Tue, 23 Apr 2019 10:18:21 GMT
Connection: keep-alive
ETag: "5cbee66d-264"
Accept-Ranges: bytes
```

由 `etag` 计算 `Last-Modified` 与 `Content-Length`，使用 `js` 计算如下，结果相符

``` js
> new Date(parseInt('5cbee66d', 16) * 1000).toJSON()
"2019-04-23T10:18:21.000Z"
> parseInt('264', 16)
612
```

### Last-Modified，ETag 与协商缓存

我们知道协商缓存有两种方式

+ `Last-Modified`/`if-Modified-Since`
+ `ETag`/`If-None-Match`

既然在 `nginx` 中 `ETag` 由 `Last-Modified` 和 `Content-Length` 组成，那它便算是一个加强版的 `Last-Modified` 了，那加强在什么地方呢？

** `Last-Modified` 是由一个 `unix timestamp` 表示，则意味着它只能作用于秒级的改变**

那下一个问题：[如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改](https://github.com/shfshanyue/Daily-Question/issues/113)


## 09 https 是如何保证报文安全的

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/120)

https主要解决三个安全问题：
1. 内容隐私
2. 防篡改
3. 确认对方身份

https并不是直接通过非对称加密传输过程，而是有握手过程，握手过程主要是和服务器做通讯，生成私有秘钥，最后通过该秘钥对称加密传输数据。还有验证证书的正确性。
证书验证过程保证了对方是合法的，并且中间人无法通过伪造证书方式进行攻击。

## 10 http 响应头中如果 content-type 为 application/octet-stream，则代表什么意思

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/134)

代表二进制流，一般用以下载文件

## 11 js 代码压缩的原理是什么

<blockquote> 更多描述: 我们知道 `javascript` 代码经压缩 (uglify) 后，可以使体积变得更小，那它代码压缩的原理是什么。

如果你来做这么一个功能的话，你会怎么去压缩一段 `js` 代码的体积 </blockquote>

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/138)

https://github.com/mishoo/UglifyJS2

## 12 http 响应头中的 Date 与 Last-Modified 有什么不同，网站部署时需要注意什么

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/142)

`LM-Factor` 与它俩有关。

+ `Date`: 报文在源服务器的产生时间
+ `Last-Modified`: 源服务器上资源的上次修改时间

简而言之，一个静态资源没有设置 `Cache-Control` 时会以这两个响应头来设置强制缓存时间：`(Date - LastModified) * n`，而非直接进行协商缓存。在涉及到 CDN 时，表现更为明显，体现在更新代码部署后，界面没有更新。

## 13 如何进行代码质量检测

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/157)

圈复杂度(Cyclomatic complexity)描写了代码的复杂度，可以理解为覆盖代码所有场景所需要的最少测试用例数量。CC 越高，代码则越不好维护



## 14 js 中什么是可选链

> 在 Issue 中交流与讨论: [Issue 地址](https://github.com/shfshanyue/Daily-Question/issues/202)

`?.` 操作符，可以嵌套获取对象的属性值。通过获取对象属性获得的值可能是 undefined 或 null 时，可选链操作符提供了一种方法来简化被连接对象的值访问。

``` javascript
const o = {}

// 添加可选链之前
o && o.a && o.a.b && o.a.b.c && o.a.b.c.d

// 添加可选链之后
o?.a?.b?.c?.d
```
