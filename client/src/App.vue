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
      <!-- <el-footer :style="{ textAlign: 'center' }">
        Created by Peyton Creery
      </el-footer> -->
    </el-container>
  </div>
</template>

<script>
import Breadcrumb from "./components/Shared/Breadcrumb.vue";
import Header from "./components/Shared/Header.vue";

export default {
  name: "App",
  components: {
    Breadcrumb,
    Header,
  },
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
body {
  margin: 0;
}
</style>
