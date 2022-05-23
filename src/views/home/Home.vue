<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>
        商品首页
      </template>
    </nav-bar>

    <tab-control v-show="isTabFixed" @tabClick="tabClick" :title="['畅销','新书','精选']"></tab-control>

    <div class="wrapper">
      <div class="content">
        <div ref="bannerRef">
          <home-swiper :banners="banners"></home-swiper>

          <recommend-view :recommends="recommends"></recommend-view>
        </div>

        <tab-control @tabClick="tabClick" :title="['畅销','新书','精选']"></tab-control>

        <goods-list :goods="showGoods"></goods-list>
      </div>
    </div>

    <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar";
import RecommendView from "@/views/home/ChildComps/recommendView";
import {getHomeAllData, getHomeGoods} from "@/network/home";
import {ref, reactive, onMounted, computed, watchEffect, nextTick} from "vue";
import TabControl from "@/components/content/tabcontrol";
import GoodsList from "@/components/content/goods/goodslist";
import {createBScroll} from "better-scroll";
import BackTop from "@/components/common/backtop";
import HomeSwiper from "@/views/home/ChildComps/homeswiper";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    BackTop,
    GoodsList,
    TabControl,
    RecommendView,
    NavBar
  },
  setup() {
    const banners = ref([])
    onMounted(() => {
      getHomeAllData().then(res => {
        recommends.value = res.goods.data
        banners.value = res.slides;
      })
      getHomeGoods('sales').then(res => {
        goods.sales.list = res.goods.data
      })
      getHomeGoods('recommend').then(res => {
        goods.recommends.list = res.goods.data
      })
      getHomeGoods('new').then(res => {
        goods.new.list = res.goods.data
      })

      // 创建BetterScroll对象
      bscroll = new createBScroll(document.querySelector('.wrapper'), {
        probeType: 3, // 0,1,2,3, 3 只要在就会触发scroll事件
        click: true, // 是否允许点击
        pullUpLoad: true, // 上拉加载更多, 默认是false
      })

      // 触发滚动事件
      bscroll.on('scroll', (position) => {
        // console.log(position.y);
        isShowBackTop.value = isTabFixed.value = (-position.y) > bannerRef.value.offsetHeight
      })

      // 上拉加载数据，触发pullUpLoad
      bscroll.on('pullingUp', () => {
        const page = goods[currentType.value].page + 1;
        getHomeGoods(currentType.value, page).then(res => {
          goods[currentType.value].list.push(...res.goods.data)
          goods[currentType.value].page += 1
        })
        // 完成上拉，等数据请求完成，要将新数据展示出来
        bscroll.finishPullUp()
        // 重新计算高度
        bscroll.refresh()
      })
    })
    /*watchEffect(()=>{
      nextTick(()=>{
        // 重新计算高度
        setTimeout(()=>{
          bscroll && bscroll.refresh()
        },1000)
      })
    })*/
    let isTabFixed = ref(false)

    let bannerRef = ref(null)

    let isShowBackTop = ref(false)

    let bscroll = reactive({})

    const recommends = ref([])
    // 商品列表数据的模型
    const goods = reactive({
      sales: {
        page: 0,
        list: []
      },
      recommends: {
        page: 0,
        list: []
      },
      new: {
        page: 0,
        list: []
      }
    })
    let currentType = ref('sales')
    const showGoods = computed(() => {
      return goods[currentType.value].list
    })
    const tabClick = (index) => {
      let types = ['sales', 'new', 'recommends']
      currentType.value = types[index]
      nextTick(() => {
        bscroll && bscroll.refresh()
      })
    }

    const bTop = () => {
      bscroll.scrollTo(0, 0, 500)
    }

    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      isTabFixed,
      bannerRef,
      isShowBackTop,
      bTop,
      banners
    }
  }
}
</script>

<style scoped>
.banners img {
  width: 100%;
  height: auto;
}

#home {
  height: 100vh;
  position: relative;
}

.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}

.content {

}
</style>