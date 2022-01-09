<template>
  <el-breadcrumb>
    <!-- <a-breadcrumb-item>{{currentRouteName}}</a-breadcrumb-item> -->
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>
