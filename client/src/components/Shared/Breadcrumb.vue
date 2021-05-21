<template>
  <a-breadcrumb :style="{ margin: '40px 0' }">
    <!-- <a-breadcrumb-item>{{currentRouteName}}</a-breadcrumb-item> -->
  </a-breadcrumb>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>
