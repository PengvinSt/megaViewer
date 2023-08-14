import React from 'react'
import classes from './Modal.module.css'


export default function Modal({children, visible, setVisible, params}) {

    const rootClasses = [classes.Modal]
    const contentClasses = [classes.ModalContent]
    if (visible) {
      rootClasses.push(classes.active)
      if(params.background){
        rootClasses.push(classes.ModalBackground)
      }
      if(params.type === 'right'){
        rootClasses.push(classes.right)
      }
      if(params.type === 'full'){
        rootClasses.push(classes.full)
      }
      if(params.spec === 'prop_buttons_view'){
        rootClasses.push(classes.spec_prop_buttons_view)
        contentClasses.push(classes.spec_prop_buttons_view_content)
      }
      if(params.spec === 'prop_buttons_hiden'){
        rootClasses.push(classes.spec_prop_buttons_hiden)
        contentClasses.push(classes.spec_prop_buttons_hiden_content)
      }
      if(params.spec === 'prop_buttons_view_hiden'){
        rootClasses.push(classes.spec_prop_buttons_view_hiden)
        contentClasses.push(classes.spec_prop_buttons_view_content)
      }
    }
  return (
    <div className={rootClasses.join(' ')} onClick={()=>setVisible(false)}>
       <div className={contentClasses.join(' ')} onClick={(e)=>e.stopPropagation()}>
           {children}
       </div>
     </div>
  )
}
