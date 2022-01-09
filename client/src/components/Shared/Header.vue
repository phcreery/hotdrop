<template>
  <el-header
    :style="{
      position: 'fixed',
      zIndex: 1,
      width: '100%',
      textAlign: 'center',
    }"
  >
    <!-- <div class="logo" /> -->
    <el-menu
      mode="horizontal"
      :default-active="1"
      :style="{ lineHeight: '64px', marginRight: '0px' }"
    >
      <el-menu-item id="Photos" index="1" @click="goto('Photos')">
        <!-- <el-icon><Camera /></el-icon> -->
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

export default {
  components: {
    Camera,
    Picture,
    Tools,
    UploadFilled,
    FolderOpened,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    async goto(dest) {
      this.$router.push(dest);
    },
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>
