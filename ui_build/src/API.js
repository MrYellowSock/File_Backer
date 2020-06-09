const port = 4000;
const ip = `http://localhost:${port}/`;

function joinPath(base,name){
    if(base.endsWith('/'))
        return base+name;
    else
        return base+'/'+name;
}
const ranks = ['B','KB','MB','GB'];
function byteToStr(bytes){
    if(typeof bytes !== 'number') return bytes;
    var rank = 0;
    while(bytes >= 1024){
        bytes /= 1024;
        rank += 1;
    }
    return `${Math.round(bytes*100)/100} ${ranks[rank]}`
}

//Asychronous Queue model
class APIMAN{
    constructor(){
        this.reqQueue = [];
        this.xhr = new XMLHttpRequest();
        this.working = false;
        setInterval(()=>{
            if(!this.working)
                this.work()
        },150);
    }
    work(){
        var req = this.reqQueue.shift();
        if(typeof req !== 'undefined'){
            this.working = true;
            var {reqPath,data,callback} = req;
            this.xhr.open('POST',reqPath)
            this.xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
            this.xhr.send(data);
            this.xhr.onload = ()=>{
                callback(this.xhr.responseText);
                this.work();
            };
        }
        else
            this.working = false;
    }

    addReq(reqPath,dirPath,callback){
        this.reqQueue.push({reqPath:ip+reqPath,data:'path='+encodeURIComponent(dirPath),callback:callback});
        //console.log("ADDED");
    }
    getFiles(dirPath){
        return new Promise((resolve,reject)=>{
            this.addReq('getFiles',dirPath,(resp)=>{
                return resolve(resp);
            });
        })
    }
    getSize(Path){
        return new Promise((resolve,reject)=>{
            this.addReq('getSize',Path,(resp)=>{
                return resolve(resp);
            });
        })
    }
    streamCompileStatus(targList,outPath){
        var xhr = new XMLHttpRequest();
        xhr.open("POST",ip+'compile');
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.send(JSON.stringify({targList:targList,outPath:outPath}));
        return xhr;
    }
    stop(){
        this.reqQueue.splice(0,this.reqQueue.length);
        this.xhr.abort();
        this.working = false;
    }
}
const API = new APIMAN();

export {joinPath,API,byteToStr};