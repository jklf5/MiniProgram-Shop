const { mysql } = require('../../../mysql')

async function addCollect(ctx) {
    /**
     * 添加收藏
     */
    const { openId, goodsId } = ctx.request.body

    // 判断是否已经收藏
    const isCollect = await mysql('nideshop_collect').where({
        'user_id': openId,
        'value_id': goodsId
    }).select()
    if (isCollect.length == 0) {
        await mysql('nideshop_collect').insert({
            'user_id': openId,
            'value_id': goodsId
        })
    } else {
        await mysql('nideshop_collect').where({
            'user_id': openId,
            'value_id': goodsId
        }).del()
    }

    ctx.body = {
        data: 'success'
    }
}

module.exports = {
    addCollect
}