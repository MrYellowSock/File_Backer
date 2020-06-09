import React, { useState ,useEffect} from 'react'
import FolderItem from './FolderItem';
import "./App.css"
import { API, joinPath,byteToStr } from './API';

function contact(item,sorted,setSorted,validBasePath){
    API.getSize(joinPath(validBasePath,item.name)).then((e)=>{
        if(!Number.isNaN(+e)){
            e = +e;
            if(e === -1){
                item.isIgnored = true;
                e = 0;
            }
        }
        item.byte = e;
        sorted = sorted.sort((a,b)=>{
            if(typeof a.byte === "number" && typeof a.byte === "number")
                return b.byte - a.byte;
            else
                return 0;
        })
        setSorted([...sorted]);
    })
}
function getTotal (list,useSize){
    if(useSize)
        return byteToStr(list.reduce((prev,cur)=>{
            if(typeof cur.byte == 'number' && !cur.isIgnored)
                return prev+cur.byte;
            else
                return prev;
        },0)); 
    else
        return ""
}

export default function Dirdialog({dirList,validBasePath,useCheckBox,useSize,setPath}) {
    //var [sorted,setSorted] = useState([]);    
    var [sorted,setSorted] = useState(dirList);
    useEffect(() => {
        if(useSize){
            for(var item of sorted){
                if(typeof item.byte === 'undefined'){
                    contact(item,sorted,setSorted,validBasePath);
                }
            }
        }
    }, [validBasePath,useSize])
    useEffect(() => {
        setSorted([...dirList]);
    }, [dirList]);

    return (
        <>
            <label style={{float:"right"}}>{getTotal(sorted,useSize)}</label>
            <div className="dirdialog">
                {sorted.map((item,index)=>{
                    return <FolderItem 
                        key={index} 
                        item={item} 
                        validBasePath={validBasePath} 
                        useCheckBox={useCheckBox}
                        useSize={useSize} 
                        setPath={setPath}
                    />
                })}
            </div>
        </>
    )
}
