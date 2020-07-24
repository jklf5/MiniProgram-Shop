<template>
  <!-- 订单页面 -->
  <div class="order">
    <!-- 地址 -->
    <div class="address" v-if="address.name" @click="toAddressList">
      <div class="item">
        <div class="list">
          <div class="addresslist">
            <div>
              <span>{{ address.name }}</span>
              <div class="moren" v-if="isDefault">默认</div>
            </div>
            <div class="info">
              <p>{{ address.mobile }}</p>
              <p>{{ address.address + address.address_detail }}</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="seladdress" v-else @click="toAdd">请选择默认地址</div>

    <!-- 购买商品的费用等 -->
    <div class="orderbox">
      <div class="item">
        <div>商品合计</div>
        <div>￥{{ allPrice }}</div>
      </div>
      <div class="item">
        <div>运费</div>
        <div>免运费</div>
      </div>
      <div class="item">
        <div>优惠券</div>
        <div>暂无</div>
      </div>
    </div>

    <!-- 购买的什么商品 -->
    <div class="cartlist" v-for="(item, index) in listData" :key="index">
      <div class="item">
        <div class="con">
          <div class="left">
            <div class="img">
              <img :src="item.list_pic_url" alt />
            </div>
            <div class="info">
              <p>{{ item.goods_name }}</p>
              <p>￥{{ item.retail_price }}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">x{{ item.number }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="bottom">
      <div>实付: ￥{{allPrice}}</div>
      <div class="pay" @click="pay">支付</div>
    </div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils";
export default {
  data() {
    return {
      address: {}, // 地址列表
      allPrice: "", // 总价格
      price: "", // 单价
      openId: "", // 用户id
      id: "", // 商品id
      addressId: "", //
      listData: [], // 购买的商品信息列表
      isDefault: "" // 地址是否是默认地址
    };
  },
  onShow() {
    if (uni.getStorageSync("addressId")) {
      this.addressId = uni.getStorageSync("addressId");
    }
    this.openId = getStorageOpenid();
    this.id = this.$root.$mp.query.id;
    this.getDetail();
  },
  methods: {
    toAdd() {
      /**
       * 添加地址
       */
      uni.navigateTo({
        url: "/pages/addaddress/addaddress"
      });
    },
    toAddressList() {
      /**
       * 对现有地址操作
       */
      uni.navigateTo({
        url: "/pages/operateaddress/operateaddress"
      });
    },
    async getDetail() {
      /**
       * 获取购买商品的金额,运费等信息
       */
      const data = await get("/order/detailaction", {
        openId: this.openId,
        addressId: this.addressId
      });
      console.log(data);
      if (data) {
        // this.allprice = data.price
        this.listData = data.goodsList;
        this.address = data.address;
        this.isDefault = data.address.is_default;
      }
      // console.log(this.isDefault)
      this.allPrice = 0
      this.listData.map(item => {
        this.allPrice =
          Number(item.retail_price * item.number) + Number(this.allPrice);
      });
    },
    pay() {
      /**
       * 支付
       */
      wx.showToast({
        title: "支付功能暂未开发",
        icon: "none",
        duration: 1500,
        mask: false,
        success: res => {}
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
