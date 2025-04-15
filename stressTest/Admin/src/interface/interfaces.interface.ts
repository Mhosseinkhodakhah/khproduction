export interface responseInterface {

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


export interface jwtGeneratorInterface {

    id: number;

    firstName: string;

    lastName: string;

    isBlocked: boolean,
    
    phone: string,

    role: number

}