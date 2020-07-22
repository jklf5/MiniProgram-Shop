<script>
/**
 * vuex管理登陆状态，具体可以参考官方登陆模板示例
 */
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations(["login"])
  },
  onLaunch: function() {
    uni.setStorageSync("userInfo", userInfo);
    let userInfo = uni.getStorageSync("userInfo") || "";
    console.log(userInfo);
    if (userInfo.id) {
      //更新登陆状态
      uni.getStorage({
        key: "userInfo",
        success: res => {
          this.login(res.data);
        }
      });
    }
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
// export default {
//   created() {
//     // 调用API从本地缓存中获取数据
//     /* 测试用，模拟授权数据 */
//     var userInfo = {
//       // oQmbb4sNZdxaUQZ0sfYgvtOP2S7c
//       openId: "0",
//       nickName: "蜗牛",
//       gender: 1,
//       language: "zh_CN",
//       city: "Changping",
//       province: "Beijing",
//       country: "China",
//       avatarUrl:
//         "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIbWFEIJj8IpGeHM7dGic1aTFZALjWcMm9ltWfFiaQfVRYticWBfgGfzXWMt2EkJWiaicPtftHAlWxUibxQ/132",
//       watermark: { timestamp: 1535513485, appid: "wx539888c422890be1" }
//     };
//     var openId = userInfo.openId;
//     wx.setStorageSync("userInfo", userInfo);
//     wx.setStorageSync("openId", openId);
//     /*
//      * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
//      * 微信：mpvue === wx, mpvuePlatform === 'wx'
//      * 头条：mpvue === tt, mpvuePlatform === 'tt'
//      * 百度：mpvue === swan, mpvuePlatform === 'swan'
//      * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
//      */

//     let logs;
//     if (mpvuePlatform === "my") {
//       logs = mpvue.getStorageSync({ key: "logs" }).data || [];
//       logs.unshift(Date.now());
//       mpvue.setStorageSync({
//         key: "logs",
//         data: logs
//       });
//     } else {
//       logs = mpvue.getStorageSync("logs") || [];
//       logs.unshift(Date.now());
//       mpvue.setStorageSync("logs", logs);
//     }
//   },
//   log() {
//     console.log(`log at:${Date.now()}`);
//   }
// };
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}

page {
  background: #f4f4f4;
  height: 100%;
}

button {
  background: none;
  padding: 0;
  font-weight: normal;
  font-size: 32rpx;
  box-sizing: content-box;
}

button::after {
  border: 0;
}

view,
text {
  font-size: 30rpx;
  color: #333333;
}

.wxParse .p {
  margin: 0 !important;
}

.wxParse .img {
  display: block !important;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
