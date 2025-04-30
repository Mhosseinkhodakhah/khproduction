export interface userLogs {
    user: {
        userName: string,
        fullName: string,
        phoneNumber: string,
    },

    title:string,

    description:string

    action : {}

    date : string,

    time : string,

    status : number
}



export interface logs {
    admin: {
        userName: string,
        fullName: string,
        profile: string,
    },


    date : string,

    actionType : number

    time : string

    title:string,

    description:string

    action : {}
}




export interface responseInterface{
    
}