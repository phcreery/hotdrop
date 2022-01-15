import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  optimizeDeps: {
    // from: [vite] new dependencies found: ...
    include: [
      'ant-design-vue/es',
      'ant-design-vue/es/layout/style/css',
      'ant-design-vue/es/menu/style/css',
      // "ant-design-vue/es/upload/style/css",
      'ant-design-vue/es/table/style/css',
      'ant-design-vue/es/divider/style/css',
      'ant-design-vue/es/list/style/css',
      'ant-design-vue/es/card/style/css',
      'ant-design-vue/es/popconfirm/style/css',
      'ant-design-vue/es/button/style/css',
      'ant-design-vue/es/upload/style/css',
      'ant-design-vue/es/row/style/css',
      'ant-design-vue/es/col/style/css',
      'ant-design-vue/es/tooltip/style/css',
    ],
  },
  define: {
    'process.env': {},
  },
})
