import React from 'react'

import '../stylesheets/offlineExplorerScreen_styles.css'
import NavigationLeftSlider from '../components/OfflineExplorerScreen/NavigationLeftSlider'
import FolderContentField from '../components/OfflineExplorerScreen/FolderContentField'

export default function OfflineExplorerScreen() {

  return (
    <div className="offline_explorer_screen_container">
        <NavigationLeftSlider/>
        <FolderContentField/>
    </div>
  )
}
