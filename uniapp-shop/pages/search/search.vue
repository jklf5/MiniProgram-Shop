<template>
  <div class="search">
    <!-- 头部搜索框 -->
    <div class="head">
      <div>
        <!-- http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png -->
        <img src="../../static/images/search.png" alt />
        <input
          type="text"
          confirm-type="search"
          focus="true"
          v-model="words"
          @focus="inputFocus"
          @input="tipSearch"
          placeholder="商品搜索"
          @confirm="searchWords"
        />
        <!-- http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png -->
        <img @click="clearInput" class="del" src="../../static/images/clear_input.png" alt />
      </div>
      <div @click="cancel">取消</div>
    </div>

    <!-- 搜索提示框 -->
    <div class="searchtips" v-if="words">
      <div v-if="tipsData.length != 0">
        <div
          v-for="(item, index) in tipsData"
          :key="index"
          @click="searchWords"
          :data-value="item.name"
        >{{item.name}}</div>
      </div>
      <div class="nogoods" v-else>数据库暂无此类商品...</div>
    </div>

    <!-- 历史记录 -->
    <div class="history" v-if="historyData.length !== 0">
      <div class="t">
        <div>历史记录</div>
        <div @click="clearHistory"></div>
      </div>
      <div class="cont">
        <div
          v-for="(item, index) in historyData"
          :key="index"
          @click="searchWords"
          :data-value="item.keyword"
        >{{item.keyword}}</div>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div class="history hotsearch">
      <div class="t">
        <div>热门搜索</div>
      </div>
      <div class="cont">
        <div
          class="active"
          v-for="(deitem, deindex) in defaultKeyword"
          :key="deindex"
          @click="searchWords"
          :data-value="deitem.keyword"
        >{{deitem.keyword}}</div>
        <div
          v-for="(item, index) in hotKeywordList"
          :key="index"
          @click="searchWords"
          :data-value="item.keyword"
        >{{item.keyword}}</div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="goodsList" v-if="goodsListData.length !== 0">
      <div class="sortnav">
        <!-- 点击哪个，哪个就显示红色，默认综合显示红色 -->
        <div @click="changeTab(0)" :class="[0 === nowIndex ? 'active' : '']">综合</div>
        <div @click="changeTab(1)" class="price" :class="[1 === nowIndex ? 'active' : '', order]">价格</div>
        <div @click="changeTab(2)" :class="[2 === nowIndex ? 'active' : '']">分类</div>
      </div>
      <div class="sortlist">
        <div
          @click="goodsDetail(item.id)"
          class="item"
          v-for="(item, index) in goodsListData"
          :key="index"
        >
          <img :src="item.list_pic_url" alt />
          <p class="name">{{item.name}}</p>
          <p class="price">￥{{item.retail_price}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from "../../utils";
export default {
  data() {
    return {
      words: "", // 当前输入的关键字
      openid: "", // 用户id
      defaultKeyword: [], // 热门搜索中显示红色的数据
      historyData: [], // 历史记录信息
      hotKeywordList: [], // 热门搜索关键字信息
      tipsData: [], // 搜索候选提示数据
      order: "", // 价格是正序还是倒序
      goodsListData: [], // 商品数据列表
      nowIndex: 0 // 控制哪个商品排序是红色字体
    };
  },
  mounted() {
    // 进入页面清空搜索关键字
    this.words = "";
    // 取授权后的openid
    this.openid = uni.getStorageSync("openId") || "";
    // console.log(this.openid);
    this.getHistoryHotData();
  },
  methods: {
    // (点击历史记录、热门搜索中的关键词的时候直接跳转商品，无需再显示候选提示)
    clearInput() {
      /**
       * 清除搜索框
       */
      this.words = "";
      this.goodsListData = [];
    },

    cancel() {
      /**
       * 取消搜索，返回上一个页面
       */
      uni.navigateBack({
        // delta为几就返回第几层页面
        delta: 1
      });
    },

    async clearHistory() {
      /**
       * 清除历史记录
       */
      const data = await post("/search/clearhistoryaction", {
        openId: this.openid
      });
      // console.log(data);
      if (data) {
        this.historyData = [];
      }
    },

    inputFocus() {
      /**
       * 搜索框聚焦：商品清空 ，展示候选提示
       */
      this.goodsListData = [];
      this.tipSearch();
    },

    async tipSearch() {
      /**
       * 搜索框候选提示
       */
      const data = await get("/search/helperaction?keyword=" + this.words);
      // console.log(data);
      this.tipsData = data.keywords;
    },

    async searchWords(e) {
      /**
       * 点击搜索框做的事（访问数据库，判断搜索的关键字是否已经存在于数据库中）
       */
      // console.log(e);
      let value = e.currentTarget.dataset.value;
      this.words = value || this.words;
      const data = await post("/search/addhistoryaction", {
        openId: this.openid,
        keyword: value || this.words
      });
      // console.log(data);
      this.getHistoryHotData();
      this.getlistData();
    },

    async getHistoryHotData(first) {
      /**
       * 获取搜索历史记录以及热门搜索记录
       */
      // console.log(this.openid);
      const data = await get("/search/indexaction?openId=" + this.openid);
      this.defaultKeyword = data.defaultKeyword;
      this.historyData = data.historyData;
      this.hotKeywordList = data.hotKeywordList;
      // console.log(data);
    },

    async getlistData() {
      /**
       * 获取商品列表
       * order用来控制desc还是asc
       */
      const data = await get("/search/helperaction", {
        keyword: this.words,
        order: this.order
      });
      this.goodsListData = data.keywords;
      // 当页面请求到数据了，就不要候选提示了
      this.tipsData = [];
      // console.log(this.goodsListData);
    },
    changeTab(index) {
      this.nowIndex = index;
      if (index === 1) {
        this.order = this.order == "asc" ? "desc" : "asc";
      } else {
        this.order = "";
      }
      this.getlistData();
    },
    goodsDetail(id) {
      uni.navigateTo({
        url: "/pages/goods/goods?id=" + id
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
