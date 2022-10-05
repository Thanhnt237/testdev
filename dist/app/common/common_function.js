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
exports.genID = exports.genUpdateQuery = exports.validFragment = exports.check_data = exports.genInsertQuery = exports.query = void 0;
const db_connection_1 = require("../../config/db_connection");
const lodash_1 = __importDefault(require("lodash"));
const logger = __importStar(require("winston"));
const constants_1 = require("./constants");
function query(str_sql) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows, fields] = yield db_connection_1.conn.query(str_sql.toString());
            return [rows, fields];
        }
        catch (error) {
            logger.error(`query error : ${error.message}`);
            return { message: `${error.message}. ${error.sqlMessage}` };
        }
    });
}
exports.query = query;
function genInsertQuery(tableName, arrProps, data, is_IGNORE) {
    let data_insert = [];
    let sql = "";
    for (let item of data) {
        let str_val_item = "(";
        for (let key in item) {
            if (item.hasOwnProperty(key)) {
                let data_type = typeof item[key];
                switch (data_type) {
                    case "string":
                        str_val_item += "'" + item[key] + "',";
                        break;
                    case "number":
                    case "boolean":
                        str_val_item += item[key] + ",";
                        break;
                    default:
                        str_val_item += "null,";
                        break;
                }
            }
        }
        ;
        str_val_item = str_val_item.substring(0, str_val_item.length - 1);
        str_val_item += ")";
        data_insert.push(str_val_item);
    }
    if (data_insert.length > 0) {
        sql = `INSERT ${is_IGNORE ? 'IGNORE' : ''} INTO ${tableName} (${arrProps.join()}) VALUES ${data_insert.join()};`;
        // console.log(sql)
    }
    return sql;
}
exports.genInsertQuery = genInsertQuery;
function check_data(data, check_field, rule, line) {
    let result = { status: "OK" };
    rule = !rule ? constants_1.constants.ERROR_CODE_EMPTY : rule;
    switch (rule) {
        case constants_1.constants.ERROR_CODE_EMPTY:
            if (Array.isArray(data) && data.length > 1) {
                // các bản ghi bị lỗi
                let error_index = [];
                for (let i = 0; i < data.length; i++) {
                    let ob = data[i];
                    for (let field of check_field) {
                        if (!ob[`${field}`] && ob[`${field}`] != 0) {
                            error_index.push(i);
                            break;
                        }
                        else {
                            // kiểm tra các số phải >= 0
                            if (!isNaN(Number(ob[`${field}`])) && typeof Number(ob[`${field}`]) == "number") {
                                if (Number(ob[`${field}`]) < 0) {
                                    error_index.push(i);
                                    break;
                                }
                            }
                            // Check mảng
                            if (ob[`${field}`] && Array.isArray(ob[`${field}`]) && !ob[`${field}`].length) {
                                result = { status: "KO", field, error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE, message: `${field} has no data` };
                                break;
                            }
                        }
                    }
                }
                if (error_index.length) {
                    result = { status: "KO", error_code: constants_1.constants.ERROR_CODE_EMPTY, error_index };
                }
            }
            else {
                if (Array.isArray(data) && data.length == 1) {
                    data = data[0];
                }
                for (let field of check_field) {
                    if (!data[`${field}`] && data[`${field}`] != 0) {
                        result = { status: "KO", field, error_code: constants_1.constants.ERROR_CODE_EMPTY, message: `${field} is empty` };
                        break;
                    }
                    else {
                        // kiểm tra các số phải >= 0
                        if (!isNaN(Number(data[`${field}`])) && typeof Number(data[`${field}`]) == "number") {
                            if (Number(data[`${field}`]) < 0) {
                                result = { status: "KO", field, error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE, message: `${field} is INVALID` };
                                break;
                            }
                        }
                        // Check mảng
                        if (data[`${field}`] && Array.isArray(data[`${field}`]) && !data[`${field}`].length) {
                            result = { status: "KO", field, error_code: constants_1.constants.ERROR_CODE_INVALID_VALUE, message: `${field} has no data` };
                            break;
                        }
                    }
                }
            }
            break;
        default:
            result = { status: "OK" };
            break;
    }
    if (result.status == "KO") {
        if (line >= 0) {
            result.error_index = [line];
        }
        throw result;
    }
}
exports.check_data = check_data;
/**
 *
 * @param {*} data array [Object]
 * @param {*} columnStandard Object {"NHANSU_ID": "* removeAfterValid"}
 * param {* required require} {removeAfterValid}
 */
function validFragment(data, columnStandard) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let columnRequired = [];
            let columnOmit = [];
            for (let [keys, values] of Object.entries(columnStandard)) {
                if (values) {
                    if (values.toString().includes('required') || values.toString().includes('require') || values.toString().includes('*')) {
                        columnRequired.push(keys);
                    }
                    if (values.toString().includes('removeAfterValid')) {
                        columnOmit.push(keys);
                    }
                }
            }
            check_data(data, columnRequired, constants_1.constants.ERROR_CODE_EMPTY);
            for (let i = 0; i < data.length; i++) {
                data[i] = lodash_1.default.pick(data[i], Object.keys(columnStandard));
                if (columnOmit.length) {
                    data[i] = lodash_1.default.omit(data[i], columnOmit);
                }
            }
            return data;
        }
        catch (error) {
            logger.error(`validFragment error : ${error.message}`);
            throw Object.assign(Object.assign({ status: "KO" }, error), { message: error.message });
        }
    });
}
exports.validFragment = validFragment;
/**
 *
 * @param {*} tableName Ten banr
 * @param {*} data {column:"Value"}
 * @param {*} condition {column:"value"}
 * @returns
 */
function genUpdateQuery(tableName, data, condition) {
    let sql = `update ${tableName} set `;
    for (let key in data) {
        let column, value;
        column = key;
        value = data[key];
        if (typeof value != "undefined" && value != null) {
            sql += `${key} = '${value}',`;
        }
    }
    let conditionArr = [];
    for (let con in condition) {
        let column, value;
        column = con;
        value = condition[con];
        conditionArr.push(` ${column} = '${value}' `);
    }
    sql = sql.slice(0, sql.length - 1);
    sql += ` where ${conditionArr.join("AND")};`;
    if (typeof data !== "object" || !Object.keys(data).length)
        return "";
    return sql;
}
exports.genUpdateQuery = genUpdateQuery;
/**
 * TODO: generate string id
 * @param {*} prefix : tiền tố .
 */
function genID(prefix, maxSize = 45) {
    if (prefix) {
        maxSize = maxSize - prefix.length - 1;
    }
    let current_time = new Date().getTime();
    let rand = Math.floor(Math.random() * (Math.floor(Math.random() * 1000) - Math.floor(Math.random() * 100) + 600) + Math.floor(Math.random() * 100));
    let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + (current_time * rand);
    let result;
    let str = Array(maxSize).join().split(',').map(function () { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
    if (!!prefix) {
        result = `${prefix.toLocaleUpperCase()}_${str}`;
    }
    else {
        result = `${str}`;
    }
    return result;
}
exports.genID = genID;
