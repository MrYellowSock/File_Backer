import React, { useState } from 'react';
import PathInput from './PathInput';

function Picker({index,targChanged}) {
  var [targPath,updateTarg] = useState("");

  return (
    <fieldset>
      <PathInput useStorage={true} 
                 showFile={false} 
                 useCheckBox={false} 
                 browsePanel={true} 
                 desc={"Target Folder"+index} 
                 targPath="" 
                 onUpdate={(e)=>{
                    updateTarg(e);
                    targChanged(e);
                 }}/>
      <p style={{color:"gold",marginBottom:"0"}}>Target Folder explorer</p>
      <PathInput showFile={true} 
               useCheckBox={true} 
               browsePanel={false} 
               desc={"You shouldnt see this"+index} 
               targPath={targPath}/>
    </fieldset>
    
  );
}

export default Picker;
