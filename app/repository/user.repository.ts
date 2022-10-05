import * as common from '../common/common_function'
import {TABLE_NAME} from "../../config/tablename";
import {constants} from '../common/constants'
import {BasicReturn, User} from '../interfaces'
import * as logger from "winston";

export async function getUser(input: any): Promise<BasicReturn>{
    let {USERNAME, USER_ID} = input

    let expandCondition = ""

    if(USERNAME){
        expandCondition += ` and USERNAME = '${USERNAME}'`
    }

    if(USER_ID){
        expandCondition += ` and ID = '${USER_ID}'`
    }

    let sql = `
        select *
        from ${TABLE_NAME.USER}
        where true
        ${expandCondition}
    `

    try{
        let [result,] = await common.query(sql)
        return {status: "OK", result: result}
    }catch(error: any){
        logger.error(`getUser error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}

export async function addUser(input: Array<User>): Promise<BasicReturn>{
    let arrProps = Object.keys(input[0])

    let sql = common.genInsertQuery(TABLE_NAME.USER, arrProps, input)

    try{
        await common.query(sql)
        return {status: "OK", message: "Add user success!"}
    }catch(error: any){
        logger.error(`addUser error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}

export async function vote(input: any){
    let {VOTE, USER_ID} = input

    let sql = ` update ${TABLE_NAME.USER} set VOTE = '${VOTE}' where ID = '${USER_ID}' `

    try{
        await common.query(sql)
        return {status: "OK", message: "Voted!"}
    }catch(error: any){
        logger.error(`addUser error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}

export async function getAllVote(input: any){
    let {} = input;

    let sql = `
        select *
        from ${TABLE_NAME.USER}
        where VOTE is not null;
    `

    try{
        let [result] = await common.query(sql)
        return {status: "OK", result: result}
    }catch(error: any){
        logger.error(`addUser error : ${error.message}`)
        throw {status: "KO", ...error}
    }
}