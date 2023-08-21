import React, { useState } from 'react'
import classes from './Accordion.module.css'

import UpArrowMin from 'Images/up_arrow_min.svg'
import DownArrowMin from 'Images/down_arrow-min.svg'
import Folder from 'Images/folder.png'
import { usePathStore } from '../../states/FileState'
export default function ModAccordion({path, visible}) {
    const [files, setFiles] = useState([])
    const [isVisibleModAccordion,setIsVisibleModAccordion] = useState([])
    const rootClasses = [classes.accordion]

     // STATE
     const pathState = usePathStore((state)=> state.path)
     const setPathState = usePathStore((state)=> state.setPath)
     // STATE

    const getFilesName = async () => {
        const filesData = await window.api.getFilesName(path)
        setFiles([...filesData])
        let isVisible = []
        for(let i = 0; i < filesData.length; i++) {
            isVisible.push(false)
        }
        setIsVisibleModAccordion([...isVisible])
    }
    if(visible){
        rootClasses.push(classes.active)
    } 
    useState(()=>{
        getFilesName()
    },[])

  return (
    files.length > 0 
    ? files.map((file,i) =>
        file.type === 'Folder' 
            ?<div key={i} className={rootClasses.join(' ')} >
                <div className={pathState === file.path ? 'accordion_inner_item_p_active' : 'accordion_inner_item_p'} key={i} >
                    <span className='accordion_header_text'>
                        <img src={Folder} alt="folder representation" /> 
                        <p onClick={()=> setPathState(file.path)}>{file.name}</p>
                    </span>
                    <img 
                    onClick={()=> setIsVisibleModAccordion(Object.assign(Array.from(isVisibleModAccordion), { [i]: !isVisibleModAccordion[i] }))}
                    className={isVisibleModAccordion[i] ?'arrows_min_up' : 'arrows_min_down' } src={isVisibleModAccordion[i] ? UpArrowMin : DownArrowMin} alt="arrow min" />
                </div>
                {isVisibleModAccordion[i] ? <ModAccordion path={file.path} visible={isVisibleModAccordion[i]}/> : null}
            </div>
            :<div key={i} className={rootClasses.join(' ')}>
                <div className='accordion_inner_item_p'>
                <span className='accordion_header_text'>
                    <div className="file-icon file-icon-sm-mod" data-type={file.name.split('.').slice(-1)[0].length >4 ? '?' : file.name.split('.').slice(-1)[0]}></div>
                    <p onClick={()=> console.log(file.path.split('\\').slice(-1).join('\\'))}>{file.name}</p>
                </span>
                </div>   
            </div>
        )
    :<p className={rootClasses.join(' ')}>No files in directory</p>
  )
}
