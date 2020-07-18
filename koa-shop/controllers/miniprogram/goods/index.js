const { mysql } = require('../../../mysql')

async function detailAction(ctx) {
    /**
     * 获取商品详情
     */
    const goodId = ctx.query.id
    const openId = ctx.query.openId
    // 获取商品信息
    const info = await mysql('nideshop_goods').where({
        'id': goodId
    }).select()
    // 获取商品图片
    const gallery = await mysql('nideshop_goods_gallery').where({
        'goods_id': goodId
    }).select()

    ctx.body = {
        'info': info[0] || [],
        'gallery': gallery
    }
}

module.exports = {
    detailAction
}