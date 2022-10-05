export interface User {
    ID: string
    NAME: string
    USERNAME: string
    PASSWORD: string
    VOTE: string
    CREATE_AT: number
    LOCK: boolean
    STATUS: boolean
}

export interface LoginInformation {
    USERNAME: string
    PASSWORD: string
}

export interface UserSignUpInput {
    ID: string
    NAME: string
    USERNAME: string
    PASSWORD: string
    CREATE_AT: number
}