-- 初始化创建数据库专用
-- 初始化后可用db.sync()同步数据库的修改

CREATE DATABASE IF NOT EXISTS `owsdb`
COLLATE utf8_bin;
USE owsdb;

CREATE TABLE IF NOT EXISTS `weekly` (
    id VARCHAR(50) not null unique,
    year INTEGER not null,
    week tinyint not null,
    wkGeneral TEXT,
    wkIntelSysSummary TEXT,
    wkLinkSysSummary TEXT,
    wkSecSummary TEXT,
    wkDutyCheckSummary TEXT,
    wkHeavyDutySummary TEXT,
    createdAt bigint not null,
    updatedAt bigint not null,
    version bigint not null,
    primary key (id)
) engine=innodb,DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `cases` (
    id VARCHAR(50) not null,
    weeklyId VARCHAR(50) not null,
    year INTEGER not null,
    week tinyint not null,
    warZone TEXT not null,
    branchSysName TEXT not null,
    period11 BIGINT not null,
    period12 BIGINT not null,
    period21 BIGINT,
    period22 BIGINT,
    period31 BIGINT,
    period32 BIGINT,
    caseDescription TEXT not null,
    otherText TEXT,
    createdAt bigint not null,
    updatedAt bigint not null,
    version bigint not null,
    primary key (id),
    foreign key (weeklyId) references weekly(id) ON DELETE CASCADE ON UPDATE CASCADE
) engine=innodb,DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `divisions` (
    id VARCHAR(50) not null,
    warZone TEXT not null,
    branchSysName TEXT not null,
    sysRemark TEXT,
    createdAt bigint not null,
    updatedAt bigint not null,
    version bigint not null,
    primary key (id)
) engine=innodb,DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `templates` (
    id VARCHAR(50) not null unique,
    wkGeneral TEXT,
    wkIntelSysSummary TEXT,
    wkLinkSysSummary TEXT,
    wkSecSummary TEXT,
    wkDutyCheckSummary TEXT,
    wkHeavyDutySummary TEXT,
    createdAt bigint not null,
    updatedAt bigint not null,
    version bigint not null,
    primary key (id)
) engine=innodb,DEFAULT CHARSET=utf8;

-- 注意：这条模板测试数据中的id是恒定的，因为模板只有一个。便于events.js中更新。
-- INSERT INTO templates (id,wkGeneral,wkIntelSysSummary,wkLinkSysSummary,wkSecSummary,wkDutyCheckSummary,wkHeavyDutySummary,createdAt,updatedAt,version) values(1010,'测试G','测试IS','测试LS','测试SS',' 测试DC','测试HD',1300000,1300000,1);
