import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import WelcomeScreen from '../screens/welcomeScreen'
import OfflineExplorerScreen from '../screens/OfflineExplorerScreen'

export default function Router() {
  return (
    <Routes>
            <Route path="/" element={<WelcomeScreen/>}/>
            <Route path="/ExplorerOffline" element={<OfflineExplorerScreen/>}/>
    </Routes>
  )
}
