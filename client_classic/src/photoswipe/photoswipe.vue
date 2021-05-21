<template>
  <div>
    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

      <!-- Background of PhotoSwipe. 
        It's a separate element as animating opacity is faster than rgba(). -->
        <div class="pswp__bg"></div>

      <!-- Slides wrapper with overflow:hidden. -->
        <div class="pswp__scroll-wrap">

        <!-- Container that holds slides. 
          PhotoSwipe keeps only 3 of them in the DOM to save memory.
          Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">

          <div class="pswp__top-bar">

            <!--  Controls are self-explanatory. Order can be changed. -->
            
            <div class="pswp__counter"></div>

            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

            <button class="pswp__button pswp__button--share" title="Share"></button>

            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

            <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
            <!-- element will get class pswp__preloader--active when preloader is running -->
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>

              <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div> 
              </div>

          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
          </button>
          
          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
          </button>

          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>

          </div>

      </div>

    </div>
  </div>
</template>

<script>
import events from './events.js'
// import 'photoswipe'
import PhotoSwipeFn from 'photoswipe'
// import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default.js'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

export default {
  name: 'HelloWorld',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    items: {
      handler: function () { // function (val, oldVal)
        if (this.pswp && this.isOpen) {
          /* this.pswp.items.length = 0
          val.forEach((item) => {
            this.pswp.items.push(item)
          }) */
          // this.pswp.items = this.items = val（指向同一个对象）
          // 所以当props items更新后 this.pswp.items随之自动更新
          this.pswp.invalidateCurrItems()
          this.pswp.updateSize(true)
        }
      },
      deep: true
    },
    isOpen (val) { // isOpen (val, oldVal)
      if (val) {
        this.openPhotoSwipe(this.items, this.options)
      } else {
        this.close()
      }
    }
  },
  methods: {
    openPhotoSwipe (items, options) {
      let pswpElement = this.$el
      this.pswp = new PhotoSwipeFn(pswpElement, PhotoSwipeUIDefault, items, options)
      events.forEach(e => {
        this.pswp.listen(e, (...args) => {
          args.unshift(this)
          this.$emit(e, [...args])
        })
      })
      this.pswp.init()
    },
    close () {
      if (this.pswp) {
        this.pswp.close()
      }
    }
  },
  mounted () {
    if (this.isOpen) {
      this.openPhotoSwipe(this.items, this.options)
    }
  },
  beforeDestroy () {
    this.close()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src='../../node_modules/photoswipe/dist/photoswipe.css'>
  /* @import './photoswipe/dist/photoswipe.css'; */
</style>
