<template>
  <div class="back-top"
       @click="backTop"
  ></div>
</template>

<script>
export default {
  name: "BackTop",
  setup(props, {emit}) {
    const backTop = () => {
      emit('bTop')
    }
    return {
      backTop
    }
  }
}
</script>

<style scoped>
.back-top {
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 80px;
  right: 30px;
  z-index: 20;
  box-shadow: 5px 5px 5px #888888;
  border-radius: 50%;
  background: #fcfcfc url("~asset/images/up.png") no-repeat center center;
}
</style>