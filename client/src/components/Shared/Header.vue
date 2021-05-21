<template>
  <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%', textAlign: 'center' }">
    <!-- <div class="logo" /> -->
    <a-menu
      theme="dark"
      mode="horizontal"
      :selectedKeys="[currentRouteName]"
      :style="{ lineHeight: '64px', marginRight: '0px' }"
    >
      <a-menu-item v-for="(page) in pages" v-bind:id="page.to" v-bind:key="page.to" @click="goto(page.to)">
        <a-icon :type="page.icon" :style="{ marginRight: '0px' }" />
      </a-menu-item>

    </a-menu>
  </a-layout-header>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        {
          name: "Pictures",
          icon: "camera",
          to: "Photos",
        },
        {
          name: "Files",
          icon: "inbox",
          to: "Files",
        },
        {
          name: "Upload",
          icon: "upload",
          to: "Upload",
        },
        {
          name: "Settings",
          icon: "setting",
          to: "Settings",
        },
      ]
    }
  },
  created () {
  },
  methods: {
    async goto (dest) {
      this.$router.push(dest)
    },
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>
