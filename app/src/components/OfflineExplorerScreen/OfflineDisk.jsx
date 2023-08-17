import React, { useEffect, useState } from 'react'

import hardDiskImg from 'Images/hard_disk.png'
import SystemDiskImg from 'Images/systemDisk.png'
import FillBar from './FillBar'


export default function OfflineDisk({diskDir,goToDisk}) {
    const [diskUsage, setDiskUsage] = useState({})
    const [loading, setLoading] = useState(true)

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'
    
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
    
        const i = Math.floor(Math.log(bytes) / Math.log(k))
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    const getDiskInfo = async (path) =>{
        try {
            const disk = await window.api.getDiskSpace(path)
            setDiskUsage({
            name:disk.diskPath,
            free:  formatBytes(disk.free,2),
            size: formatBytes(disk.size,0),
            percentage: (((disk.size-disk.free)/disk.size)*100).toFixed(3)
            })
            
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(()=>{
        getDiskInfo(diskDir.path)
        
    },[])

  return (
    <div>
        <div className='disk' onClick={goToDisk}>
            <img src={diskDir.path === 'C:\\' ? SystemDiskImg : hardDiskImg} alt="disc img" />
            <div className='disk_info'>
            <p>Local Disk {diskDir.path}</p>
            {loading 
                ?<>
                    <div className='disk_skeleton_loader'></div> 
                    <div className='disk_skeleton_text'></div> 
                </>
                :<>
                    <FillBar percentage={diskUsage.percentage}/>
                    <p>{diskUsage.free} out of {diskUsage.size}</p>
                </>
            }
            </div>
        </div>
    </div>
  )
}

