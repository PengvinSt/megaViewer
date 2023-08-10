import React, { useEffect, useState } from 'react'

import hardDiskImg from 'Images/hard_disk.png'
import SsdImg from 'Images/ssd.png'
import SystemDiskImg from 'Images/systemDisk.png'
import FillBar from './FillBar'


export default function OfflineDisk({diskDir,goToDisk}) {

    const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
    const [diskUsage, setDiskUsage] = useState({})
    const [loading, setLoading] = useState(false)

    const niceBytes = (x)=>{
        let l = 0, n = parseInt(x, 10) || 0;
        while(n >= 1024 && ++l){
            n = n/1024;
        }
    
        return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    }

    const getDiskInfo = async (path) =>{
        try {
            setLoading(true)
            const disk = await window.api.getDiskSpace(path)
            setDiskUsage({
            name:disk.diskPath,
            free:  niceBytes(disk.free),
            size: niceBytes(disk.size),
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
        {loading ? <div className='disk_skeleton'></div> 
                    : diskUsage.free !== undefined && diskUsage.size !== undefined 
                    ? 
                    <div className='disk' onClick={goToDisk}>
                    <img src={diskDir.path === 'C:\\' ? SystemDiskImg : hardDiskImg} alt="disc img" />
                    <div className='disk_info'>
                        <p>Local Disk {diskDir.path}</p>
                        <FillBar percentage={diskUsage.percentage}/>
                        <p>{diskUsage.free} out of {diskUsage.size}</p>
                    </div>
                    </div>
                    : null
        }
    </div>
  )
}

