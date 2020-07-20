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
      <button class="share" hover-class="none" open-type="share" value>
        分享商品
      </button>
    </div>

    <!-- 商品服务政策 -->
    <div class="swiper-b">
      <div class="item">30天</div>
      <div class="item">48小时</div>
      <div class="item">7天无理由</div>
    </div>

    <!-- 描述商品基本信息（名字、简单描述、价格） -->
    <div class="goods-info">
      <div class="c">
        <p>{{ info.name }}</p>
        <p>{{ info.goods_brief }}</p>
        <p>￥{{ info.retail_price }}</p>
        <div class="brand" v-if="brand.name">
          <p>{{ brand.name }}</p>
        </div>
      </div>
    </div>

    <!-- 选择规格数量 -->
    <div class="section-nav" @click="showType">
      <div>请选择规格数量</div>
      <div></div>
    </div>

    <!-- 商品规格参数 -->
    <div class="attribute">
      <div class="head">商品参数</div>
      <div class="item" v-for="(item, index) in attribute" :key="index">
        <div>{{ item.name }}</div>
        <div>{{ item.value }}</div>
      </div>
    </div>

    <!-- 商品详情展示 -->
    <div class="detail" v-if="goods_desc">
      <u-parse :content="goods_desc"></u-parse>
    </div>

    <!-- 常见问题 -->
    <div class="common-problem">
      <div class="head">
        <text class="title">常见问题</text>
      </div>
      <div class="bottom">
        <div class="item" v-for="(item, index) in issueList" :key="index">
          <div class="question-box">
            <text class="spot"></text>
            <text class="question">{{ item.question }}</text>
          </div>
          <div class="answer">{{ item.answer }}</div>
        </div>
      </div>
    </div>

    <!-- 大家都在看 -->
    <scroll-vie enable-flex scroll-y @scrolltolower="scrolla">
      <div class="common-problem">
        <div class="head">
          <text class="title">大家都在看</text>
        </div>
        <div class="sublist">
          <div v-for="(reitem, reindex) in recommendList" :key="reindex">
            <img :src="reitem.list_pic_url" alt />
            <p>{{ reitem.name }}</p>
            <p>￥{{ reitem.retail_price }}</p>
          </div>
        </div>
      </div>
    </scroll-vie>

    <!-- 最底部（收藏，加入购物车等） -->
    <div class="bottom-fixed">
      <div class="collect-box" @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' : '']"></div>
      </div>
      <div class="cart-box" @click="toCart">
        <div class="cart">
          <span>{{ allNumber }}</span>
          <img src="../../static/images/ic_menu_shopping_nor.png" alt />
        </div>
      </div>
      <div @click="buy">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 选择规格数量的弹出框 -->
    <div class="pop" v-show="showpop" @click="showType"></div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.primary_pic_url" alt />
        </div>
        <div class="right">
          <div>
            <p>价格￥{{ info.retail_price }}</p>
            <p>请选择数量</p>
          </div>
        </div>
        <div class="close" @click="showType">✖️</div>
      </div>
      <div class="bottom">
        <p>数量</p>
        <div class="count">
          <div class="cut" @click="reduce">-</div>
          <input type="text" class="number" v-model="number" disabled="false" />
          <div class="add" @click="add">+</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "../../utils";
import uParse from "@/components/u-parse/u-parse.vue";
export default {
  data() {
    return {
      info: {}, //商品信息
      gallery: [], // 商品图片
      id: "", // 商品id
      openId: "", // 用户id
      brand: [], // 商品简短描述
      showpop: false, // 是否弹出选择规格数量
      number: 1, // 选择商品数量的默认值
      attribute: [], // 商品规格参数
      goods_desc: "", // 商品详情
      issueList: [], // 常见问题
      recommendList: [], // 大家都在看数据
      collectFlag: false, // 控制收藏状态
      allNumber: 0, // 购物车角标显示数据库里有多少件商品
      allPrice: 0, // 当前商品想添加进购物车的总价格
    };
  },
  // 使用富文本解析器：uparse
  components: {
    uParse,
  },
  // 商品分享配置
  onShareAppMessage() {
    return {
      title: this.info.name,
      path: "pages/goods/main?id" + this.info.id,
      imageUrl: this.gallery[0].img_url,
    };
  },
  mounted() {
    this.openId = uni.getStorageSync("openId") || "";
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
        openId: this.openId,
      });
      console.log(data);
      this.info = data.info;
      this.gallery = data.gallery;
      this.attribute = data.attribute;
      this.goods_desc = data.info.goods_desc;
      this.issueList = data.issue;
      // this.recommendList = data.recommendList;
      this.collectFlag = data.collectFlag;
      this.allNumber = data.allNumber;
    },
    async scrolla() {
      const data = await get("/goods/detailactionre", {
        id: this.id,
        openId: this.openId,
      });
      this.recommendList = data.recommendList;
    },
    showType() {
      this.showpop = !this.showpop;
    },
    add() {
      this.number += 1;
    },
    reduce() {
      if (this.number > 1) {
        this.number -= 1;
      } else {
        return false;
      }
    },
    async collect() {
      this.collectFlag = !this.collectFlag;
      const data = await post("/collect/addcollect", {
        openId: this.openId,
        goodsId: this.id,
      });
    },
    toCart() {
      uni.switchTab({
        url: "/pages/cart/cart",
      });
    },
    async buy() {
      this.allPrice = this.info.retail_price;
      if (this.showpop) {
        if (this.number === 0) {
          uni.showToast({
            title: "请选择商品数量",
            duration: 2000,
            icon: "none",
            mask: true,
            success: (res) => {},
          });
          return false;
        }
        const data = await post("/order/submitaction", {
          goodsId: this.id,
          openId: this.openId,
          allPrice: this.allPrice,
        });
        if (data) {
          uni.navigateTo({
            url: "/pages/order/order",
          });
        }
      } else {
        this.showpop = true;
      }
    },
    addCart() {},
  },
};
</script>

<style lang="less" scoped>
@import "./style.less";
@import url("@/components/u-parse/u-parse.css");
</style>
