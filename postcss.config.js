// 响应式postcss-px-to-viewport 是一款 PostCSS 插件，用于将 px 单位转化为 vw/vh 单位。
export default {
    plugins: {
      'postcss-px-to-viewport': {
        viewportWidth: 375,//试图
      },
    },
  };