import React from 'react'

import Folder from 'Images/folder.png'
import BlankFile from 'Images/blank_file.png'

export default function OfflineSpredFile({file,goToNextFolder, date_c, date_m}) {
  return (
    <div className='file_spred' onDoubleClick={goToNextFolder}>
        <img src={file.type==="Folder" ? Folder : BlankFile} alt="icon" />
        <p>{file.name.length > 10 ? file.name.slice(0,10)+'...' : file.name}</p>
    </div>
  )
}
