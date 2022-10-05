import {iNext, iRequest, iResponse} from "../app/interfaces";
import {verifyToken} from "../middlewares/auth";
import jwt from "jsonwebtoken";

module.exports = async function (req: iRequest, res: iResponse, next: iNext){
    //if(req.method == 'OPTIONS') next();

    let token =
        (req.body && req.body.access_token) ||
        (req.query && req.query.access_token) ||
        req.headers['x-access-token'] || "";

    if(!token){
        res.status(403).json({status: "KO", message: "Invalid Token"})
    }else{
        try{
            req.headers.userId = await verifyToken(token);
            next()
        }catch(error: any){
            if(error.status){
                res.status(error.status).json(error)
            }else{
                res.status(401).json(error)
            }
        }
    }

}