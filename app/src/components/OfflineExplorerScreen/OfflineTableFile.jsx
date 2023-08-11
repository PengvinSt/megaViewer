import React from 'react'

import Folder from 'Images/folder.png'
import BlankFile from 'Images/blank_file.png'

export default function OfflineTableFile({file,goToNextFolder, date_c, date_m}) {
  return (
    <div className="file"  onClick={goToNextFolder}>
        <p className="name" ><img src={file.type==="Folder" ? Folder : BlankFile} alt="icon" />{file.name.length > 25 ? file.name.slice(0,23)+'...' : file.name}</p>
        <p className="type">{file.type}</p>
        <p className="date-created">{date_c}</p>
        <p className="date-modified">{date_m}</p>
    </div>
  )
}
