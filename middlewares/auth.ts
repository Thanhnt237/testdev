import jwt from 'jsonwebtoken'
import {constants} from '../app/common/constants'
import * as _ from 'lodash'
import {TABLE_NAME} from "../config/tablename";
import * as common from '../app/common/common_function'

export async function verifyToken(token: string): Promise<string>{
    try {
        let payload: any = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
        // console.log(payload)
        if(!payload){
            throw {status: 403, message: "Invalid token", error_code: constants.ERROR_CODE_INVALID_VALUE}
        }

        if (!payload.user) {
            throw {status: 403, message: "Invalid token", error_code: constants.ERROR_CODE_INVALID_VALUE}
        }

        return payload.user
    } catch (err) {
        throw err
    }
}

export function createToken(user: Object): Array<string>{
    const Token: string = jwt.sign(
        {
            user: _.pick(user, ['ID']),
        },
        constants.ACCESS_TOKEN_SECRET,
        {
            expiresIn: constants.TOKEN_EXPIRES_TIME,
        },
    );

    const RefreshToken: string = jwt.sign(
        {
            user: _.pick(user, 'ID'),
        },
        constants.REFRESH_TOKEN_SECRET,
        {
            expiresIn: constants.REFRESH_TOKEN_EXPIRES_TIME,
        },
    );

    return [Token, RefreshToken];
}

export async function refreshToken(refreshToken: string): Promise<string>{
    let userId: string = '';

    try {

        let payload : any = jwt.verify(refreshToken, constants.REFRESH_TOKEN_SECRET);

        if(!payload){
            throw {message: "Invalid token", error_code: constants.ERROR_CODE_INVALID_VALUE};
        }

        if (!payload.user) {
            throw {message: "Invalid token", error_code: constants.ERROR_CODE_INVALID_VALUE};
        }

        userId = payload.user.ID

        let sql = `
                select count(*) as total
                from ${TABLE_NAME.USER}
                where ID = '${userId}'
            `


        let [result,] = await common.query(sql)

        if(!result[0].total){
            throw {message: "User not found", error_code: constants.ERROR_CODE_NOT_EXIST};
        }

        const token = jwt.sign(
            {
                user: {ID: userId},
            },
            constants.ACCESS_TOKEN_SECRET,
            {
                expiresIn: constants.TOKEN_EXPIRES_TIME,
            },
        );

        return token

    } catch (err: any) {
        throw {error_code: constants.ERROR_CODE_INVALID_VALUE, ...err}
    }
}