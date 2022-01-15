<template>
  <div>
    <div v-if="isMobile">
      <div :style="{ textAlign: 'center' }">
        <!-- {{this.items}} -->
        <a-list :data-source="items">
          <template #renderItem="{ item }">
            <a-list-item>
              <!-- {{ item.filename }}{{ item.modifiedDate }} {{ index }} -->
              <a-card :title="truncate(item.filename, 20, '...')">
                In: {{ item.dir }}<br />
                Modified: {{ item.modifiedDateString }}<br />
                <template #cover>
                  <img :src="item.url" />
                </template>
                <template #actions class="ant-card-actions">
                  <a-button
                    type="primary"
                    @click="downloadFile(item.path, item.filename)"
                    ><template #icon><DownloadOutlined /></template
                  ></a-button>
                  <a-popconfirm
                    title="Sure to delete?"
                    @confirm="() => deleteFile(item.fullpath)"
                  >
                    <a-button danger>
                      <template #icon><DeleteOutlined /></template>
                    </a-button>
                  </a-popconfirm>
                </template>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </div>
    <div v-else>
      <a-table :columns="columns" :data-source="items">
        <template #action="{ record }">
          <span>
            <a-button
              type="primary"
              @click="downloadFile(record.path, record.filename)"
              ><template #icon><DownloadOutlined /></template
            ></a-button>
            <a-divider type="vertical" />
            <a-popconfirm
              title="Sure to delete?"
              @confirm="() => deleteFile(record.fullpath)"
            >
              <a-button danger>
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from "vue";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import api from "../api.js";

export default {
  components: { DownloadOutlined, DeleteOutlined },
  setup() {
    let windowWidth = ref(null);
    let items = ref([]);
    const columns = [
      {
        title: "FileName",
        dataIndex: "path",
        key: "filename",
      },
      {
        title: "Modified",
        dataIndex: "modifiedDateString",
        key: "modifiedDateString",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];

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
          items.value = temp.map((item, index) => {
            return {
              ...item,
              url: api.getFileBaseUrl().slice(0, -1) + item.path,
              key: index,
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
          message.success("Deleted Successfully.");
          buildlist();
        } else {
          message.error("Delete Failed.");
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
    function truncate(text, length, suffix) {
      if (!text) return;
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    }

    window.addEventListener("resize", () => {
      windowWidth.value = window.innerWidth;
    });
    windowWidth.value = window.innerWidth;
    const currentRouteName = computed(() => route.path);
    const isMobile = computed(() => windowWidth.value < 950);

    onMounted(() => {
      buildlist();
    });

    return {
      items,
      columns,
      windowWidth,
      buildlist,
      deleteFile,
      downloadFile,
      truncate,
      currentRouteName,
      isMobile,
    };
  },
};
</script>

<style scoped></style>
