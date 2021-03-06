<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)" ref="menuList">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!-- 定义food-list-hook 让js选取到进行dom操作 -->
        <li v-for="item in goods" class="food-list food-list-hook" ref="foodList">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li  @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
import Bscroll from "better-scroll"
import shopcart from '../../components/shopcart/shopcart'

const  ERR_OK = 0;
export default {
  props:{
    seller:{
      type:Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight:[],
      scrollY:0 
    };
  },
  computed: {
    currentIndex() {
      for(let i=0; i<this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if(!height2 || this.scrollY >= height1 && this.scrollY < height2) {
          // this._followScroll(i);
          return i;
        }
      }
      return 0;
    }
  },
  created() {
    this.classMap = ['decrease','discount','special','invoice','guarantee'];

    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if(response.errno === ERR_OK) {
        this.goods = response.data;
        // console.log(this.goods);
        // 判断dom结构是否完全加载this.$nextTick(() => {})
        //用 $nextTick 來确保Dom变化后再执行一些事情
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        })
      }
    })
  },
  methods:{
    // 左侧点击选择区块
    selectMenu(index, event) {
    //自己默认派发事件时候(BScroll),_constructed被置为true,
    //但是浏览器原生并没有这个属性
      if(!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      //获取对应元素的列表
      let el = foodList[index];
      //设置滚动时间
      this.foodsScroll.scrollToElement(el, 300);
      console.log(index);
    },
    // 对左右两侧dom结构进行初始化
    // 要等dom结构完全加载结束在调用_initScroll()方法才会生效
    _initScroll() {
      // 获取到dom
      this.menuScroll = new Bscroll(this.$refs.menuWrapper, {
        click:true
      });

      this.foodsScroll = new Bscroll(this.$refs.foodsWrapper, {
        click:true,
        //作用就是实时获取y值，相当于探针的作用,实时监测滚动位置
        probeType:3
      });
      //设置监听滚动位置
      this.foodsScroll.on('scroll', (pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));
          }
        });
    },
    // 计算菜单列的总高度
    _calculateHeight() {
      // 获取每个li区间
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      //把第一个高度送入数组
      this.listHeight.push(height);
      for(let i=0; i < foodList.length; i++) {
        let item = foodList[i];
        //通过循环foodList下的dom结构，将每一个li的高度依次送入数组
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  components: {
    shopcart
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px // 等分 内容不足时缩放情况 占位
    width 80px
    background #f3f5f7
    .menu-item
      display table
      width 54px
      height 56px
      line-height 14px
      // text-align center
      padding 0 12px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
        .text
          border-none()
      .icon
        display inline-block
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        display table-cell
        width 56px
        vertical-align middle
        border-1px(rgba(7,17,27,0.2))
        font-size 12px
  .foods-wrapper
    flex 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.1))
      &.last-child
        border-none()
        margin-bottom 0px
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0 
          height 14px
          line-height 14px
          font-size 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          margin-bottom 8px
          line-height 10px
          font-size 10px
          color: rgb(147, 153, 159)
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            //添加到文本的修饰 定义穿过文本下的一条线
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
