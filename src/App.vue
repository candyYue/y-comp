<template>
  <div class="main">
    <SiderBar/>
    <router-view class="component-view"/>
  </div>
  
</template>
<script setup>
import SiderBar from '@/components/viewcompontents/siderbar.vue'
</script>
<style lang="scss">
@import '@/assets/styles/base/theme.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main{
  display: flex;
}
.sider-bar{
  width: $sidebar-width;
  height: 100vh;
}
.component-view {
  position: relative;
  padding: 30px;
  margin-top: 200px;
  border: 1px solid #D7DBE6;
  border-radius: 5px;
  background: #fff;
  width: 800px;
  height: 500px;
}
</style>
