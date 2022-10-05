import {TABLE_NAME} from "./tablename";

module.exports = `
-- DROP DATABASE IF EXISTS \`##database_name##\`;
-- CREATE DATABASE IF NOT EXISTS \`##database_name##\` character set UTF8 collate utf8_bin;

-- use \`##database_name##\`;

CREATE TABLE IF NOT EXISTS ${TABLE_NAME.USER}(
    ID varchar(20) not null,
    NAME text charset utf8mb4,
    USERNAME varchar(50),
    PASSWORD varchar(200),
    VOTE text charset utf8mb4,
    CREATE_AT bigint,
    LOCK boolean default false,
    STATUS boolean default true,
    primary key (ID)
);

`;
