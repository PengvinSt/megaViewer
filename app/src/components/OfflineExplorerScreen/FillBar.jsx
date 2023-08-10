import React, {useState, useEffect} from 'react'

export default function FillBar({percentage}) {

  return (
    <div>
        <div className='fillbar_progress'>
            <div
            style={{
                width:`${percentage}%`,
                backgroundColor: percentage < 95 ? `var(--disk-fill-indicator-filled)` : `var(--disk-fill-indicator-alert)`
            }}
            className='fillbar_progress_filled'
            ></div>
        </div>
    </div>
  )
}
