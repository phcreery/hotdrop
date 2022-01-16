<template>
  <a-layout-header
    :style="{
      position: 'fixed',
      zIndex: 1,
      width: '100%',
      textAlign: 'center',
    }"
  >
    <!-- <div class="logo" /> -->
    <a-menu
      theme="dark"
      mode="horizontal"
      :selectedKeys="[currentRouteName]"
      :style="{ lineHeight: '64px', marginRight: '0px' }"
    >
      <a-menu-item id="Photos" index="1" @click="goto('Photos')">
        <!-- <setting-outlined /> -->
        <file-image-outlined />
        <!-- Pictures -->
      </a-menu-item>
      <a-menu-item id="Files" index="2" @click="goto('Files')">
        <!-- <setting-outlined /> -->
        <container-outlined />
        <!-- Files -->
      </a-menu-item>
      <a-menu-item id="Upload" index="3" @click="goto('Upload')">
        <!-- <setting-outlined /> -->
        <cloud-upload-outlined />
        <!-- Upload -->
      </a-menu-item>
      <a-menu-item id="Photos" index="4" @click="goto('Settings')">
        <setting-outlined />
        <!-- <Icon type="setting-outlined" :style="{ marginRight: '0px' }" /> -->
        <!-- Settings -->
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import router from '../../router'
import { useRoute } from 'vue-router'
import { Button } from 'ant-design-vue'
import {
  SettingOutlined,
  FileImageOutlined,
  ContainerOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons-vue'

export default {
  components: {
    SettingOutlined,
    FileImageOutlined,
    ContainerOutlined,
    CloudUploadOutlined,
  },
  setup() {
    let route = useRoute()

    function goto(dest) {
      router.push(dest)
    }

    const currentRouteName = computed(() => route.path)

    return { goto, currentRouteName }
  },
}
</script>
<style scoped>
.el-header {
  padding: 0;
}
.ant-menu {
  justify-content: center;
}
</style>
