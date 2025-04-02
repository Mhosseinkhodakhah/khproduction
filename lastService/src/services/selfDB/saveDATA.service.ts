import { trackIdInterface } from "../../interfaces/interface.interface";
import fs from "fs";
import monitor from "../../util/statusMonitor";

export class internalDB{
    file;
    
    constructor(){
        try {
            let path = JSON.parse(fs.readFileSync('/etc/backup/ShahkarTrackId/trackIdDatas.json' , {encoding : 'utf-8'})) 
            this.file = path
            console.log('file is >>>>>>' , this.file)
        } catch (error) {
            // this.file = 
            monitor.error.push(`error in saving shahkar track id in the file :: ${error}`)
            console.log(error)
        }
    }

    async saveData (info : trackIdInterface) : Promise<boolean>{
        try {
            let date= new Date().toLocaleString('fa-IR').split(',')[1]
            this.file[date] = info
            let write = fs.writeFileSync('/etc/backup/ShahkarTrackId/trackIdDatas.json' , JSON.stringify(this.file))
            return true
        } catch (error) {
            monitor.error.push(`error in saving shahkar track id in the file :: ${error}`)
            console.log(error)
            return false            
        }
    }
}