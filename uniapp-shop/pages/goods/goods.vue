<template>
  <div class="goods">
    <!-- swiper 放轮播图，并设定播放时间等 -->
    <div class="swiper">
      <swiper
        class="swiper-container"
        indicator-dots="true"
        autoplay="true"
        interval="3000"
        duration="1000"
      >
        <blok v-for="(item, index) in gallery" :key="index">
          <swiper-item class="swiper-item">
            <!-- swiper-item 放每一张图片 -->
            <img :src="item.img_url" alt class="slide-image" />
          </swiper-item>
        </blok>
      </swiper>
      <!-- 小程序分享 -->
      <button class="share" hover-class="none" open-type="share" value>分享商品</button>
    </div>

    <!-- 商品服务政策 -->
    <div class="swiper-b">
      <div class="item">30天</div>
      <div class="item">48小时</div>
      <div class="item">7天无理由</div>
    </div>

    <!-- 描述商品信息 -->
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>￥{{info.retail_price}}</p>
        <div class="brand" v-if="brand.name">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>

    <!-- 选择规格数量 -->
    <div class="section-nav" @click="showType">
      <div>请选择规格数量</div>
      <div></div>
    </div>

    <!-- 选择规格数量的弹出框 -->
  </div>
</template>

<script>
import { get, post } from "../../utils";
export default {
  data() {
    return {
      info: {}, //商品信息
      gallery: [], // 商品图片
      id: "",
      openId: "",
      brand: [],
      showpop: false
    };
  },
  // 商品分享配置
  onShareAppMessage() {
    return {
      title: this.info.name,
      path: "pages/goods/main?id" + this.info.id,
      imageUrl: this.gallery[0].img_url
    };
  },
  mounted() {
    this.openId = wx.getStorageSync("openId") || "";
    this.id = this.$root.$mp.query.id;
    this.goodsDetail();
  },
  methods: {
    async goodsDetail() {
      /**
       * 商品数据详情请求
       */
      const data = await get("/goods/detailaction", {
        id: this.id,
        openId: this.openId
      });
      console.log(data);
      this.info = data.info;
      this.gallery = data.gallery;
    },
    showType() {
      this.showpop = !this.showpop;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>