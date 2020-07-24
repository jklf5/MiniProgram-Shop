const { mysql } = require('../../../mysql')

async function categoryNav(ctx) {
  /**
   * 获取分类列表,导航栏
   */
  const categoryId = ctx.query.id
  // 获取分类
  const currentNav = await mysql('nideshop_category').where({
    'id': categoryId
  }).select()
  // 获取它的同类
  const navData = await mysql('nideshop_category').where({
    'parent_id': currentNav[0].parent_id
  }).select()

  ctx.body = {
    navData,
    currentNav: currentNav[0]
  }
}

async function indexAction(ctx) {
  /**
   * 分类页面
   */
  const { id: categoryId } = ctx.query
  const data = await mysql('nideshop_category').where({
    'parent_id': 0
  }).select()
  const currentCategory = []
  if (categoryId) {
    currentCategory = await mysql('nideshop_category').where({
      'parent_id': categoryId
    }).select()
  }

  ctx.body = {
    'categoryList': data
  }
}

async function currentAction(ctx) {
  /**
   * 点击左侧菜单获取的分类商品
   */
  const { id: categoryId } = ctx.query

  const data =  {}
  const currentOne = await mysql('nideshop_category').where({
    'id': categoryId
  }).select()
  const subList = await mysql('nideshop_category').where({
    'parent_id': currentOne[0].id
  }).select()
  data.currentOne = currentOne[0]
  data.currentOne.subList = subList

  ctx.body = {
    'data': data
  }
}

module.exports = {
  categoryNav,
  indexAction,
  currentAction
}