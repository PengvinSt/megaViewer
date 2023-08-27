const path = require('path');
const fs = require("fs")
const { Worker, isMainThread, parentPort } = require('worker_threads');

self.onmessage = (event) => {
    console.log('Worker received:', event.data);

    if(isMainThread){
        const workerThreads = [];
        for (let i = 0; i < event.data.numbersOfFolders; i++) {
            workerThreads.push(new Worker(__filename));
        }
        workerThreads.forEach((worker) => {
            worker.postMessage(event.data);
        });
    }else{
        parentPort.on('message', message => {
            console.log(`Worker ${process.pid}: Getting size of ${message.folderName}`);
            folderSize(message);
        })
    
        let allSize = 0
        let allFiles = 0
        let allFolders = 0
    
        async function folderSize (data) {
        let size = 0
        const files = await fs.promises.readdir(data.dirPath)
    
        for (let i = 0; i < files.length; i++) {
        const filePath = path.join(data.dirPath, files[i])
        const stats = await fs.promises.stat(filePath)
                 
        if (stats.isFile()) {
            size += stats.size
            allSize += stats.size
            allFiles += 1
        } else if (stats.isDirectory()) {
            allFolders += 1
            size += await getDirSize(filePath)
        }
        }
        parentPort.postMessage({
            folderName: data.folderName,
            path:data.dirPath,
            size: allSize,
            folders: allFolders,
            files: allFiles
        })
        }
    }
};

