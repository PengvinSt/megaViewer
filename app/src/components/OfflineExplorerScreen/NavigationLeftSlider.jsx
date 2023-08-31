import React, { useEffect, useState } from 'react'
import Accordion from '../Accordion/Accordion'
import ModAccordion from '../Accordion/ModAccordion'
import { Scrollbar } from 'react-scrollbars-custom';


import { usePathStore } from '../../states/FileState'
import { useSettingsStore } from '../../states/SettingState'

import PC from 'Images/thisPC_outline_icon.svg'
import UpArrowMin from 'Images/up_arrow_min.svg'
import DownArrowMin from 'Images/down_arrow-min.svg'
import Folder from 'Images/folder.png'
import hardDiskImg from 'Images/hard_disk.png'
import SystemDiskImg from 'Images/systemDisk.png'
import Search from 'Images/search_icon.svg'
import Pin from 'Images/pin_icon.svg'
import Settings from 'Images/settings_icon.svg'
import SearchResult from 'Images/folder_search_result_icon.svg'

export default function NavigationLeftSlider() {

    const [navVisible, setIsNavVisible] = useState(false)
    const [isVisibleModAccordion,setIsVisibleModAccordion] = useState([])
    const [pinVisible, setPinVisible] = useState(false)
    const [drives, setDrives] = useState([])
    const [searhFile, setSearhFile] = useState('')
    const [isFindingFile,setIsFindingFile] = useState(false)
    const [curentFolderPath, setCurentFolderPath] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [searchVisible, setSearchVisible] = useState(false)
    // STATE
    const pathState = usePathStore((state)=> state.path)
    const setPathState = usePathStore((state)=> state.setPath)

    const currentPath = usePathStore((state)=> state.currentPath)

    const innerSettingsState = useSettingsStore((state)=> state.innerSetting)
    const setInnerSettingsState = useSettingsStore((state)=> state.setInnerSetting)
    // STATE 

    const [pinnedPath, setPinnedPath] = useState([])

    useEffect(()=>{
      console.log(innerSettingsState)
      if(innerSettingsState.pinnedPath !== undefined){
        setPinnedPath([...innerSettingsState.pinnedPath])
      }
    }, [innerSettingsState.pinnedPath])

    useEffect(()=>{
      setCurentFolderPath(currentPath)
      console.log(currentPath)
    }, [currentPath])

    const getStartingPath = async ()=>{
      const {drive} = await window.api.getStartingPath()
      let path = []
      for(let i = 0; i < drive.length; i++){
        drive[i].mountpoints.map(drive => path.push(drive.path))
      }
      let isVisible = []
      for(let i = 0; i < path.length; i++) {
          isVisible.push(false)
      }
      setIsVisibleModAccordion([...isVisible])
      setDrives([...path])
    }
    const findFile = async() =>{
      if(curentFolderPath.length <4){
        console.log('F off dude')
        return
      }
      try {
        setIsFindingFile(!isFindingFile)
        console.log(isFindingFile)
        if(curentFolderPath.length > 0){
          const data = await window.api.findFile({path:curentFolderPath, searhFile:searhFile})
          console.log(data,'DONE')
          setIsFindingFile(false)
        }else {
            for(let i=0; i < drives.length; i++){
              console.log({path: drives[i]})
              const data = await window.api.findFile({path:drives[i], searhFile:searhFile})
              console.log({path: drives[i]}, data, 'DONE')
            }
            setIsFindingFile(false)
        }
        
      } catch (error) {
        setIsFindingFile(false)
        console.log(error)
      }
    }
 
    const unPinFolder = async(data)=> {
      let innerSettingsUpdated = innerSettingsState
      innerSettingsUpdated.pinnedPath = [...innerSettingsUpdated.pinnedPath.filter(pinnedPath => pinnedPath.name !== data.name && pinnedPath.path !== data.path)]
      setInnerSettingsState(innerSettingsUpdated)
      window.api.updateInnerSettings({newInnerSettings:innerSettingsUpdated})
    }

    useEffect(()=>{
      getStartingPath()
    },[])
  return (
    <div className="navigation_and_settings_container">
            <div className="navigation_containter">
                <div className="search_container">
                <img src={Search} alt="search icon" onClick={()=> isFindingFile ? console.log('Already searching something'): findFile()}/>
                <input type="text" placeholder='Search' onChange={(e)=> setSearhFile(e.target.value)} value={searhFile}/>
                </div>
                <div className="pinned_container">
                  <p className="pinned_container_header" onClick={()=> setPinVisible(!pinVisible)}>
                  <img className={pinVisible ?'arrows_min_up' : 'arrows_min_down' } src={pinVisible ? UpArrowMin : DownArrowMin} alt="arrow min" />
                  <img className='pinn_represeintation' src={Pin} alt="pin icon"/>
                  Pinned
                  </p>
                  <div className="pinned_container_body">
                  {pinnedPath.length > 0 && <Accordion visible={pinVisible}>
                  { pinnedPath.map((data, i)=>
                      <p key={i} className='pinnedPath' >
                        <img className='pin_icon_in_pinnedPath' src={Pin} alt="pin icon" onClick={()=> unPinFolder(data)}/>
                        <img src={Folder} alt="folder representation" onClick={()=> setPathState(data.path)}/> 
                        <span onClick={()=> setPathState(data.path)}>{data.name.length>20?data.name.slice(0,20)+'...':data.name}</span>
                      </p>
                  )}
                  </Accordion>}
                  </div>
                </div>
                <div className="tabs_nav_container">
                  <button className='thisPc_accordion_button' >
                  <img className={navVisible ?'arrows_min_up' : 'arrows_min_down' } src={navVisible ? UpArrowMin : DownArrowMin} alt="arrow min" onClick={()=> setIsNavVisible(!navVisible)}/>
                  <span className='accordion_header_text_ThisPC' onClick={()=> setPathState('Drive')}>
                    <img src={PC} alt="folder representation" className='thisPC_image'/> This PC
                  </span>
                  </button>
                    <Scrollbar style={{ width: "100%", height: "92%"}} noScrollX>
                      <Accordion visible={navVisible}>
                      {drives.map((path,i)=>
                        <>
                          <div className={pathState === path ? 'accordion_inner_item_p_active' : 'accordion_inner_item_p'} key={i} > 
                            <img 
                            onClick={()=> setIsVisibleModAccordion(Object.assign(Array.from(isVisibleModAccordion), { [i]: !isVisibleModAccordion[i] }))}
                            className={isVisibleModAccordion[i] ?'arrows_min_up' : 'arrows_min_down' } src={isVisibleModAccordion[i] ? UpArrowMin : DownArrowMin} alt="arrow min" 
                            />
                            <img 
                            className='tabs_disk_img'
                            src={path.split(':')[0] === 'C' ? SystemDiskImg: hardDiskImg} alt="disk representation" 
                            />
                            <p onClick={()=> setPathState(path)}>{path}</p>
                          </div>
                          {isVisibleModAccordion[i] ? <ModAccordion visible={isVisibleModAccordion} path={path}/> : null}
                        </>
                      )}
                      </Accordion>
                    </Scrollbar>
                </div>
            </div>
            <div className="settings_containter">
                <button className='search_result_button'><img src={SearchResult} alt="SearchResult" />results</button>
                <button className='settings_button'><img src={Settings} alt="Settings" />settings</button>
            </div>
    </div>
  )
}


/*




 <button class="accordion">Section 1</button>
    <div class="panel"><p>Lorem ipsum dolor sit amet consectetur.</p>
  </div>
*/