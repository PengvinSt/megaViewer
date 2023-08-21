import React from 'react'
import classes from './Accordion.module.css'


export default function Accordion({visible, children}) {

    const rootClasses = [classes.accordion]

    if(visible) {
        rootClasses.push(classes.active)
    }
  return (
    children.map((child,i) =>
    <div key={i} className={rootClasses.join(' ')}>
        {child}
    </div>
    ) 
  )
}
