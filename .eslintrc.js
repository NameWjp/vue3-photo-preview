module.exports = {
  parser: 'vue-eslint-parser', // 解析 .vue 文件
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser' // 解析 .ts 文件
  },
  env:{
    browser: true,
    node: true,
  },
  rules: {
    semi: 2
  }
};
