import React,{useState,useRef,useEffect} from 'react'
import './App.css'
import {API} from './API'
import DirPanel from './DirPanel';
import Dirdialog from './Dirdialog';

export default function PathInput({useStorage,desc,onUpdate,showFile,useCheckBox,browsePanel,targPath}) {    
    if(useStorage){
        var s = localStorage.getItem(desc);
        targPath = (s !== null)?s:targPath;
    }
    
    var [input] = [useRef(),useRef()];
    var [path,setPath] = useState(targPath);
    var [validBasePath,setBase] = useState("");
    var [isBrowsing,setBrowse] = useState(!browsePanel);
    var [isSort,setSort] = useState(false);
    var [dirList,setList] = useState([]);

    //note : without this path would remain the same useState default value is only set once.
    useEffect(()=>{
        setPath(targPath);
    },[targPath])

    function goBack(){
        var prev = path;
        if(prev.endsWith('/') && prev.length > 1){
            prev = prev.substr(0,prev.length-1);
        }
        prev = prev.substr(0,prev.lastIndexOf("/")+1);
        //console.log(`${prev} ${targPath} ${path}`)
        if(prev.includes(targPath) || useStorage){
            setPath(prev)
        }
    }

    function refresh(){
        if(showFile && path === '') return;

        console.log(`${desc} : ${path} , ${targPath}`)
        input.current.value = path;
        var res = API.getFiles(path);
        res.then((e)=>{
            try{
                var {base,exists,files} = JSON.parse(e);
                if(exists){
                    input.current.style.borderColor = "greenyellow";
                    setBase(base);
                    if(typeof onUpdate == 'function')
                        onUpdate(base);
                    setList(files.filter((v)=>v.isDir || showFile ));
                    if(useStorage)
                        localStorage.setItem(desc,path);
                }
                else
                    input.current.style.borderColor = "red";
            }
            catch{
                console.log(e);
            }
            setSort(false);
        })
        return ()=>API.stop();//stop every thing folder navigation is top priority.
    }
    useEffect(refresh,[path]);

    return (
        <div>
            <p hidden={!browsePanel}>{desc}:
                <input style={{width:"75%"}} type="text" ref={input} onChange={(e)=>setPath(e.target.value)}/>
                <button onClick={()=>setBrowse(true)}>browse</button>
            </p>
            <fieldset hidden={!isBrowsing}>
                <DirPanel goBack={goBack} refresh={refresh}/>
                <button hidden={!useCheckBox} onClick={()=>setSort(true)}>sort by size</button>
                <Dirdialog 
                    dirList={dirList}
                    validBasePath={validBasePath} 
                    useCheckBox={useCheckBox}
                    useSize={isSort} 
                    setPath={setPath}/>

                <div style={{float:"right"}} hidden={!browsePanel}>
                    <button onClick={()=>setBrowse(false)}>select</button>
                </div>
            </fieldset>
        </div>
    )
}
