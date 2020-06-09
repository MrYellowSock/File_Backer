import React from 'react'
import {joinPath,byteToStr} from './API'
import './App.css'

export default function FolderItem({item,validBasePath,useCheckBox,useSize,setPath}) {
    var para = null;
    if(item.isDir)
        para = (<p className="dir" 
        onClick={(e)=>setPath(joinPath(validBasePath,e.target.innerText))}>
        {useCheckBox?<input type="checkbox" checked={!item.isIgnored} />:null}{item.name}
        </p>);
    else
        para = (<p className="file">
        {useCheckBox?<input type="checkbox" checked={!item.isIgnored}/>:null}{item.name}
        </p>);
    if(useSize)
        return (<tr>
            <td style={{width:"100%"}}>
                {para}
            </td>
            <td style={{textAlign:"right"}}>
                <p>{byteToStr(item.byte)}</p>
            </td>
        </tr>)
    else
        return para;
}
