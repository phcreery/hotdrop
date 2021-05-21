<template>
  <div>
    <vue-picture-swipe ></vue-picture-swipe>
  </div>
</template>  

<script>
import VuePictureSwipe from 'vue-picture-swipe';
export default {
  components: {
    'VuePictureSwipe': VuePictureSwipe,
  },
  data () {
    return {
   
    }
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      api.getPageList().then((res) => {
        console.log('Fetched Photo list:', res)
        list = res.data.map((page) => {
      }
    })
  },
  methods: {

  }
}  
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
