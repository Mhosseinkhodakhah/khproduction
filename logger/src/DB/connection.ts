import mongoose from 'mongoose'


export default async () => {
    mongoose.connect('mongodb+srv://hosseinkhodakhah6:Lucifer25255225@cluster0.i1kbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
        console.log('database connected successfully . . .')
    }).catch((err)=>{
        console.log(err)
        console.log('error occured while connecting to database' , `${err}`)
    })
}