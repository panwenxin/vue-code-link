// 引入fs模块
var fs = require("fs");
const pathUtil = require("../utils/pathUtil.js");

module.exports = function (source) {
  const { resourcePath } = this;
  return sourceCodeChange(source, resourcePath);
};

function sourceCodeChange(source, resourcePath) {
  resourcePath = resourcePath.substring(pathUtil.projectBasePath.length); // vue代码相对路径
  return codeLineTrack(source, resourcePath);
}

function codeLineTrack(str, resourcePath) {
  let lineList = str.split("\n");
  let newList = [];
  lineList.forEach((item, index) => {
    newList.push(addLineAttr(item, index + 1, resourcePath)); // 添加位置属性，index+1为具体的代码行号
  });
  return newList.join("\n");
}

function addLineAttr(lineStr, line, resourcePath) {
  if(!/^\s+</.test(lineStr)){
    return lineStr;
  }
  let reg = /(<[\w-]+)|(<\/template)/g;
  let leftTagList = lineStr.match(reg);
  if (leftTagList) {
    leftTagList = Array.from(new Set(leftTagList));
    leftTagList.forEach((item) => {
      if (item && item.indexOf("template") == -1) {
        const reg = new RegExp(`${item}`);
        let location = `${item} code-location="${resourcePath}:${line}"`;
        lineStr = lineStr.replace(reg, location);
      }
    });
  }
  return lineStr;
}
