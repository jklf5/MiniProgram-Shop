const { mysql } = require('../../../mysql')

/* indexAction 和 addHistoryAction 中获取参数的方法不同是因为一个是 GET，一个是POST, 解析POST请求需要koa-bodyparser库 */

async function indexAction(ctx) {
    /**
     * 获取数据库中搜索历史和热门搜索的数据
     */
    const openId = ctx.query.openId
    // 取出热门搜索中的2个默认关键字(红色字体那个关键字)
    const defaultKeyword = await mysql('nideshop_keywords').distinct('keyword').where({
        is_default: 1
    }).limit(2).select()

    // 取出热门搜索中的5个关键字（不是红色的关键字）
    const hotKeywordList = await mysql('nideshop_keywords').distinct('keyword').where({
        is_hot: 1
    }).column('keyword', 'is_default', 'is_hot').limit(5).select()

    //  取出搜索历史记录
    const historyData = await mysql('nideshop_search_history').where({
        'user_id': openId
    }).distinct('keyword').limit(10).select()
    
    ctx.body = {
        'defaultKeyword': defaultKeyword,
        'historyData': historyData,
        'hotKeywordList': hotKeywordList
    }
}

async function addHistoryAction(ctx) {
    /**
     * 将搜索框中的输入传入数据库中并判断
     */
    const { openId, keyword } = ctx.request.body
    // 查询当前搜索字段是否是一个已经存在于数据库中的记录
    const oldData = await mysql('nideshop_search_history').where({'user_id': openId, 'keyword': keyword})
    // 如果当前搜索的是一个新记录，则存入数据库中作为历史记录。否则显示
    if (oldData.length == 0) {
        const data = await mysql('nideshop_search_history').insert({
            'user_id': openId,
            'keyword': keyword,
            'add_time': parseInt(new Date().getTime() / 1000)
        })
        if (data) {
            ctx.body = {
                data: 'success'
            }
        }else{
            ctx.body = {
                data: 'fail'
            }
        }
    }else{
        ctx.body = {
            data: '已经有记录了'
        }
    }
}

async function clearHistoryAction(ctx) {
    /**
     * 清除历史框记录
     */
    const openId = ctx.request.body.openId
    const data = await mysql('nideshop_search_history').where({
        'user_id': openId
    }).del()
    if (data) {
        ctx.body = {
            'data': "清除成功"
        }
    }else {
        ctx.body = {
            'data': "清除失败"
        }
    }
    
}

async function helperAction(ctx) {
    /**
     * 搜索时候选提示
     */
    const keyword = ctx.query.keyword
    var order = ctx.query.order
    if (!order) {
        order = ''
        orderBy = 'id'
    }else{
        orderBy = 'retail_price'
    }
    // 查询name字段是否存在输入关键字
    const keywords = await mysql('nideshop_goods').orderBy(orderBy, order).
    column('id', 'name', 'list_pic_url', 'retail_price').where('name', 'like', '%' + keyword + '%').limit(10).select()
    if (keywords) {
        ctx.body = {
            keywords
        }
    }else{
        ctx.body = {
            keywords: []
        }
    }
}

module.exports = {
    indexAction,
    addHistoryAction,
    clearHistoryAction,
    helperAction
}