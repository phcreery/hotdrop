<template>
  <div :style="{ textAlign: 'center' }">
    <a-upload-dragger
      name="file"
      :multiple="true"
      :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </a-upload-dragger>
    <a-button
      type="primary"
      :disabled="fileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ uploading ? 'Uploading' : 'Start Upload' }}
    </a-button>
  </div>
</template>  

<script>
import api from '../api.js'
export default {
  components: {
  },
  data () {
    return {
      fileList: [],
      uploadURL: '',
      uploading: false,
    }
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.uploadURL = api.getUploadURL()
    })
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
     handleChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    handleUpload() {
      // upload file
      this.uploading = true;
      const formData = new FormData()
      for (let file of this.fileList) {
          formData.append('files', file, file.name)
        }
      api.UploadFileForm(formData).then((res)=>{
        console.log(res)
        if (res.status == 200){
          this.uploading = false;
          this.$message.success('Uploaded Successfully.');
          this.fileList = []
        } else {
          this.uploading = false;
          this.$message.error('Upload Failed.');
        }
      })
    }  
  }
}  
</script>

<style scoped>
</style>
