const { mysql } = require('../../../mysql')

module.exports = async (ctx) => {
    // 轮播图数据（选择ad_position_id为1的字段）
    const banner = await mysql('nideshop_ad').where({ad_position_id: 1}).select()

    // 频道数据
    const channel = await mysql('nideshop_channel').select()

    // 品牌数据（选择is_new为1的4个字段，并且按照new_sort_order排序输出）
    const brandList = await mysql('nideshop_brand').where({is_new: 1}).orderBy('new_sort_order', 'asc').limit(4).select()

    // 新品首发数据
    const newGoods = await mysql('nideshop_goods').where({is_new: 1}).limit(5).select()

    // 人气推荐数据
    const hotGoods = await mysql('nideshop_goods').column('id', 'name', 'list_pic_url', 'retail_price', 'goods_brief').where({is_hot: 1}).limit(5).select()
    
    // 专题精选
    const topicList = await mysql('nideshop_topic').limit(3).select()

    // 将**好物按标题分类好
    // parent_id为0表示当前字段为一个标题c，不是商品
    const categoryList = await mysql('nideshop_category').where({parent_id: 0}).select()
    const newCategoryList = []
    for (let i = 0; i < categoryList.length; ++i){
        let item = categoryList[i]
        let childCategoryIds = await mysql('nideshop_category').where({parent_id: item.id}).column('id').select()
        // 变成数组
        childCategoryIds = childCategoryIds.map((item) => {
            return item.id
        })
        // 在商品中找到在childCategoryIds里的7条数据
        const categoryGoods = await mysql('nideshop_goods').column('id', 'name', 'list_pic_url', 'retail_price').whereIn('category_id', childCategoryIds).limit(7).select()
        newCategoryList.push({
            'id': item.id,
            'name': item.name,
            'goodsList': categoryGoods
        })
    }

    ctx.body = {
        'banner': banner,
        'channel': channel,
        'brandList': brandList,
        'newGoods': newGoods,
        'hotGoods': hotGoods,
        'topicList': topicList,
        'newCategoryList': newCategoryList
    }
}