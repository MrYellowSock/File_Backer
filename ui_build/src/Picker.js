import React, { useState } from 'react';
import PathInput from './PathInput';

function Picker({index,targChanged}) {
  var [targPath,updateTarg] = useState("");

  return (
    <fieldset>
      <PathInput useStorage={true} 
                 showFile={true} 
                 useCheckBox={true} 
                 browsePanel={true} 
                 desc={"Target Folder"+index} 
                 targPath={targPath}
                 onUpdate={(e)=>{
                    updateTarg(e);
                    targChanged(e);
                 }}/>
    </fieldset>
    
  );
}

export default Picker;
