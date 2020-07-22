const { mysql } = require("../../../mysql");
const cart = require("../cart");

async function detailAction(ctx) {
  /**
   * 获取商品各种详细信息
   */
  const goodId = ctx.query.id;
  const openId = ctx.query.openId;
  // 获取商品信息
  const info = await mysql("nideshop_goods")
    .where({
      id: goodId,
    })
    .select();
  // 获取商品图片
  const gallery = await mysql("nideshop_goods_gallery")
    .where({
      goods_id: goodId,
    })
    .select();
  // 获取商品参数
  /**
   * 将 nideshop_goods_attribute 和 nideshop_attribute 两张表连在一起。
   * 找到 nideshop_goods_attribute 中 goods_id 和传入的 goodId 相同的记录
   * 再将 nideshop_goods_attribute 中拿到的记录取 attribute_id 去 nideshop_attribute 中找到 id 字段一样记录
   * 取 nideshop_attribute 中的 name和 nideshop_goods_attribute 中的 value
   * */

  const attribute = await mysql("nideshop_goods_attribute")
    .column("nideshop_goods_attribute.value", "nideshop_attribute.name")
    .leftJoin(
      "nideshop_attribute",
      "nideshop_goods_attribute.attribute_id",
      "nideshop_attribute.id"
    )
    .where({
      "nideshop_goods_attribute.goods_id": goodId,
    })
    .select();

  // 获取常见问题
  const issue = await mysql("nideshop_goods_issue").select();

  // 大家都在看
  const recommendList = await mysql("nideshop_goods")
    .where({
      category_id: info[0].category_id,
    })
    .select();

  // 判断是否收藏过
  const isCollect = await mysql("nideshop_collect")
    .where({
      user_id: openId,
      value_id: goodId,
    })
    .select();
  let collectFlag = false;
  if (isCollect.length > 0) {
    collectFlag = true;
  }

  // 判断购物车中有几件商品
  const cartNumber = await mysql("nideshop_cart")
    .where({
      user_id: openId,
    })
    .column("number")
    .select();
  let allNumber = 0;
  if (cartNumber) {
    for (let i = 0; i < cartNumber.length; ++i) {
      const element = cartNumber[i];
      allNumber += element.number;
    }
  }

  ctx.body = {
    info: info[0] || [],
    gallery: gallery,
    attribute: attribute,
    issue: issue,
    recommendList: recommendList,
    collectFlag: collectFlag,
    allNumber: allNumber,
  };
}

module.exports = {
  detailAction,
};
