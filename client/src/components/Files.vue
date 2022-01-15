<template>
  <div>
    {{ items }}
    <div v-if="isMobile">
      <div :style="{ textAlign: 'center' }">
        <!-- Files <br/> -->
        <!-- <a-list
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }"
          :data-source="items"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card :title="item.filename">
              In: {{ item.dir }}<br />
              Modified: {{ item.modifiedDateString }}<br />
              <img slot="cover" :src="item.url" />
              <template slot="actions" class="ant-card-actions">
                <a-button
                  type="primary"
                  icon="download"
                  @click="downloadFile(item.path, item.filename)"
                />
                <a-popconfirm
                  title="Sure to delete?"
                  @confirm="() => deleteFile(item.fullpath)"
                >
                  <a-button type="danger" icon="delete">
                  </a-button>
                </a-popconfirm>
              </template>
            </a-card>
          </a-list-item>
        </a-list> -->
      </div>
    </div>
    <div v-else>
      <el-table :data="items" style="width: 100%">
        <el-table-column prop="filename" label="Filename" width="450" />
        <el-table-column
          prop="modifiedDateString"
          label="Date Modified"
          width="180"
        />
        <el-table-column fixed="right" label="Actions" width="200">
          <template #default="scope">
            <el-button type="text" size="small">Star</el-button>
            <el-button
              type="text"
              size="small"
              @click="downloadFile(scope.row.path, scope.row.filename)"
              >Download</el-button
            >

            <el-popconfirm
              title="Are you sure to delete this?"
              @confirm="() => deleteFile(scope.row.fullpath)"
            >
              <template #reference>
                <el-button type="text" size="small">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from "vue";
import { ElMessage } from "element-plus";

import api from "../api.js";

export default {
  components: {},
  setup() {
    let windowWidth = ref(null);
    let items = ref([]);

    function buildlist() {
      api
        .getFileList()
        .then((res) => {
          if (res.status === 200) {
            console.log("Fetched File list:", res);
            items.value = res.data; // list of filenames
          }
        })
        .then(() => {
          var temp = items.value;
          items.value = temp.map((item) => {
            return {
              ...item,
              url: api.getFileBaseUrl().slice(0, -1) + item.path,
            };
          });
        })
        .then(() => console.log(items.value));
    }

    function deleteFile(filename) {
      console.log("Deleting...", filename);

      api.deleteFile(filename).then((res) => {
        console.log("aye!", res);
        if (res.status == 200) {
          // deleteFolderDialog = false;
          ElMessage({
            message: "Deleted",
            type: "success",
          });
          buildlist();
        } else {
          ElMessage({
            message: "Delete failed",
            type: "error",
          });
        }
      });
    }

    function downloadFile(filepath, label = "") {
      console.log("Downloading", filepath);
      api
        .downloadFile(filepath)
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = label;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    }

    window.addEventListener("resize", () => {
      windowWidth.value = window.innerWidth;
    });
    windowWidth.value = window.innerWidth;
    const currentRouteName = computed(() => route.path);
    const isMobile = computed(() => windowWidth < 950);

    onMounted(() => {
      buildlist();
    });

    return {
      items,
      windowWidth,
      buildlist,
      deleteFile,
      downloadFile,
      currentRouteName,
      isMobile,
    };
  },
};
</script>

<style scoped></style>
