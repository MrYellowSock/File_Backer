import ignore from 'ignore'//allowJs flag is used for this.
import path from 'path';
import fs from 'fs';

const ignoreFileName = '.sonignore';

interface TestResult {
    ignored: boolean
    // true if the `pathname` is finally unignored by some negative pattern
    unignored: boolean
  }
interface IgPair{
    [index:string]:any
}

class Engine {
    list:IgPair;
    constructor(){
        this.list = [];
    }
    watch(igPath:string,basePath:string){
        fs.watchFile(igPath,{persistent:true,interval:500},(cur,prev)=>{
            if(cur.isFile()){
                let content : string = fs.readFileSync(igPath,{encoding:'utf-8'});
                this.list[basePath] = ignore().add(content);
                console.log(`${basePath} updated:\n${content}`);                        
            }
            else{
                delete(this.list[basePath]);
                console.log(`${basePath} ignore file deleted.`);
            }
        })
    }
    add(basePath:string):void{
        basePath = path.normalize(basePath);
        if(typeof this.list[basePath] === 'undefined'){//making sure filewatch is called once per file.
            let igPath:string = path.join(basePath,ignoreFileName);
            //find ignore file
            if(fs.existsSync(igPath)){
                let content : string = fs.readFileSync(igPath,{encoding:'utf-8'});
                this.watch(igPath,basePath);
                this.list[basePath] = ignore().add(content);
                console.log(content);
            }
        } 
    }
    isIgnored(Path:string):boolean{
        let last:boolean = false;
        if(Path !== ""){
            Path = path.normalize(Path);
            let matches:string[] = Object.keys(this.list).filter((p)=>Path.includes(p));
            matches = matches.sort((a:string,b:string)=>a.length-b.length);
            for(let p of matches){
                let localPath :string = path.relative(p,Path);
                if(localPath == "")
                    continue;
                //console.log(`check ${p} ${localPath}`);

                let testRes :TestResult =this.list[p].test(localPath);
                last = testRes.ignored;
                if(testRes.unignored)
                    last = false;

                //console.log(`${last}->${testRes.ignored}+${testRes.unignored}`);
                if(last)
                    return true;
            }
        }
        return last;
    }
}

export default (new Engine());