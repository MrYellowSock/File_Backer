import React, { useState } from 'react';
import PathInput from './PathInput';
import Compiler from './Compiler';
import Picker from './Picker';

function emptyArr (){
  var listLen = localStorage.getItem("listLen");
  if(listLen !== null && !Number.isNaN(+listLen))
    listLen = +listLen;
  else{
    listLen = 1;
  }

  var arr = [];
  for(var i=0;i<listLen;i++)
    arr.push("");
  return arr;
}
function App() {

  var [targList,setList] = useState(emptyArr());
  var [outPath,updateOut] = useState("");

  function changeList(){
    localStorage.setItem("listLen",targList.length.toString());
    setList([...targList])
  }
  return (
    <>
      <button onClick={()=>{
        targList.push("");
        changeList();
      }}>+</button>
      <button onClick={()=>{
        targList.pop();
        changeList();
      }}>-</button>
      {targList.map((val,i)=>{
        return <Picker index={i} targChanged={(targ)=>{
          targList[i] = targ;
          setList([...targList]);
        }}/>
      })}
      <PathInput useStorage={true} 
                 showFile={false} 
                 useCheckBox={false} 
                 browsePanel={true} 
                 desc="Output Folder" 
                 targPath=""
                 onUpdate={updateOut}/>
      <Compiler targList={targList} outPath={outPath}/>
    </>
  );
}

export default App;
