export interface responseInterface {
    
}




export interface jwtGeneratorInterface {

    id: number;
    firstName: string;
    lastName: string;
    isBlocked: boolean,
    phone: string,
    role: number
}


export interface trackIdInterface{
    phoneNumber : string,
    firstName ?: string,
    lastName ?: string,
    trackId : string,
    fatherName ?: string,
    status : boolean,
}



export interface responseInterface {
    success : boolean
    scope : string,
    error : string | null ,
    data : string | {} | null , 
}

export interface monitorInterface {
    scope: string,
    status: number,
    error: string | null,
}


export interface userLoggInterface {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}


