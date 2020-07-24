<template>
  <div class="cart">
    <div class="top">
      <div>30天无忧退货</div>
      <div>48小时快速退款</div>
      <div>满88元免邮费</div>
    </div>
    <div class="cartlist">
      <div class="item" v-for="(item, index) in listData" :key="index">
        <div class="con">
          <div class="left">
            <div
              class="icon"
              @click="changeColor(index, item.goods_id)"
              :class="[listIds[index] ? 'active' : '']"
            ></div>
            <div class="img">
              <img :src="item.list_pic_url" alt />
            </div>
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>¥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">x {{item.number}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed">
      <div class="left" @click="allCheck" :class="{'active': allcheck}">全选({{isCheckedNumber}})</div>
      <div class="right">
        <div>¥{{allPrice}}</div>
        <div @click="orderDown">下单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils"
export default {
  data () {
    return {
      openId: '', // 用户id
      listData: [], // 购物车中商品的信息
      listIds: [], // 购物车中商品是否勾选
      allcheck: false // 是否全选商品
    }
  },
  onShow () {
    this.openId = getStorageOpenid()
    this.getListData()
  },
  methods: {
    async getListData () {
      /**
       * 获取购物车中商品信息
       */
      const data = await get('/cart/cartlist', {
        openId: this.openId
      })
      console.log(data)
      this.listData = data.data
    },
    changeColor (index, id) {
      /**
       * 改变颜色
       */
      if (this.listIds[index]) {
        this.$set(this.listIds, index, false)
      } else {
        this.$set(this.listIds, index, id)
      }
    },
    allCheck () {
      /**
       * 全选商品
       */
      // 先清空选择
      this.listIds = []
      if (this.allcheck) {
        this.allcheck = false
      } else {
        this.allcheck = true
        // 全部选择
        for (let i = 0; i < this.listData.length; i++) {
          const element = this.listData[i]
          this.listIds.push(element.goods_id)
        }
      }
    },
    async orderDown () {
      /**
       * 下单按钮
       */
      if (this.listIds.length === 0) {
        uni.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      // 去除数组中空的false
      let newgoodsid = [] // 已被勾选的商品
      for (let i = 0; i < this.listIds.length; i++) {
        const element = this.listIds[i]
        if (element) {
          newgoodsid.push(element)
        }
      }
      let goodsId = newgoodsid.join(',')
      const data = await post('/order/submitaction', {
        goodsId: goodsId,
        openId: this.openId,
        allPrice: this.allPrice
      })
      if (data) {
        uni.navigateTo({
          url: '/pages/order/order'
        });
      }
    }
  },
  computed: {
    isCheckedNumber () {
      /**
       * 获取选中的商品的数量
       */
      let number = 0
      for (let i = 0; i < this.listIds.length; i++) {
        if (this.listIds[i]) {
          number++
        }
      }
      if (number == this.listData.length && number !== 0) {
        this.allcheck = true
      } else {
        this.allcheck = false
      }
      return number
    },
    allPrice () {
      /**
       * 计算总价格
       */
      let Price = 0
      for (let i = 0; i < this.listIds.length; i++) {
        if (this.listIds[i]) {
          Price += this.listData[i].retail_price * this.listData[i].number
        }
      }
      return Price
    }
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>