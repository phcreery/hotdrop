<template>
  <div id="app">
    <a-layout id="components-layout-demo-fixed">
      <Header />
      <a-layout-content
        :style="{
          padding: '0 50px',
          marginTop: 'calc(64px + 24px)',
          minHeight: 'calc(100vh - 64px - 24px - 64px - 6px)',
        }"
      >
        <div
          :style="{ background: '#fff', padding: '24px', minHeight: '100%' }"
        >
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        App by Peyton Creery
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import Breadcrumb from './components/Shared/Breadcrumb.vue'
import Header from './components/Shared/Header.vue'

export default {
  name: 'App',
  components: {
    Breadcrumb,
    Header,
  },
}
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
body {
  margin: 0;
}
</style>
