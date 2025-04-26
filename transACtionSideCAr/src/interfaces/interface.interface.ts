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


export interface adminLoggInterface {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}



export interface oldUserInterfacelet {
    fatherName: string,
    gender: boolean
    officeName: string,
    birthDate: string,
    identityNumber: string,
    identitySeri: string,
    identitySerial: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    nationalCode: string,
    liveStatus: string,
    verificationStatus: number,
    identityTraceCode: string,
}




export interface jwtGeneratorInterface {

    id: number;
    firstName: string;
    lastName: string;
    isBlocked: boolean,
    phone: string,
    role: number
}


export interface trackIdInterface {
    phoneNumber: string,
    firstName?: string,
    lastName?: string,
    trackId: string,
    fatherName?: string,
    status: boolean,
}