<template>
  <div class="index">
    <!-- 头部定位与搜索 -->
    <div class="search">
      <div @click="toMappage">{{ cityName }}</div>
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品" />
        <span class="icon"></span>
      </div>
    </div>

    <!-- 轮播页面 -->
    <div class="swiper">
      <swiper
        class="swiper-container"
        indicator-dots="true"
        autoplay="true"
        interval="3000"
        circular="true"
        duration="500"
      >
        <block v-for="(item, index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image class="slide-image" :src="item.image_url" />
          </swiper-item>
        </block>
      </swiper>
    </div>

    <!-- 频道选项 -->
    <div class="channel">
      <div v-for="(item, index) in channel" :key="index" @click="categoryList(item.id)">
        <div>
          <img :src="item.icon_url" alt />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>

    <!-- 品牌制造商直供 -->
    <div class="brand">
      <div class="head" @click="toBrandList">品牌制造商直供</div>
      <div class="content">
        <div v-for="(item, index) in brandList" :key="index" @click="brandDetail(item.id)">
          <div class="big">
            <div>
              <p>{{ item.name }}</p>
              <p>{{ item.floor_price }}元起</p>
            </div>
            <img :src="item.new_pic_url" alt />
          </div>
        </div>
      </div>
    </div>

    <!-- 新品首发（X轴滚动） -->
    <div class="newgoods">
      <div class="newgoods-top" @click="goodsList('new')">
        <div class="top">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item, index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt />
              <p>{{ item.name }}</p>
              <p>{{ item.goods_brief }}</p>
              <p>￥{{ item.retail_price }}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>

    <!-- 好物精选 -->
    <div class="newgoods hotgoods">
      <div class="newgoods-top" @click="goodsList('hot')">
        <div class="top">
          <p>
            人气推荐
            <span></span>
            好物精选
          </p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item, index) in hotGoods" :key="index">
              <img :src="item.list_pic_url" alt />
              <p>{{ item.name }}</p>
              <p>{{ item.goods_brief }}</p>
              <p>￥{{ item.retail_price }}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>

    <!-- 专题精选 -->
    <div class="topicList">
      <div class="topicList-top">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <li>
            <scroll-view class="scroll-view" :scroll-x="true">
              <li v-for="(item, index) in topicList" :key="index" @click="topicDetail(item.id)">
                <img :src="item.item_pic_url" alt />
                <div class="btom">
                  <div>
                    <p>{{ item.title }}</p>
                    <p>{{ item.subtitle }}</p>
                  </div>
                  <div>{{ item.price_info }}元起</div>
                </div>
              </li>
            </scroll-view>
          </li>
        </ul>
      </div>
    </div>

    <!-- 好物商品 -->
    <div class="newcategory">
      <div class="list" v-for="(item, index) in newCategoryList" :key="index">
        <div class="head">{{ item.name }}好物</div>
        <div class="sublist">
          <div v-for="(subitem, subindex) in item.goodsList" :key="subindex">
            <img :src="subitem.list_pic_url" alt />
            <p>{{ subitem.name }}</p>
            <p>{{ subitem.retail_price }}</p>
          </div>
          <div>
            <div class="last">
              <p>{{ item.name }}好物</p>
              <span class="icon"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import amapFile from "../../utils/amap-wx.js";
import { mapState, mapMutations } from "vuex";
import { get } from "../../utils";
export default {
  data() {
    return {
      banner: [],
      channel: [],
      brandList: [],
      newGoods: [],
      hotGoods: [],
      topicList: [],
      newCategoryList: []
    };
  },
  computed: {
    ...mapState(["cityName"])
  },
  // 生命周期
  mounted() {
    this.getData();
    this.getCityName();
  },
  methods: {
    ...mapMutations(["update"]),
    toMappage() {
		/**
		 * 位置的点击事件
		 */
      // 通过 wx.getSetting 先查询一下用户是否授权 "scoped.record"
      let _this = this;
      uni.getSetting({
        success: res => {
          // 如果没有同意，打开设置
          console.log(res);
          if (!res.authSetting["scope.userLocation"]) {
            uni.openSetting({
              success: result => {
                // 获取授权位置信息
                _this.getCityName();
              }
            });
          } else {
            uni.navigateTo({
              url: "/pages/mappage/mappage"
            });
          }
        },
        fail: err => {
          console.log(err);
        },
        complete: () => {}
      });
    },

    getCityName() {
		/**
		 * 调用高德api 获取地理信息
		 */
      let _this = this;
      var myAmapFun = new amapFile.AMapWX({
        key: "9723bca47dcc13224b0cc55e9322bb9e"
      });
      myAmapFun.getRegeo({
        success: function(data) {
          // 成功回调
          console.log(data);
        },
        fail: function(info) {
          // 失败回调
          console.log(info);
          // _this.cityName = "北京";
          _this.update({ cityName: "北京" });
        }
      });
    },

    async getData() {
		/**
		 * 请求数据(轮播图数据，频道数据等)
		 */
      const data = await get("/index/index");
      // console.log(data);
      this.banner = data.banner;
      this.channel = data.channel;
      this.brandList = data.brandList;
      this.newGoods = data.newGoods;
      this.hotGoods = data.hotGoods;
      this.topicList = data.topicList;
      this.newCategoryList = data.newCategoryList;
    },
 
    toSearch() {
		/**
		 * 搜索跳转
		 */
      uni.navigateTo({
        url: "/pages/search/search"
      });
    },

    categoryList(id) {
		/**
		 * 频道页面跳转
		 */
      uni.navigateTo({
        url: "/pages/categorylist/categorylist?id=" + id
      });
    },

    brandDetail(id) {
		/**
		 * 品牌页面跳转
		 */
      uni.navigateTo({
        url: "/pages/branddetail/main?id=" + id
      });
    },

    toBrandList() {
		/**
		 * 点击品牌制造商直供后跳转
		 */
      uni.navigateTo({
        url: "/pages/brandlist/brandlist"
      });
    },

    goodsList(info) {
		/**
		 * 新品首发和好物精选跳转
		 */
      if (info == "hot") {
        uni.navigateTo({
          url: "/pages/newgoods/newgoods?isHot=" + 1
        });
      } else {
        uni.navigateTo({
          url: "/pages/newgoods/newgoods?isNew=" + 1
        });
      }
    },

    topicDetail(id) {
		/**
		 * 专题精选跳转
		 */
      uni.navigateTo({
        url: "/pages/topicdetail/topicdetail?id=" + id
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
