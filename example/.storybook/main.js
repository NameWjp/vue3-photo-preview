module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config) => {
    // 不使用 link 的真实路径，解决 corejs 报错问题
    config.resolve.symlinks = false;
    // webpack 默认忽略 node_modules 中的改动，这里配置成忽略除了 vue3-photo-preview 外的改动
    config.watchOptions.ignored = /node_modules\/(?!vue3-photo-preview).+/;
    // 添加 scss 支持
    config.module.rules.push({
      test: /\.s[ac]ss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        'sass-loader',
      ],
    })
    return config;
  },
}
