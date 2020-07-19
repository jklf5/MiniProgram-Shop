// 路由分发

// mp_router :小程序所用
const mp_router = require('koa-router')({
    prefix: '/miniprogram'
})
/**
 * mp_controllers : 小程序用控制器
 * mc_controllers : 后台用控制器
 */
const mp_controllers = require('../controllers/miniprogram/index')
const mc_controllers = require('../controllers/management/index')

/**
 * 首页相关的接口
 */
mp_router.get('/index/index', mp_controllers.home.index)

/**
 * 搜索页面相关的接口
 */
// 获取数据库中搜索历史和热门搜索的数据
mp_router.get('/search/indexaction', mp_controllers.search.index.indexAction)
// 将搜索框中的输入传入数据库中并判断
mp_router.post('/search/addhistoryaction', mp_controllers.search.index.addHistoryAction)
// 清除历史框记录
mp_router.post('/search/clearhistoryaction', mp_controllers.search.index.clearHistoryAction)
// 搜索候选提示
mp_router.get('/search/helperaction', mp_controllers.search.index.helperAction)

/**
 * 商品详情页面相关接口
 */
// 获取商品详情
mp_router.get('/goods/detailaction', mp_controllers.goods.index.detailAction)

/**
 * 商品收藏
 */
mp_router.post('/collect/addcollect', mp_controllers.collect.index.addCollect)

module.exports = mp_router