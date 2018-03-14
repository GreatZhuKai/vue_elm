import Vue from 'vue';
import Router from 'vue-router';
import goods from '../components/goods/goods.vue';
import ratings from '../components/ratings/ratings.vue';
import seller from '../components/seller/seller.vue';

Vue.use(Router);

// 方法一：直接定义路由组件
// const goods = { template:'<div>goods</div>' }
// const ratings = { template:'<div>ratings</div>' }
// const seller = { template:'<div>seller</div>' }

//方法二：
// 定义路由
const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

// 创建路由实例
export default new Router({
    linkActiveClass: 'active',
    routes
});
