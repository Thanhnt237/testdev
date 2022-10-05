"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.createToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../app/common/constants");
const _ = __importStar(require("lodash"));
const tablename_1 = require("../config/tablename");
const common = __importStar(require("../app/common/common_function"));
function verifyToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let payload = jsonwebtoken_1.default.verify(token, constants_1.constants.ACCESS_TOKEN_SECRET);
            // console.log(payload)
            if (!payload) {
                throw { status: 403, message: "Invalid token", error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE };
            }
            if (!payload.user) {
                throw { status: 403, message: "Invalid token", error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE };
            }
            return payload.user;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.verifyToken = verifyToken;
function createToken(user) {
    const Token = jsonwebtoken_1.default.sign({
        user: _.pick(user, ['ID']),
    }, constants_1.constants.ACCESS_TOKEN_SECRET, {
        expiresIn: constants_1.constants.TOKEN_EXPIRES_TIME,
    });
    const RefreshToken = jsonwebtoken_1.default.sign({
        user: _.pick(user, 'ID'),
    }, constants_1.constants.REFRESH_TOKEN_SECRET, {
        expiresIn: constants_1.constants.REFRESH_TOKEN_EXPIRES_TIME,
    });
    return [Token, RefreshToken];
}
exports.createToken = createToken;
function refreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = '';
        try {
            let payload = jsonwebtoken_1.default.verify(refreshToken, constants_1.constants.REFRESH_TOKEN_SECRET);
            if (!payload) {
                throw { message: "Invalid token", error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE };
            }
            if (!payload.user) {
                throw { message: "Invalid token", error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE };
            }
            userId = payload.user.ID;
            let sql = `
                select count(*) as total
                from ${tablename_1.TABLE_NAME.USER}
                where ID = '${userId}'
            `;
            let [result,] = yield common.query(sql);
            if (!result[0].total) {
                throw { message: "User not found", error_code: constants_1.constants.ERROR_CODE_NOT_EXIST };
            }
            const token = jsonwebtoken_1.default.sign({
                user: { ID: userId },
            }, constants_1.constants.ACCESS_TOKEN_SECRET, {
                expiresIn: constants_1.constants.TOKEN_EXPIRES_TIME,
            });
            return token;
        }
        catch (err) {
            throw Object.assign({ error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE }, err);
        }
    });
}
exports.refreshToken = refreshToken;
