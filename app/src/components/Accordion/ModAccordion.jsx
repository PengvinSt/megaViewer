import React, { useState } from 'react'
import classes from './Accordion.module.css'

import UpArrowMin from 'Images/up_arrow_min.svg'
import DownArrowMin from 'Images/down_arrow-min.svg'
import Folder from 'Images/folder.png'
import { usePathStore } from '../../states/FileState'
export default function ModAccordion({path, visible}) {
    const [files, setFiles] = useState([])
    const [isVisibleModAccordion,setIsVisibleModAccordion] = useState([])
    const rootClasses = [classes.mod_accordion]

     // STATE
     const pathState = usePathStore((state)=> state.path)
     const setPathState = usePathStore((state)=> state.setPath)
     // STATE

    const getFilesName = async () => {
        const filesDataRaw = await window.api.getFilesName(path)
        const filesDataFiltered = filesDataRaw.filter(file => file.type === 'Folder')
        setFiles([...filesDataFiltered])
        let isVisible = []
        for(let i = 0; i < filesDataFiltered.length; i++) {
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
      <div key={i} className={rootClasses.join(' ')} >
            <div className={pathState === file.path ? 'accordion_inner_item_p_active' : 'accordion_inner_item_p'} key={i} >
                <img 
                onClick={()=> setIsVisibleModAccordion(Object.assign(Array.from(isVisibleModAccordion), { [i]: !isVisibleModAccordion[i] }))}
                className={isVisibleModAccordion[i] ?'arrows_min_up' : 'arrows_min_down' } src={isVisibleModAccordion[i] ? UpArrowMin : DownArrowMin} alt="arrow min" 
                />
                <span className='accordion_header_text'>
                    <img src={Folder} alt="folder representation" /> 
                    <p onClick={()=> setPathState(file.path)}>{file.name.length < 30 ? file.name : file.name.slice(0, 30) + '...'}</p>
                </span>
            </div>
            {isVisibleModAccordion[i] ? <ModAccordion path={file.path} visible={isVisibleModAccordion[i]}/> : null}
        </div>
    )
    :<p className={rootClasses.join(' ')}>...</p>
  )
}
