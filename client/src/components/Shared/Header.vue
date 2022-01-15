<template>
  <el-header
    :style="{
      position: 'fixed',
      zIndex: 1,
      width: '100%',
      textAlign: 'center',
    }"
  >
    <el-menu
      mode="horizontal"
      default-active="1"
      :style="{ lineHeight: '64px', marginRight: '0px' }"
    >
      <el-menu-item id="Photos" index="1" @click="goto('Photos')">
        <el-icon><Picture /></el-icon>
        Pictures
      </el-menu-item>
      <el-menu-item id="Files" index="2" @click="goto('Files')">
        <el-icon><folder-opened /></el-icon>
        Files
      </el-menu-item>
      <el-menu-item id="Upload" index="3" @click="goto('Upload')">
        <el-icon><upload-filled /></el-icon>
        Upload
      </el-menu-item>
      <el-menu-item id="Photos" index="4" @click="goto('Settings')">
        <el-icon><Tools /></el-icon>
        Settings
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
import {
  Camera,
  Picture,
  Tools,
  UploadFilled,
  FolderOpened,
} from "@element-plus/icons-vue";

import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from "vue";
import router from "../../router";
import { useRoute } from "vue-router";

export default {
  components: {
    Camera,
    Picture,
    Tools,
    UploadFilled,
    FolderOpened,
  },
  setup() {
    let route = useRoute();

    function goto(dest) {
      router.push(dest);
    }

    const currentRouteName = computed(() => route.path);

    return { goto, currentRouteName };
  },
};
</script>
<style scoped>
.el-header {
  padding: 0;
}
</style>
