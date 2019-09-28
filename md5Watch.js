
// 参考链接  https://www.cnblogs.com/pqjwyn/p/10721825.html
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