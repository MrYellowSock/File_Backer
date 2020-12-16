import fs from 'fs';
import path from 'path'
import engine from './Ignorer'
import async, { forEachSeries } from 'async';
import { EventEmitter} from "events"


interface folderItem{
    isDir:boolean,
    name:string,
    isIgnored:boolean
}
interface dirResult{
    base:string,
    exists:boolean,
    files:folderItem[]
}
interface sizeCallback{
    (err:Error|null|undefined,total:number):void
}
interface errCallback{
    (err:Error|null|undefined):void
}
interface pathLists{
    dirList:string[];
    fileList:string[];
}

//independent funcs
function isDir(value:string){
    if(fs.existsSync(value)){
        return fs.lstatSync(value).isDirectory();
    }
    return false;
}
function createName():string{
    let d:Date = new Date();
    let gen:string = "backUp:"+d.toUTCString().replace(' ','');
    return gen;
}
function createCpPath(target:string,item:string,output:string):string{
    return path.join(output,item.replace(path.normalize(target),""));
}


function readSizeRecursive(item:string, cb:sizeCallback,pList?:pathLists) {
    if(engine.isIgnored(item)){
        cb(null,-1);
    }
    else{
        fs.lstat(item, function(err, stats) {
            if(!err){
              if (stats.isDirectory()) {
                  if(pList){
                    pList.dirList.push(item);
                  }
                  let total:number = stats.size;//directory entry size
                  engine.add(item);
                  fs.readdir(item, function(err, list) {
                    if (err) return cb(err,0);
            
                    async.forEach(
                      list,
                      function(diritem, callback) {
                        readSizeRecursive(path.join(item, diritem), function(err, size) {
                          total += size;
                          callback(err);
                        },pList); 
                      },  
                      function(err) {
                        cb(err, total);
                      }   
                    );  
                  }); 
              }
              else if(stats.isFile()){
                  fs.stat(item,(err,stats)=>{
                      if(pList){
                        pList.fileList.push(item);
                      }
                      cb(err,stats.size);
                  })
              }
              else{
                  cb(err,0);
              }
            }   
            else {
              cb(err,0);
            }   
        }); 
    }
}   
async function getSizeAsync(Path:string,pList?:pathLists):Promise<string>
{
    var prom:Promise<string> = new Promise((resolve,reject)=>{
        readSizeRecursive(Path, (err, total) => {
            if (err) { return reject(err); }
            return resolve(total.toString())
        },pList);
    })
    return prom;
}

function getFiles (base:string):dirResult{//get everything dir and file
    var result:dirResult = {base:base,exists:isDir(base),files:[]}
    if(result.exists){
        try{
            let fileList : string[] = fs.readdirSync(base,{withFileTypes:false}) as string[]; 
            
            engine.add(base);

            result.files = fileList.map((value)=>{
                let fullPath:string = path.join(base,value as string);
                let x:folderItem = {isDir: fs.lstatSync(path.join(fullPath)).isDirectory(),name:value,isIgnored:false};
                x.isIgnored = engine.isIgnored(fullPath);
                return x;
            });
        }
        catch(e){
            if(e.code === 'EACCES')
                result.exists = false;  //permission denied!
            else
                throw e;
        }
    }
    return result;
}

interface progessCallBack{
    (err:Error|null|undefined,cnt:number):void
}
class Progress extends EventEmitter{
    public readonly fullVal:number;
    private curVal:number;
    private readonly thereshold:number;
    private counter:number;
    private trigger:number;
    constructor(fullValue:number){
        super();
        this.fullVal = fullValue;
        this.curVal = 0;
        this.thereshold = Math.floor(fullValue/100);
        this.counter = 0;
        this.trigger =-1;
    }
    add(){
        this.counter += 1;
        this.curVal += 1;
        if(this.curVal > this.fullVal)
            throw new Error("fullValue overflowed!");
        if(this.counter >= this.thereshold || this.curVal == this.fullVal){
            this.counter = 0;
            this.emit('progress');
        }
        if(this.curVal == this.trigger)
            this.emit("trigger");
    }
    setTrigger(value:number){
        this.trigger = value;
    }
    get value(){
        return Math.floor((this.curVal/this.fullVal)*100);
    }
}

function copyAsync(pList:pathLists,output:string,cb:progessCallBack){
    let prog:Progress = new Progress(pList.fileList.length+pList.dirList.length)
    prog.setTrigger(pList.dirList.length);
    prog.once('trigger',()=>{
        for(var p of pList.fileList){
            fs.copyFile(p,path.join(output,p),(err)=>{
                if(err) cb(err,prog.value);
                prog.add();
            })
        }
    });
    prog.on('progress',()=>{
        cb(null,prog.value);
    })
    for(var p of pList.dirList){
        fs.mkdir(path.join(output,p),{recursive:true},(err)=>{
            if(err) cb(err,prog.value);
            prog.add();
        });
    }
}
interface strArray{
    [index:string]:string
}
function generateBackup(targList:string[],output:string,cb:progessCallBack){
    if(!fs.existsSync(output)){
        cb(Error("provided output not exists"),100);
            return;
    }
    for(var target of targList){
        if(!(fs.existsSync(target))){
            cb(Error("provided paths not exists"),100);
            return;
        }
    }
    
    output = path.join(output,createName());
    let result:string = output;
    let dupl:number = 0;
    while(fs.existsSync(result)){
        dupl += 1;
        result = `${output}(${dupl})`;
    }
    let res:pathLists = {fileList:[],dirList:[]};

    let done:number = 0;
    let len:number = targList.length;
    for(var target of targList){
        console.log("getting size infomation for "+target);
        getSizeAsync(target,res).then((byte)=>{
            console.log(`${res.dirList.length} dirs , ${res.fileList.length} files , total:${byte}bytes`)
            done += 1;
            if(done == len){
                console.log(res);
                copyAsync(res,output,cb);
            }
                
        });    
    }
    

}
//generateBackup('/home/ss','/tmp')


export {getFiles,getSizeAsync,generateBackup}