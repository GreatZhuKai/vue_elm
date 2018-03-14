<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import header from './components/header/header'
const ERR_OK = 0;

export default {
  data() {
    return {
      seller: {}
    };
  },
  //请求数据
  created() {
    // get/someUrl
    this.$http.get('/api/seller').then((response) => {
      // get body data
      this.response = response.body;
      console.log(response);
      if(response.errno === ERR_OK) {
        this.seller = response.data;
        console.log(this.seller);
      }
    }, response => {
      // error callback
    })
  },
  // 注册标签
  components: {
    'v-header':header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  .tab 
    display flex
    width 100%
    height 40px
    line-height 40px
    // border-bottom 1px solid rgba(7,17,27,0.1) // 1像素边框
    border-1px(rgba(7,17,27,0.1))  // 全局设置好border-1px

    .tab-item
      flex 1
      text-align center

      & > a
        display block
        font-style 14px
        color rgb(77,85,93)
        // 点击高亮  v-link-active
        &.active
          color rgb(240,20,20)
          
</style>
