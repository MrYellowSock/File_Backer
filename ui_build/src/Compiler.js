import React,{useState} from 'react'
import {API} from './API';

export default function Compiler({targList,outPath}) {
    var [logLevl,setLevel] = useState(false);
    var [log,setLog] = useState("");
    var [isCompiling,setComp] = useState(false);
    var [progress,setProg] = useState(0);
    return (
        <>
            <div style={{textAlign:"center"}}>
                <progress value={progress} max="100"/>
                <button style={{float:"right"}} disabled={isCompiling} onClick={()=>{
                    if(!isCompiling){
                        if(targList.filter((p)=>p.length===0).length > 0)
                        {
                            setLevel(true);
                            setLog("Bad Path!");
                            return;
                        }
                        setComp(true);
                        setLevel(false);
                        setLog(`compile target:${targList}  ,  output:${outPath}`);
                        console.log(targList);
                        var xhr = API.streamCompileStatus(targList,outPath);
                        xhr.onprogress = ()=>{
                            setProg(xhr.responseText.length);
                        }
                        xhr.onloadend = ()=>{
                            setComp(false);
                            setProg(0);
                        }
                        
                    }
                    else{
                        setLevel(true);
                        setLog("dont press me!");
                    }
                }}>{(isCompiling)?"COMPILING":"COMPILE"}</button>
            </div>

            <div className="log" style={{color:((logLevl)?"red":"white")}}>
                {log}
            </div>
        </>
    )
}
