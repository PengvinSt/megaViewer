import React, { useEffect, useState } from 'react'
import '../../stylesheets/OneFileContext.css'

import dividerArrow from 'Images/divider_arrow.png'
import Pin from 'Images/pin_icon.svg'
import Copy from 'Images/copy_icon.svg'
import Cut from 'Images/cut_icon.svg'
import Delete from 'Images/delete_icon.svg'
import Rename from 'Images/rename_icon.svg'
import Search from 'Images/search_icon.svg'
import Property from 'Images/property_button.svg'
import CopyPath from 'Images/copy_path_icon.svg'
import Done from 'Images/done_icon.svg'
import Cancle from 'Images/cancle_icon.svg'
import { usePathStore } from '../../states/FileState'
import { useSettingsStore } from '../../states/SettingState'

export default function OneFileContext({top, left, data}) {

  const [serchName, setSearchName] = useState('')
  const [renameName, setRenameName] = useState('')
  const [isRename, setIsRename] = useState(false)

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
    navigator.clipboard.writeText(directory.replace('\\\\', '\\'))
  }

  const openTerminal = () => {
    const sendData = {
      path:directory
    }
    window.api.openTerminal(sendData)
  }

  const pinnFolder = () => {
    const newPinnedPath = {
      name: data.name,
      path:directory
    }
    let innerSettingsUpdated = innerSettingsState
    innerSettingsUpdated.pinnedPath = [...innerSettingsUpdated.pinnedPath, newPinnedPath]
    setInnerSettingsState(innerSettingsUpdated)
    window.api.updateInnerSettings({newInnerSettings:innerSettingsUpdated})
  }
  const findFile = async() =>{
    try {
      const data = await window.api.findFile({path:directory, searhFile:serchName})
      console.log(data,'DONE')
    } catch (error) {
      console.log(error)
    }
  }

  const deleteButton = async () => {
    try {
      await window.api.moveFileToTrash({
        path:directory.replace('\\\\', '\\')
      })
      setPathState("Reload")
    } catch (error) {
      console.log(error)
    }
  }
  const openInNewWindow = () => {
    try {
      const _uid = Date.now()+ Math.floor(Math.random() * 100)
      window.api.openNewOfflineExplorerWindow({path: directory, _uid})
    } catch (error) {
      console.log(error)
    }
  }
  const copyToClip = () => {
    window.api.copyDataToClipboard({
      path:directory
    })
  }
  const renameFunc = async () => {
    if(renameName.length > 0){
      if(data.type === 'File'){
        await window.api.renameData({
          path:directory,
          newpath:currentPath + "\\" + renameName + '.' + data.name.split('.').slice(-1)
        })
      }else {
        const newPinnedPath = {
          name: renameName,
          path:currentPath + "\\" + renameName
        }
        const oldPinnedPath = {
          name:data.name,
          path:directory
        }
        let innerSettingsUpdated = innerSettingsState
        innerSettingsUpdated.pinnedPath.map(pinned => {
          if(pinned.name === oldPinnedPath.name && pinned.path === oldPinnedPath.path) {
            pinned.name = newPinnedPath.name
            pinned.path = newPinnedPath.path
          }
        })
        setInnerSettingsState(innerSettingsUpdated)
        await window.api.renameData({
          path:directory,
          newpath:currentPath + "\\" + renameName
        })
        window.api.updateInnerSettings({newInnerSettings:innerSettingsUpdated})
      }
      
      setPathState("Reload")
    }
    setIsRename(false)
  }
  useEffect(()=>{
    console.log(data)
  },[])

  return (
    <div className='context_container' style={{position: `absolute`,top:`${top}px`, left:`${left}px`}}>
      <div className="context_shortcut_container">
        {/* <button><img src={Cut} alt="cut icon"/></button> */}
        <button onClick={()=> copyToClip()}><img src={Copy} alt="copy icon"/></button>
        {data.type === 'Folder' && <button onClick={()=> pinnFolder()}><img src={Pin} alt="pin icon"/></button>}
        <button onClick={()=> deleteButton()}><img src={Delete} alt="delete icon"/></button>
      </div>
      <div className="context_filename_container">
      {isRename 
      ?<div className="context_search_input_container">
        <input type="text" onChange={(e)=> setRenameName(e.target.value)} value={renameName} placeholder={data.name} className='context_search_input'/>
        <button onClick={()=>renameFunc()}><img src={renameName.length > 0 ? Done : Cancle} alt="Search icon" /></button>
      </div>
      :<>
        {data.name}
        <button className='context_mock' onClick={()=> setIsRename(true)}><img src={Rename} className='context_mock' alt="rename icon"/></button>
      </>
      }
      </div>
      {data.type === 'Folder' &&
       <div className="context_search_input_container">
        <input type="text" onChange={(e)=> setSearchName(e.target.value)} value={serchName} placeholder={`search in ${data.name}`} className='context_search_input'/>
        <button onClick={()=>findFile()}><img src={Search} alt="Search icon" /></button>
      </div>
      }
      <div className="context_buttons_container">
        {/* <button>open in new tab <img src={dividerArrow} alt="dividerArrow" /></button> */}
        {/* <button onClick={()=> openInNewWindow()}>open in new window <img src={dividerArrow} alt="dividerArrow" /></button> */}
        {/* <button onClick={()=> openTerminal()}>open in terminal <img src={dividerArrow} alt="dividerArrow" /></button> */}
        <button onClick={()=> copyPath()}>copy path <img src={CopyPath} alt="CopyPath" /></button>
        <button onClick={()=> openParams()}>params <img src={Property} alt="Property" /></button>
      </div>
    </div>
  )
}
