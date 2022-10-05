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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVote = exports.vote = exports.signup = exports.login = exports.getUser = void 0;
const userRepository = __importStar(require("../repository/user.repository"));
const common = __importStar(require("../common/common_function"));
const constants_1 = require("../common/constants");
const auth = __importStar(require("../../middlewares/auth"));
const logger = __importStar(require("winston"));
function getUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield userRepository.getUser(input);
        }
        catch (error) {
            logger.error(`getUser error : ${error.message}`);
            throw Object.assign({ status: "KO" }, error);
        }
    });
}
exports.getUser = getUser;
function login(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let nguoiDungResults = yield getUser(input);
            if (!nguoiDungResults.result.length) {
                return { status: "KO", message: "User not exist!", error_code: constants_1.constants.ERROR_CODE_NOT_EXIST };
            }
            let nguoiDung = nguoiDungResults.result[0];
            console.log(nguoiDungResults);
            if (nguoiDung.PASSWORD !== input.PASSWORD) {
                return { status: "KO", message: "Password not match!", error_code: constants_1.constants.ERROR_CODE_NOT_MATCH };
            }
            let result = auth.createToken(nguoiDung);
            return { status: "OK", result: { token: result[0], refresh_token: result[1] } };
        }
        catch (error) {
            logger.error(`login error : ${error.message}`);
            throw Object.assign({ status: "KO" }, error);
        }
    });
}
exports.login = login;
function signup(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let { data } = input;
        let userInputStandard = {
            ID: "*",
            NAME: "*",
            USERNAME: "",
            PASSWORD: "",
            CREATE_AT: 0,
        };
        data = data.map((c) => {
            return Object.assign(Object.assign({}, c), { ID: common.genID("", 20), NGAY_KHOI_TAO: (new Date()).getTime() });
        });
        try {
            let standardData = yield common.validFragment(data, userInputStandard);
            return yield userRepository.addUser(standardData);
        }
        catch (error) {
            logger.error(`signup error : ${error.message}`);
            throw Object.assign({ status: "KO" }, error);
        }
    });
}
exports.signup = signup;
function vote(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userResult = yield getUser(input);
            if (userResult && userResult.result) {
                if (!userResult.result)
                    throw { status: "KO", message: "Invalid USER_ID", error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE };
                let user = userResult.result[0];
                if (user.VOTE)
                    throw { status: "KO", message: "User Voted", error_code: constants_1.constants.ERROR_CODE_EXIST };
                yield userRepository.vote(input);
            }
            return { status: "OK", message: "voted!" };
        }
        catch (error) {
            logger.error(`signup error : ${error.message}`);
            throw Object.assign({ status: "KO" }, error);
        }
    });
}
exports.vote = vote;
function getAllVote(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield userRepository.getAllVote(input);
        }
        catch (error) {
            logger.error(`signup error : ${error.message}`);
            throw Object.assign({ status: "KO" }, error);
        }
    });
}
exports.getAllVote = getAllVote;
