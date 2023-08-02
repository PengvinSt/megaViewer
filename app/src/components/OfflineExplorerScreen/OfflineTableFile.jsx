import React from 'react'

import Folder from 'Images/empty_folder.png'
import BlankFile from 'Images/blank_file.png'

export default function OfflineTableFile({goToNextFolder,name,type,date_c, date_m}) {
  return (
    <div className="file" onClick={goToNextFolder}>
        <p className="name"><img src={type==="Folder" ? Folder : BlankFile} alt="icon" />{name}</p>
        <p className="type">{type}</p>
        <p className="date-created">{date_c}</p>
        <p className="date-modified">{date_m}</p>
    </div>
  )
}
