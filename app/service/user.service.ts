import * as userRepository from "../repository/user.repository";
import * as common from '../common/common_function'
import {constants} from '../common/constants'
import {User, BasicReturn, UserSignUpInput, LoginInformation} from '../interfaces'
import * as auth from '../../middlewares/auth';
import * as logger from "winston";

export async function getUser(input: any): Promise<BasicReturn> {
    try{
        return await userRepository.getUser(input)
    }catch(error:any){
        logger.error(`getUser error : ${error.message}`)
        throw {status: "KO", ...error}
    }
    
}

export async function login(input: LoginInformation): Promise<BasicReturn> {
    try{
        let nguoiDungResults: BasicReturn = await getUser(input);
        if(!nguoiDungResults.result.length){
            return {status: "KO", message: "User not exist!", error_code: constants.ERROR_CODE_NOT_EXIST}
        }
    
        let nguoiDung: User = nguoiDungResults.result[0]
        console.log(nguoiDungResults)
    
        if(nguoiDung.PASSWORD !== input.PASSWORD){
            return {status: "KO", message: "Password not match!", error_code: constants.ERROR_CODE_NOT_MATCH}
        }
    
        let result: Array<string> = auth.createToken(nguoiDung)
    
        return {status: "OK", result: {token: result[0], refresh_token: result[1]}}
    }catch(error:any){
        logger.error(`login error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}

export async function signup(input: any): Promise<BasicReturn>{
    let {data} = input

    let userInputStandard: UserSignUpInput = {
        ID: "*",
        NAME: "*",
        USERNAME: "",
        PASSWORD: "",
        CREATE_AT: 0,
    }

    data = data.map((c: any) => {
        return {
            ...c,
            ID: common.genID("", 20),
            NGAY_KHOI_TAO: (new Date()).getTime()
        }
    })

    try{
        let standardData: Array<User> = await common.validFragment(data, userInputStandard)
        return await userRepository.addUser(standardData)
    }catch(error: any){
        logger.error(`signup error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}

export async function vote(input: any): Promise<BasicReturn>{
    try{
        let userResult = await getUser(input)

        if(userResult && userResult.result){
            if(!userResult.result) throw {status: "KO", message: "Invalid USER_ID", error_code: constants.ERROR_CODE_INVALID_VALUE}

            let user = userResult.result[0]

            if(user.VOTE) throw {status: "KO", message: "User Voted", error_code: constants.ERROR_CODE_EXIST}
            

            await userRepository.vote(input)
        }

        return {status: "OK", message: "voted!"}
    }catch(error: any){
        logger.error(`signup error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}

export async function getAllVote(input: any): Promise<BasicReturn>{
    try{
        return await userRepository.getAllVote(input)
    }catch(error: any){
        logger.error(`signup error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}