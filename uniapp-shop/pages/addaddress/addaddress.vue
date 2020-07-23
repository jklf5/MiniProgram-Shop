<template>
  <div class="addaddress">
    <div class="item">
      <input type="text" placeholder="姓名" v-model="userName" />
    </div>
    <div class="item">
      <input type="text" placeholder="手机号码" v-model="telNumber" />
    </div>
    <div class="item">
      <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
        <input type="text" placeholder="省份、城市、区县" v-model="address" />
      </picker>
    </div>
    <div class="item">
      <input type="text" placeholder="详细地址，如楼道、楼盘号等" v-model="detailaddress" />
    </div>

    <!-- 一键导入微信地址和设为默认地址 -->
    <div class="item itemend">
      <checkbox-group @change="checkboxChange">
        <label class="checkbox">
          <checkbox class="box" value="true" :checked="checked" color="#b4282d"></checkbox>设置为默认地址
        </label>
      </checkbox-group>
      <div @click="wxaddress">一键导入微信</div>
    </div>

    <div class="bottom" @click="saveAddress">保存</div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils";
export default {
  data () {
    return {
      userName: '', // 姓名
      telNumber: '', // 手机号
      region: [], // 地区
      customItem: '全部', // 地址的选择框的默认值
      address: '', // 省市区地址
      detailaddress: '', // 详细地址
      checked: false, // 是否为默认地址
      openId: '', // 用户ID
      res: '',
      id: '' // 地址id
    }
  },
  mounted() {
    this.openId = getStorageOpenid()
    // 判断是哪个页面跳转过来的
    if (this.$root.$mp.query.res) {
      // 是一键导入微信按钮跳转过来的
      this.res = JSON.parse(decodeURIComponent(this.$root.$mp.query.res))
      console.log(this.res, '------')
      this.userName = this.res.userName
      this.telNumber = this.res.telNumber
      this.address = `${this.res.provinceName} ${this.res.cityName} ${this.res.countyName}`
      this.detailaddress = this.res.detailInfo
    }
    if (this.$root.$mp.query.id) {
      // 是修改地址按钮跳转过来的
      this.id = this.$root.$mp.query.id
      this.getDetail()
    }
  },
  methods: {
    async getDetail () {
      /**
       * 获取需要修改的地址的详细地址
       */
      const data = await get('/address/detailaction', {
        id: this.id
      })
      console.log(data)
      let detail = data.data
      this.userName = detail.name
      this.telNumber = detail.mobile
      this.address = detail.address
      this.detailaddress = detail.address_detail
      this.checked = detail.is_default === 1 ? true : false
    },
    checkboxChange (e) {
      /**
       * 判断是否选为默认地址
       */
      this.checked = e.mp.detail.value[0]
    },
    bindRegionChange (e) {
      /**
       * 省市区框选择
       */
      console.log(e)
      let value = e.mp.detail.value
      this.address = `${value[0]} ${value[1]} ${value[2]}`
    },
    wxaddress () {
      /**
       * 一键导入微信地址
       */
      uni.chooseAddress({
        success: (result) => {
          console.log(result)
          this.userName = result.userName
          this.telNumber = result.telNumber
          this.address = `${result.provinceName} ${result.cityName} ${result.countyName}`
          this.detailaddress = result.detailInfo
        },
        fail: () => {},
        complete: () => {}
      });
        
    },
    async saveAddress () {
      /**
       * 保存地址
       */
      const data = await post('/address/saveaction', {
        userName: this.userName,
        telNumber: this.telNumber,
        address: this.address,
        detailaddress: this.detailaddress,
        checked: this.checked,
        openId: this.openId,
        addressId: this.id
      })
      console.log(data)
      if (data.data) {
        uni.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 2000)
          },
          fail: () => {},
          complete: () => {}
        });
          
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>