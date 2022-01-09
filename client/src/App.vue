<template>
  <div id="app">
    <el-container id="components-layout-demo-fixed">
      <Header />
      <el-main
        :style="{
          padding: '0 50px',
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px - 64px - 5px)',
        }"
      >
        <Breadcrumb />
        <div
          :style="{ background: '#fff', padding: '24px', minHeight: '100%' }"
        >
          <router-view />
        </div>
      </el-main>
      <el-footer :style="{ textAlign: 'center' }">
        Ant Design ©2018 Created by Ant UED
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// import Gallery from './components/Gallery.vue'
import Breadcrumb from "./components/Shared/Breadcrumb.vue";
import Header from "./components/Shared/Header.vue";

export default {
  name: "App",
  components: {
    // Gallery,
    Breadcrumb,
    Header,
  },
  mounted() {},
};
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
  height: 100vh;
}
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
</style>
