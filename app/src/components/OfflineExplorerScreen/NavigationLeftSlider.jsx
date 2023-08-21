import React, { useEffect, useState } from 'react'
import Accordion from '../Accordion/Accordion'
import ModAccordion from '../Accordion/ModAccordion'
import { Scrollbar } from 'react-scrollbars-custom';


import PC from 'Images/pc_icon.png'
import UpArrowMin from 'Images/up_arrow_min.svg'
import DownArrowMin from 'Images/down_arrow-min.svg'
import { usePathStore } from '../../states/FileState';

export default function NavigationLeftSlider() {

    const [navVisible, setIsNavVisible] = useState(false)
    const [isVisibleModAccordion,setIsVisibleModAccordion] = useState([])

    const [drives, setDrives] = useState([])
    //STATE
    const pathState = usePathStore((state)=> state.path)
    const setPathState = usePathStore((state)=> state.setPath)
    //STATE

    const getStartingPath = async ()=>{
      const drive = await window.api.getStartingPath()
      const path = []
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

    useEffect(()=>{
      getStartingPath()
    },[])
  return (
    <div className="navigation_and_settings_container">
            <div className="navigation_containter">
                <div className="search_container">
                    search
                </div>
                <div className="pinned_container">
                    pinned
                </div>
                <div className="tabs_nav_container">
                  <button className='thisPc_accordion_button'  ><span className='accordion_header_text' onClick={()=> setPathState('Drive')}><img src={PC} alt="folder representation" /> This PC</span> <img className={navVisible ?'arrows_min_up' : 'arrows_min_down' } src={navVisible ? UpArrowMin : DownArrowMin} alt="arrow min" onClick={()=> setIsNavVisible(!navVisible)}/></button>
                    <Scrollbar style={{ width: "100%", height: "90%" }} noScrollX>
                      <Accordion visible={navVisible}>
                      {drives.map((path,i)=>
                        <>
                          <div className={pathState === path ? 'accordion_inner_item_p_active' : 'accordion_inner_item_p'} key={i} >
                            <p onClick={()=> setPathState(path)}>{path}</p>
                            <img 
                            onClick={()=> setIsVisibleModAccordion(Object.assign(Array.from(isVisibleModAccordion), { [i]: !isVisibleModAccordion[i] }))}
                            className={isVisibleModAccordion[i] ?'arrows_min_up' : 'arrows_min_down' } src={isVisibleModAccordion[i] ? UpArrowMin : DownArrowMin} alt="arrow min" />
                          </div>
                          {isVisibleModAccordion[i] ? <ModAccordion visible={isVisibleModAccordion} path={path}/> : null}
                        </>
                      )}
                      </Accordion>
                    </Scrollbar>
                </div>
            </div>
            <div className="settings_containter">
                settings
            </div>
    </div>
  )
}


/*




 <button class="accordion">Section 1</button>
    <div class="panel"><p>Lorem ipsum dolor sit amet consectetur.</p>
  </div>
*/