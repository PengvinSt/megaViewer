import React, { useEffect, useState } from 'react'

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import '../stylesheets/FolderContentField.css'
import '../stylesheets/NavigationLeftSlider.css'
import '../stylesheets/OfflineExplorerScreen.css'
import NavigationLeftSlider from '../components/OfflineExplorerScreen/NavigationLeftSlider'
import FolderContentField from '../components/OfflineExplorerScreen/FolderContentField'
import { useSettingsStore } from '../states/SettingState'
import { useContextStore } from '../states/ContextState'
import OneFileContext from '../components/Context/OneFileContext'

export default function OfflineExplorerScreen() {
  //STATE
  const innerSettingsState = useSettingsStore((state)=> state.innerSetting)
  const setInnerSettingsState = useSettingsStore((state)=> state.setInnerSetting)

  const contextData = useContextStore((state)=> state.contextData)
  const setContextData = useContextStore((state)=> state.setContextData)
  //STATE
  
  const getStartingSettings = async ()=> {
    const data = await window.api.innerSettings()
    setInnerSettingsState(data)
  }

  useEffect(()=>{
    getStartingSettings()
  }, [])

  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  
  useEffect(() => {
   
    const handleClick = (e) => {
      if(e.target.classList[0] === undefined){
        setClicked(false)
        setContextData({})
      }else if(!(e.target.classList[0].includes("context"))){
        setClicked(false)
        setContextData({})
      }
    }
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="offline_explorer_screen_container" onContextMenu={(e)=>{
      e.preventDefault();
      setClicked(true);
      setPoints({
        x:e.pageX,
        y:e.pageY
      })
      console.log("Right Click from main", e.pageX, e.pageY);
      console.log("Right Click from main x2", window.innerWidth, window.innerHeight);
      // console.log(contextData)
      }}>
        <PanelGroup direction='horizontal' className='offline_explorer_screen_container_inner'>
          <Panel defaultSize={20}>
            <NavigationLeftSlider/>
          </Panel>
        {/* <div className='separator'></div> */}
        <PanelResizeHandle className='separator'/>
        <Panel defaultSize={80}>
          <FolderContentField/>
        </Panel>
        </PanelGroup>
        {clicked && contextData.name !== undefined && <OneFileContext top={window.innerHeight > points.y + 300 ? points.y : points.y - 260} left={window.innerWidth > points.x + 300 ? points.x : points.x - 260} data={contextData}/>}
    </div>
  )
}
