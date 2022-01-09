<template>
  <div>
    <h1>Settings</h1>
    <br />
    <el-row>
      <el-col :span="24">
        <el-tooltip :content="this.items.dir.files">
          Files Directory: {{ truncate(this.items.dir.files, 20, "...") }}
        </el-tooltip>
        <br />
        Free Space: {{ BtoGB(this.items.freespace) }} GB (out of
        {{ BtoGB(this.items.disksize) }} GB)<br />
        Supported Images: {{ this.items.dir.supportedPhotoFormats }}<br />
        Battery Percent: {{ this.items.battery }}<br />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "../api.js";
export default {
  components: {},
  data() {
    return {
      items: { dir: { files: null } },
    };
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.buildlist();
    });
  },
  methods: {
    buildlist() {
      api.getConfig().then((res) => {
        if (res.status === 200) {
          console.log("Fetched File list:", res);
          this.items = res.data; // list of filenames
        }
      });
      console.log(this.items);
    },
    truncate(text, length, suffix) {
      if (!text) return;
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
    BtoGB(value) {
      return Math.round((value / 1073741824) * 100) / 100;
    },
  },
};
</script>

<style scoped></style>
