<template>
  <div class="goods">
    <div class="swiper">
      <!-- swiper 放轮播图，并设定播放时间等 -->
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
    </div>
  </div>
</template>

<script>
import { get, post } from "../../utils";
export default {
  data() {
    return {
      info: "", //商品信息
      gallery: [], // 商品图片
      id: "",
      openId: ""
    };
  },
  mounted() {
    this.openId = wx.getStorageSync("openId") || "";
    this.goodsDetail();
  },
  methods: {
    async goodsDetail() {
      /**
       * 商品数据详情请求
       */
      const data = await get("/goods/detailaction", {
        id: 1009024,
        openId: this.openId
      });
      console.log(data);
      this.info = data.info;
      this.gallery = data.gallery;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>