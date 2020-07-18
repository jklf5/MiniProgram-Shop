// 获取基础配置
const configs = require('./config')

// knex:用来创建线程池
// 将基础配置和knex的sdk.config合并
var knex = require('knex') ({
    client: 'mysql',
    connection: {
        host: configs.mysql.host,
        port: configs.mysql.port,
        user: configs.mysql.user,
        password: configs.mysql.pass,
        database: configs.mysql.db,
    }
})

// 导出初始化完成的sdk
module.exports = { mysql: knex }