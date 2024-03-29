
### fs.watchFile
翻下node的文档就会看到一个满足我们需求的Apifs.watchFile(毕竟是文件相关的操作，很大可能就在fs模块下面了)。
```
fs.watchFile(filename[, options], listener)
```
- filename 显然就是文件名
- options 可选 对象 包含以下两个属性

    - persistent 文件被监听时进程是否继续，默认true
    - interval 多长时间轮训一次目标文件，默认5007毫秒
- listener 事件回调 包含两个参数
    - current 当前文件stat对象
    - prev 之前文件stat对象
看完参数信息，不知道大家有没有从其参数属性中得到点什么特别的信息。特别是interval选项和listener中的回调参数。

监控filename对应文件，每当访问文件时会触发回调。

这里每当访问文件时会触发，实际指的是每次切换之后再次进入文件，然后保存之后，无论是否做了修改都会出发回调。
```
const fs = require('fs')
const filePath = './index.js'
console.log(`正在监听 ${filePath}`);
fs.watchFile(filePath, (cur, prv) => {
    if (filePath) {
        // 打印出修改时间
        console.log(`cur.mtime>>${cur.mtime.toLocaleString()}`)
        console.log(`prv.mtime>>${prv.mtime.toLocaleString()}`)
        // 根据修改时间判断做下区分，以分辨是否更改
        if (cur.mtime != prv.mtime){
            console.log(`${filePath}文件发生更新`)
        }
    }
})
```

能用fs.watch的情况就不要用watchFile了。一是效率，二是不能准确获知修改状态 三是只能监听单独文件
### fs.watch
首先用法如下：

```
fs.watch(filename[, options][, listener])
```
跟fs.watchFile比较类似。

- filename 显然就是文件名
- options 可选 对象或者字符串 包含以下三个属性
    - persistent 文件被监听时进程是否继续，默认true
    - recursive 是否监控所有子目录，默认false 即当前目录，true为所有子目录。
    - encoding 指定传递给回调事件的文件名称，默认utf8

- listener 事件回调 包含两个参数
    - eventType 事件类型，rename 或者 change
    - filename 当前变更文件的文件名  

options如果是字符串，指的是encoding。

监听filename对应的文件或者文件夹(recursive参数也体现出来这一特性)，返回一个fs.FSWatcher对象。

该功能的实现依赖于底层操作系统的对于文件更改的通知。 所以就存在一个问题，可能不同平台的实现不太相同。



```
const fs = require("fs");
const md5 = require("md5");
let preveMd5 = null;
let fsWait = false;
const filePath = './'
console.log(`正在监听${filePath}`,)
fs.watch(filePath,(event,filename)=>{
    console.log('event',event,filename,filePath+filename)
    if(filename){
        if(fsWait){
            return 
        }
        fsWait = setTimeout(()=>{
            fsWait = false
        },100)
        // console.log('fs.readFileSync(filePath+filename)',fs.readFileSync(filePath+filename))
        let currentMd5 = md5(fs.readFileSync(filePath+filename))
        // console.log('ss',currentMd5)
        if(currentMd5 === preveMd5){
            return 
        }
        preveMd5 = currentMd5
        console.log('文件发生改动',currentMd5,filePath+filename)
    }
})
```