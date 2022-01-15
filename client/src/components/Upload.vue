<template>
  <div :style="{ textAlign: 'center' }">
    <el-upload
      action=""
      drag
      multiple
      :auto-upload="false"
      :file-list="fileList"
      :before-remove="handleRemove"
      :on-change="
        (file, fileList) => {
          log(['change', file, fileList]);
        }
      "
      :before-upload="beforeUpload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <el-button
      type="primary"
      :disabled="fileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ uploading ? "Uploading" : "Start Upload" }}
    </el-button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import api from "../api.js";
export default {
  components: { UploadFilled },
  setup() {
    const fileList = ref([]);
    const uploadURL = ref("");
    const uploading = ref(false);

    function beforeUpload(file) {
      fileList.value = [...fileList.value, file];
      return false;
    }
    function handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        // this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        // this.$message.error(`${info.file.name} file upload failed.`);
      }
    }
    function handleUpload() {
      // upload file
      uploading.value = true;
      const formData = new FormData();
      for (let file of this.fileList) {
        formData.append("files", file, file.name);
      }
      api.UploadFileForm(formData).then((res) => {
        console.log(res);
        if (res.status == 200) {
          uploading.value = false;
          // this.$message.success("Uploaded Successfully.");
          fileList.value = [];
        } else {
          uploading.value = false;
          // this.$message.error("Upload Failed.");
        }
      });
    }
    function handleRemove(file) {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    }

    function log(data) {
      console.log(data);
    }

    uploadURL.value = api.getUploadURL();

    return {
      fileList,
      uploadURL,
      uploading,
      beforeUpload,
      handleChange,
      handleUpload,
      handleRemove,
      log,
    };
  },

  // data() {
  //   return {
  //     fileList: [],
  //     uploadURL: "",
  //     uploading: false,
  //   };
  // },
  // mounted() {
  //   this.$nextTick(function () {
  //     // Code that will run only after the
  //     // entire view has been rendered
  //     this.uploadURL = api.getUploadURL();
  //   });
  // },
  // methods: {
  //   handleRemove(file) {
  //     const index = this.fileList.indexOf(file);
  //     const newFileList = this.fileList.slice();
  //     newFileList.splice(index, 1);
  //     this.fileList = newFileList;
  //   },
  //   beforeUpload(file) {
  //     this.fileList = [...this.fileList, file];
  //     return false;
  //   },
  //   handleChange(info) {
  //     const status = info.file.status;
  //     if (status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (status === "done") {
  //       this.$message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === "error") {
  //       this.$message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   handleUpload() {
  //     // upload file
  //     this.uploading = true;
  //     const formData = new FormData();
  //     for (let file of this.fileList) {
  //       formData.append("files", file, file.name);
  //     }
  //     api.UploadFileForm(formData).then((res) => {
  //       console.log(res);
  //       if (res.status == 200) {
  //         this.uploading = false;
  //         this.$message.success("Uploaded Successfully.");
  //         this.fileList = [];
  //       } else {
  //         this.uploading = false;
  //         this.$message.error("Upload Failed.");
  //       }
  //     });
  //   },
  //   log(data) {
  //     console.log(data);
  //   },
  // },
};
</script>

<style scoped></style>
