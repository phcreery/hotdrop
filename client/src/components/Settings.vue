<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-tooltip :content="items.dir.files">
          Files Directory: {{ truncate(items.dir.files, 20, "...") }}
        </el-tooltip>
        <br />
        Free Space: {{ BtoGB(items.freespace) }} GB (out of
        {{ BtoGB(items.disksize) }} GB)<br />
        Supported Images: {{ items.dir.supportedPhotoFormats }}<br />
        Battery Percent: {{ items.battery }}<br />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from "vue";
import api from "../api.js";
export default {
  components: {},
  setup() {
    let items = ref({ dir: { files: null } });

    function buildlist() {
      api.getConfig().then((res) => {
        if (res.status === 200) {
          console.log("Fetched File list:", res);
          items.value = res.data; // list of filenames
        }
      });
      console.log(items.value);
    }

    function truncate(text, length, suffix) {
      if (!text) return;
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    }
    function BtoGB(value) {
      return Math.round((value / 1073741824) * 100) / 100;
    }

    onMounted(() => {
      buildlist();
    });

    return { items, truncate, BtoGB };
  },
};
</script>

<style scoped></style>
