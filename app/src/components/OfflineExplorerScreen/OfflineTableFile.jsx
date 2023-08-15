import React from 'react'

import Folder from 'Images/folder.png'
import BlankFile from 'Images/blank_file.png'

export default function OfflineTableFile({file,goToNextFolder, date_c, date_m}) {
  return (
    <div className="file"  onDoubleClick={goToNextFolder}>
        {/* <p className="name" ><img src={file.type==="Folder" ? Folder : BlankFile} alt="icon" />{file.name.length > 25 ? file.name.slice(0,23)+'...' : file.name}</p> */}
        <div className="name" >{file.type==="Folder" ? <img src={Folder} alt="icon" /> : <div className="file-icon file-icon-sm-mod" data-type={file.name.split('.').slice(-1)[0].length >4 ? '?' : file.name.split('.').slice(-1)[0]}></div>}{file.name.length > 25 ? file.name.slice(0,23)+'...' : file.name}</div>
        <p className="type">{file.type}</p>
        <p className="date-created">{date_c}</p>
        <p className="date-modified">{date_m}</p>
    </div>
  )
}
