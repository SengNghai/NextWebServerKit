const config = {
  plugins: [
    "@tailwindcss/postcss",
    [
      "postcss-plugin-px2rem",
      {
        rootValue: 100, // 根字体大小 (可根据设计稿调整)
        unitPrecision: 5, // 保留 `rem` 小数位数
        propList: ["*"], // 所有属性都转换 `px → rem`
        exclude: /node_modules/, // 排除 `node_modules`
      },
    ]
  ],
};

export default config;
