export interface BasicReturn extends Result, Error{
    status: string
}

interface Error{
    message?: string
    error_code?: string
}

interface Result{
    result?: any
}