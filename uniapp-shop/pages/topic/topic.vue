<template>
  <div class="topic">
    <ui class="list">
      <li v-for="(item, index) in topicList" :key="index" @click="topicDetail(item.id)">
        <div class="t-img">
          <img :src="item.scene_pic_url" alt />
        </div>
        <div class="info">
          <p>{{item.title}}</p>
          <p>{{item.subtitle}}</p>
          <p>{{item.price_info}}元起</p>
        </div>
      </li>
    </ui>
  </div>
</template>

<script>
import { get } from '../../utils'
export default {
  data () {
    return {
      page: 1,
      topicList: [],
      total: ''
    }
  },
  onPullDownRefresh () {
    // 下拉刷新
    this.page = 1
    this.getListData()
    uni.stopPullDownRefresh()
  },
  onReachBottom () {
    // 下滑加载更多
    this.page = this.page + 1
    if (this.page > this.total) {
      return false
    }
    this.getListData()
  },
  mounted () {
    this.getListData(true)
  },
  methods: {
    async getListData (first) {
      const data = await get ('/topic/listaction', {
        page: this.page
      })
      console.log(data)
      // 加载更多时与以前的数据拼接
      this.total = data.total
      if (first) {
        this.topicList = data.data
      } else {
        this.topicList = this.topicList.concat(data.data)
      }
    },
    topicDetail (id) {
      uni.navigateTo({
        url: '/pages/topicdetail/topicdetail?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>