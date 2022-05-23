<template>
  <div>
    <nav-bar>
      <template v-slot:default>
        商品分类
      </template>
    </nav-bar>
    <div id="main-box">
      <div class="order-tab">
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评价排序"></van-tab>
        </van-tabs>
      </div>

      <van-sidebar class="left-menu"
                   v-model="activeKey">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item v-for="(item, index) in categories"
                             :key="item.id"
                             :title="item.name"
                             :name="item.name"
          >
            <van-sidebar-item v-for="sub in item.children"
                              :title="sub.name"
                              :key="sub.id"
                              @click="getGoods(sub.id)"
            >
            </van-sidebar-item>
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>

      <div class="goods-list">
        <div class="content">
          <van-card
              v-for="item in showGoods"
              :key="item.id"
              :num="item.comments_count"
              :tag="item.comments_count >= 0 ? '流行':'标签'"
              :price="item.price"
              :desc="item.updated_at"
              :title="item.title"
              :thumb="item.cover_url"
              :lazy-load="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/common/navbar';
import {computed, onMounted, reactive, ref, watchEffect} from "vue";
import {getCategory, getCategoryGoods} from "@/network/categoty";
import {createBScroll} from "better-scroll";
import {getHomeGoods} from "@/network/home";

export default {
  name: "Category",
  components: {
    NavBar
  },
  setup() {
    let activeKey = ref(0)
    let activeName = ref(1)
    let categories = ref([])
    let active = ref(2)

    // 当前的排序条件
    let currentOrder = ref('sales')
    // 当前的分类ID
    let currentCid = ref(0)

    // 数据模型
    const goods = reactive({
      sales: {page: 1, list: []},
      price: {page: 1, list: []},
      comments_count: {page: 1, list: []}
    })

    const showGoods = computed(() => {
      return goods[currentOrder.value].list
    })

    const init = () => {
      getCategoryGoods('sales', currentCid.value).then(res => {
        goods.sales.list = res.goods.data
      })
      getCategoryGoods('price', currentCid.value).then(res => {
        goods.price.list = res.goods.data
      })
      getCategoryGoods('comments_count', currentCid.value).then(res => {
        goods.comments_count.list = res.goods.data
      })
    }

    let bscroll = reactive({})
    onMounted(() => {
      getCategory().then(res => {
        categories.value = res.categories
      })
      getCategoryGoods('sales', currentCid.value).then(res => {
        goods.sales.list = res.goods.data
      })

      // 创建BetterScroll对象
      bscroll = new createBScroll(document.querySelector('.goods-list'), {
        probeType: 3, // 0,1,2,3, 3 只要在运动就会触发scroll事件
        click: true, // 是否允许点击
        pullUpLoad: true, // 上拉加载更多, 默认是false
      })

      // 上拉加载数据，触发pullUpLoad
      bscroll.on('pullingUp', () => {

        // 完成上拉，等数据请求完成，要将新数据展示出来
        bscroll.finishPullUp()
        // 重新计算高度
        bscroll.refresh()
      })
    })

    // 排序选项卡
    const tabClick = (index) => {
      let orders = ['sales', 'price', 'comments_count']
      currentOrder.value = orders[index]
      getCategoryGoods(currentOrder.value, currentCid.value).then(res => {
        goods[currentOrder.value].list = res.goods.data
      })
      console.log(goods.sales.list)
    }

    // 通过分类get商品
    const getGoods = (id) => {
      currentCid.value = id
      init()
    }

    return {
      activeKey,
      categories,
      activeName,
      active,
      tabClick,
      currentOrder,
      getGoods,
      currentCid,
      showGoods
    }
  }
}
</script>

<style scoped lang="scss">
#main-box {

  margin-top: 45px;
  display: flex;

  .order-tab {
    flex: 1;
    float: right;
    height: 50px;
    z-index: 9;
    position: fixed;
    top: 45px;
    right: 0;
    left: 130px;
  }

  .left-menu {
    position: fixed;
    top: 95px;
    left: 0;
    width: 130px;
  }

  .goods-list {
    flex: 1;
    height: 100vh;
    position: absolute;
    top: 100px;
    left: 130px;
    right: 0;
    padding: 10px;
    text-align: left;
  }

}

.van-card__thumb {
  width: 58px !important;
}
</style>