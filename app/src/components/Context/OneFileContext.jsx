import React, { useEffect } from 'react'
import '../../stylesheets/OneFileContext.css'

import dividerArrow from 'Images/divider_arrow.png'
import Pin from 'Images/pin_icon.svg'
import Copy from 'Images/copy_icon.svg'
import Cut from 'Images/cut_icon.svg'
import Delete from 'Images/delete_icon.svg'
import Rename from 'Images/rename_icon.svg'
import { usePathStore } from '../../states/FileState'
import { useSettingsStore } from '../../states/SettingState'

export default function OneFileContext({top, left, data}) {

  // STATE
  const pathState = usePathStore((state)=> state.path)
  const setPathState = usePathStore((state)=> state.setPath)

  const currentPath = usePathStore((state)=> state.currentPath)

  const innerSettingsState = useSettingsStore((state)=> state.innerSetting)
  const setInnerSettingsState = useSettingsStore((state)=> state.setInnerSetting)
  // STATE 

  const directory = currentPath + "\\" + data.name

  const getDiskSize = async (diskName)=>{
    const disk = await window.api.getDiskSpace(`${diskName}:\\\\`)
    return disk.size
}

  const openParams = async()=>{
  
    // const rawData = await window.api.getMoreInfo(directory)
      const structureData = {
          name:data.name,
          path:directory,
          type:data.type,
          _uid:Date.now()+ Math.floor(Math.random() * 100),
          size:data.type === 'File' && data.Stats.size,
          diskSize:  await getDiskSize(directory.split(':')[0]),
          dateC:data.Stats.birthtime.toISOString().split('T')[0],
          dateM:data.Stats.mtime.toISOString().split('T')[0],
      }
      await window.api.spawnPropertiesWindow(structureData)
  }

  const copyPath = ()=>{
    navigator.clipboard.writeText(directory)
  }

  const openTerminal = () => {
    const sendData = {
      path:directory
    }
    window.api.openTerminal(sendData)
  }

  const pinnFolder = () => {
    if(data.type === 'Folder'){
      const newPinnedPath = {
        name: data.name,
        path:directory
      }
      let innerSettingsUpdated = innerSettingsState
      innerSettingsUpdated.pinnedPath = [...innerSettingsUpdated.pinnedPath, newPinnedPath]
      setInnerSettingsState(innerSettingsUpdated)
      window.api.updateInnerSettings({newInnerSettings:innerSettingsUpdated})
    }else{
      console.log("Not a folder")
    }
  }
  const getStartingSettings = async ()=> {
    const data = await window.api.innerSettings()
    setInnerSettingsState(data)
  }

  useEffect(()=>{
    console.log(data)
  },[])

  return (
    <div className='context_container' style={{position: `absolute`,top:`${top}px`, left:`${left}px`}}>
      <div className="context_shortcut_container">
        {/* <button><img src={Cut} alt="cut icon"/></button> */}
        {/* <button><img src={Copy} alt="copy icon"/></button> */}
        <button onClick={()=> pinnFolder()}><img src={Pin} alt="pin icon"/></button>
        {/* <button><img src={Delete} alt="delete icon"/></button> */}
      </div>
      <div className="context_filename_container">
      {data.name}
      {/* <button><img src={Rename} alt="rename icon"/></button> */}
      </div>
      <div className="context_search_input_container">
        <input type="text" placeholder={`search in ${data.name}`} className='context_search_input'/>
      </div>
      <div className="context_buttons_container">
        {/* <button>open in new tab <img src={dividerArrow} alt="dividerArrow" /></button> */}
        {/* <button>open in new window <img src={dividerArrow} alt="dividerArrow" /></button> */}
        {/* <button onClick={()=> openTerminal()}>open in terminal <img src={dividerArrow} alt="dividerArrow" /></button> */}
        <button onClick={()=> copyPath()}>copy path <img src={dividerArrow} alt="dividerArrow" /></button>
        <button onClick={()=> openParams()}>params <img src={dividerArrow} alt="dividerArrow" /></button>
      </div>
    </div>
  )
}
