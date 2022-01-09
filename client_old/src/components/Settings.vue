<template>
  <div>
    <h1>Settings</h1><br/>
    <!-- {{this.items}} -->
    <a-row>
      <a-col :span="24">
        <a-tooltip>
          <template slot="title">
            {{this.items.dir.files}}
          </template>
        Files Directory: {{this.items.dir.files  | truncate(20, '...') }}<br/>
        </a-tooltip>
        Free Space: {{this.items.freespace | BtoGB}} GB (out of {{this.items.disksize | BtoGB}} GB)<br/>
        Supported Images: {{this.items.dir.supportedPhotoFormats}}<br/>
        Battery Percent: {{this.items.battery}}<br/>
      </a-col>
    </a-row>

  </div>
</template>  

<script>
import api from '../api.js'
export default {
  components: {
  },
  data () {
    return {
      items: {dir:{files:null}}
    }
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.buildlist()
    })
  },
  methods: {
    buildlist () {
      api.getConfig().then((res) => {
        if (res.status === 200){
          console.log('Fetched File list:', res)
          this.items = res.data // list of filenames
        }
      })
      console.log(this.items)
    },
  },
  filters: {
    BtoGB(value){
      return Math.round((value/1073741824) * 100)/100
    },
    truncate: function (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
  }
}  
</script>

<style scoped>
</style>
