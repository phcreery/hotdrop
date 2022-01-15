<template>
  <div :style="{ textAlign: 'center' }">
    <a-upload-dragger
      :file-list="fileList"
      :before-upload="() => false"
      :multiple="true"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <!-- <a-icon type="inbox" /> -->
        <InboxOutlined />
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </a-upload-dragger>
    <a-button
      type="primary"
      :disabled="fileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ uploading ? "Uploading" : "Start Upload" }}
    </a-button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import api from "../api.js";
export default {
  components: { InboxOutlined },
  setup() {
    const fileList = ref([]);
    const uploadURL = ref("");
    const uploading = ref(false);

    function handleChange(event) {
      console.log("change", event, event.file, event.fileList);
      fileList.value = event.fileList;
      // fileList.value = JSON.parse(JSON.stringify(newFileList));
    }
    // function onRemove(file, newFileList) {
    //   // console.log("onRemove", file, newFileList);
    //   fileList.value = newFileList;
    // }
    function handleRemove(file) {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    }
    function beforeUpload(file) {
      fileList.value = [...fileList.value, file];
    }
    function handleUpload() {
      console.log("handle upload", fileList.value);
      uploading.value = true;
      const formData = new FormData();
      for (let file of fileList.value) {
        formData.append("files", file.originFileObj, file.name);
      }
      api.UploadFileForm(formData).then((res) => {
        console.log(res);
        if (res.status == 200) {
          uploading.value = false;
          message.success("Uploaded Successfully.");
          fileList.value = [];
        } else {
          uploading.value = false;
          message.error("Upload Failed.");
        }
      });
    }

    uploadURL.value = api.getUploadURL();

    return {
      fileList,
      uploadURL,
      uploading,
      handleChange,
      beforeUpload,
      handleUpload,
      handleRemove,
    };
  },
};
</script>

<style scoped></style>
