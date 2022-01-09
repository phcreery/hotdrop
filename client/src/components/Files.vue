<template>
  <div>
    {{ items }}
    <div v-if="ismobile">
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
          <template #default>
            <el-button type="text" size="small">Star</el-button>
            <el-button
              type="text"
              size="small"
              @click="downloadFile(text.path, text.filename)"
              >Download</el-button
            >

            <el-popconfirm
              title="Are you sure to delete this?"
              @confirm="() => deleteFile(text.fullpath)"
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
import api from "../api.js";
export default {
  components: {},
  data() {
    return {
      windowWidth: null,
      items: [],
    };
  },
  created() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
    this.windowWidth = window.innerWidth;
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
      api
        .getFileList()
        .then((res) => {
          if (res.status === 200) {
            console.log("Fetched File list:", res);
            this.items = res.data; // list of filenames
          }
        })
        .then(() => {
          var temp = this.items;
          this.items = temp.map((item) => {
            return {
              ...item,
              url: api.getFileBaseUrl().slice(0, -1) + item.path,
            };
          });
          // console.log(this.items)
        })
        .then(() => console.log(this.items));
    },
    deleteFile(filename) {
      console.log("Deleting...", filename);

      api.deleteFile(filename).then(
        function (res) {
          console.log("aye!", res.data);
          if (res.data === "success") {
            this.deleteFolderDialog = false;
            this.$message.success("Deleted");
            this.buildlist();
          } else {
            this.$message.erro("Delete Failed");
          }
        }.bind(this)
      );
    },

    downloadFile(filepath, label = "") {
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
    },
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    ismobile() {
      return this.windowWidth < 950;
    },
  },
};
</script>

<style scoped></style>
