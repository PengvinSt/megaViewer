import React, { useEffect, useState } from 'react'

import Folder from 'Images/folder.png'
import BlankFile from 'Images/blank_file.png'
import { useContextStore } from '../../states/ContextState'

export default function OfflineSpredFile({file,goToNextFolder, date_c, date_m}) {

  const [isFullName, setIsFullName] = useState(false)

  const [classArr, setClassArr] = useState(['file_spred'])

  const contextData = useContextStore((state)=> state.contextData)
  const setContextData = useContextStore((state)=> state.setContextData)

  const clickHandleFunc = ()=>{
    setIsFullName(!isFullName)
    if(!classArr.includes('file_spred_chosen')){
      setClassArr(arr=> [arr, 'file_spred_chosen'])
    }else {
      setClassArr(['file_spred'])
    }
  }

  return (
    <div className={classArr.join(' ')}
    onDoubleClick={goToNextFolder}
    onClick={()=>clickHandleFunc()}
    onContextMenu={(e)=>{
      e.preventDefault();
      console.log(file)
      setContextData(file)
    }}  
    >
    {file.type==="Folder" ? <img src={Folder} alt="icon" /> : <div className="file-icon file-icon-lg" data-type={file.name.split('.').slice(-1)[0].length >4 ? '?' : file.name.split('.').slice(-1)[0]}></div>}
        <p>{isFullName ? file.name : file.name.length > 10 ? file.name.slice(0,10)+'...' : file.name}</p>
    </div>
  )
}
