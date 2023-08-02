import React from 'react'

import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeScreen() {
  const navigate = useNavigate()

  useEffect(()=>{
    document.addEventListener('keydown', handleKeyDown, true)
    return ()=>{
      document.removeEventListener('keydown', handleKeyDown)
    }
  },[])

  const handleKeyDown = event => {
    if(event.key === 'Enter') {
      console.log('redirecting to ... ')
      navigate('/ExplorerOffline')
    }
  };

  return (
    <div className='temp_text-align'>
      <div>Hi there! :)</div>
      <div>Press Enter to continue...</div>
    </div>
  )
}
