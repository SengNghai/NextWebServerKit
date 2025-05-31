/**
* 动态计算 `root font-size`，适配所有设备
* @param pageWidth 设计稿宽度（默认 750）
* @param baseSize 设计稿的 `1rem`（默认 100）
*/
export const setRemBase = (pageWidth = 750, baseSize = 100) => {

    const updateFontSize = () => {
      const html = document.documentElement;
      let fontSize = (baseSize * html.clientWidth) / pageWidth;
      html.style.fontSize = `${fontSize}px`;
  
      // ✅ 修复 WebKit 字体缩放问题
      const computedFontSize = parseFloat(getComputedStyle(html).fontSize);
      if (fontSize !== computedFontSize) {
        fontSize = (fontSize * fontSize) / computedFontSize;
        html.style.fontSize = `${fontSize}px`;
      }
    };
  
    updateFontSize(); // ✅ 页面加载时立即计算字体大小
  
    window.addEventListener("resize", () => {
      requestAnimationFrame(updateFontSize); // ✅ 替代 `setTimeout`，确保无延迟优化
    });
  };