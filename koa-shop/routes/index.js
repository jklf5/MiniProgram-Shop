// 路由分发

// mp_router :小程序所用
const mp_router = require("koa-router")({
  prefix: "/miniprogram",
});
/**
 * mp_controllers : 小程序用控制器
 * mc_controllers : 后台用控制器
 */
const mp_controllers = require("../controllers/miniprogram/index");
const mc_controllers = require("../controllers/management/index");

/**
 * 首页相关的接口
 */
mp_router.get("/index/index", mp_controllers.home.index);

/**
 * 搜索页面相关的接口
 */
// 获取数据库中搜索历史和热门搜索的数据
mp_router.get("/search/indexaction", mp_controllers.search.index.indexAction);
// 将搜索框中的输入传入数据库中并判断
mp_router.post(
  "/search/addhistoryaction",
  mp_controllers.search.index.addHistoryAction
);
// 清除历史框记录
mp_router.post(
  "/search/clearhistoryaction",
  mp_controllers.search.index.clearHistoryAction
);
// 搜索候选提示
mp_router.get("/search/helperaction", mp_controllers.search.index.helperAction);

/**
 * 商品详情页面相关接口
 */
// 获取商品详情
mp_router.get("/goods/detailaction", mp_controllers.goods.index.detailAction);

/**
 * 商品收藏相关接口
 */
// 添加收藏
mp_router.post("/collect/addcollect", mp_controllers.collect.index.addCollect);

/**
 * 订单相关的接口
 */
// 商品详情页立即购买按钮
mp_router.post("/order/submitaction", mp_controllers.order.index.submitAction);
// 获取购买商品的金额,运费等信息
mp_router.get("/order/detailaction", mp_controllers.order.index.detailAction);


/**
 * 购物车相关接口
 */
// 将商品加入购物车
mp_router.post("/cart/addcart", mp_controllers.cart.index.addCart);


/**
 * 地址相关接口
 */
// 获取地址列表
mp_router.get("/address/getlistaction", mp_controllers.address.index.getListAction);
// 保存地址
mp_router.post("/address/saveaction", mp_controllers.address.index.saveAction)
// 
mp_router.get("/address/detailaction", mp_controllers.address.index.detailAction)

module.exports = mp_router;
