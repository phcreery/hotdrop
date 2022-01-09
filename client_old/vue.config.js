// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // options...
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#FFFFFF", // Global dominant color
            "link-color": "#1DA57A", // link color
            "border-radius-base": "2px", // component/floating layer fillet
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};
