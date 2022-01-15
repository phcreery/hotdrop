<template>
  <div :style="{ textAlign: 'center' }">
    <el-upload
      action=""
      drag
      multiple
      :auto-upload="false"
      :file-list="fileList.value"
      :on-change="handleChange"
      :on-remove="onRemove"
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
import { ElMessage } from "element-plus";

import api from "../api.js";
export default {
  components: { UploadFilled },
  setup() {
    const fileList = ref([]);
    const uploadURL = ref("");
    const uploading = ref(false);

    function handleChange(file, newFileList) {
      // console.log("change", file, newFileList);
      fileList.value = newFileList;
    }
    function onRemove(file, newFileList) {
      // console.log("onRemove", file, newFileList);
      fileList.value = newFileList;
    }
    function handleUpload() {
      // console.log("handle upload", fileList.value);
      uploading.value = true;
      const formData = new FormData();
      for (let file of fileList.value) {
        formData.append("files", file.raw, file.name);
      }
      api.UploadFileForm(formData).then((res) => {
        console.log(res);
        if (res.status == 200) {
          uploading.value = false;
          ElMessage({
            message: "Uploaded Successfully.",
            type: "success",
          });
          fileList.value = [];
        } else {
          uploading.value = false;
          ElMessage({
            message: "Upload Failed.",
            type: "error",
          });
        }
      });
    }

    uploadURL.value = api.getUploadURL();

    return {
      fileList,
      uploadURL,
      uploading,
      handleChange,
      handleUpload,
      onRemove,
    };
  },
};
</script>

<style scoped></style>
