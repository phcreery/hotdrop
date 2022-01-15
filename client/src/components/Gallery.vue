<template>
  <div :style="{ textAlign: 'center' }">
    <vue-picture-swipe
      :items="items"
      :options="{
        showHideOpacity: true,
        shareButtons: [
          {
            id: 'download',
            label: 'Download image',
            url: '{{raw_image_url}}',
            download: true,
          },
        ],
        rotationOn: true,
      }"
    ></vue-picture-swipe>
  </div>
</template>

<script>
import VuePictureSwipe from '../vue-picture-swipe/src/main'
import api from '../api.js'
export default {
  components: {
    VuePictureSwipe: VuePictureSwipe,
  },
  data() {
    return {
      items: [],
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
    buildlist() {
      var images = [
        'http://localhost:8081/photos/WIN_20191126_13_56_16_Pro.jpg',
        'http://via.placeholder.com/640x480',
        'http://via.placeholder.com/900x900',
      ]

      api
        .getPhotoList()
        .then((res) => {
          if (res.status === 200) {
            console.log('Fetched Photo list:', res)
            images = res.data // list of filenames
          }
        })
        .then(() => {
          images.forEach((image) => {
            image = api.getPhotoBaseUrl().slice(0, -1) + image.path // convert to full url src names
            console.log(image)
            var img = new Image() // create image instance to get dimensions client-side

            img.onload = function () {
              var thumbWidth = 160
              // this.thumbnailify_b64(image, (thumbWidth/img.height)*img.width, thumbWidth, (thumbnail)=>{
              // })
              var thumbnail = this.thumbnailify_html5(
                img,
                (thumbWidth / img.height) * img.width,
                thumbWidth
              )
              this.items.push({
                src: image,
                thumbnail: thumbnail,
                w: img.width,
                h: img.height,
                alt: image, // optional alt attribute for thumbnail image
              })
            }.bind(this)

            img.crossOrigin = 'anonymous' // cors
            img.src = image
          })
        })

      console.log(this.items)
    },

    // https://jsfiddle.net/wunderbart/hnj5vrf0/
    thumbnailify_b64(base64Image, targetWidth, targetHeight, callback) {
      var imgThumb = new Image()
      imgThumb.crossOrigin = 'anonymous' // cors

      imgThumb.onload = function () {
        // var width = img.width
        // var height = img.height
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d', { preserveDrawingBuffer: true })

        // canvas.width = canvas.height = targetSize;
        canvas.width = targetWidth
        canvas.height = targetHeight

        ctx.drawImage(
          imgThumb,
          // 0, // width > height ? (width - height) /2 : 0,
          // 0, // height > width ? (height - width) /2 : 0,
          // width, // width > height ? height : width,
          // height, // width > height ? height : width,
          0,
          0,
          targetWidth,
          targetHeight
        )

        var newImageData = canvas.toDataURL('image/png')
        callback(newImageData)
      }
      imgThumb.src = base64Image
    },

    thumbnailify_html5(imgThumb, targetWidth, targetHeight) {
      imgThumb.crossOrigin = 'anonymous' // cors // calling this will re-call img.onload
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d', { preserveDrawingBuffer: true })

      // canvas.width = canvas.height = targetSize;
      canvas.width = targetWidth
      canvas.height = targetHeight

      ctx.drawImage(imgThumb, 0, 0, targetWidth, targetHeight)

      var newImageData = canvas.toDataURL('image/png')
      return newImageData
    },
  },
}
</script>

<style scoped></style>
