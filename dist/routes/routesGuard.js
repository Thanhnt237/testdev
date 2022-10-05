"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
module.exports = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //if(req.method == 'OPTIONS') next();
        let token = (req.body && req.body.access_token) ||
            (req.query && req.query.access_token) ||
            req.headers['x-access-token'] || "";
        if (!token) {
            res.status(403).json({ status: "KO", message: "Invalid Token" });
        }
        else {
            try {
                req.headers.userId = yield (0, auth_1.verifyToken)(token);
                next();
            }
            catch (error) {
                if (error.status) {
                    res.status(error.status).json(error);
                }
                else {
                    res.status(401).json(error);
                }
            }
        }
    });
};
