import * as userService from '../service/user.service'
import {iRequest, iResponse} from '../interfaces'
import * as common from '../common/common_function'
import {constants} from '../common/constants'

export async function login(req: iRequest, res: iResponse){
    try{
        common.check_data(req.body, ["USERNAME", "PASSWORD"], constants.ERROR_CODE_EMPTY)
        res.json(await userService.login(req.body))
    }catch(error: any){
        res.json ({status: "KO", ...error})
    }
}

export async function signup(req: iRequest, res: iResponse){
    try{
        common.check_data(req.body, ["data"], constants.ERROR_CODE_EMPTY)
        res.json(await userService.signup(req.body))
    }catch(error: any){
        res.json ({status: "KO", ...error})
    }
}

export async function vote(req: iRequest, res: iResponse){
    try{
        common.check_data(req.body, ["USER_ID", "VOTE"], constants.ERROR_CODE_EMPTY)
        res.json(await userService.vote(req.body))
    }catch(error: any){
        res.json ({status: "KO", ...error})
    }
}

export async function getAllVote(req: iRequest, res: iResponse){
    try{
        common.check_data(req.body, ["data"], constants.ERROR_CODE_EMPTY)
        res.json(await userService.getAllVote(req.body))
    }catch(error: any){
        res.json ({status: "KO", ...error})
    }
}