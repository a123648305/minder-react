import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type nodeDataType = {
  data: {
    id: number;
    text: string;
    type: string;
    borderColor?: string;
    borderRadius?: number;
    level: number;
  };
  children?: nodeDataType[];
};

export const leveColors = [
  "rgba(101,120,155,0.2)",
  "rgba(255,136,0,0.2)",
  "rgba(114,46,209,0.2)",
  "rgba(246,60,162,0.2)",
  "rgba(22,93,255,0.2)",
  "rgba(255,51,51,0.2)",
  "rgba(241,241,244,1)",
];

export const mindCommands = [
  {
    icon: "icon-charuzijiedian",
    label: "插入子节点",
    commandkey: ["Tab"],
    minderCommand: "AppendChildNode",
  },
  {
    icon: "icon-charutongjijiedian",
    label: "插入同级节点",
    commandkey: ["Enter"],
    minderCommand: "AppendSiblingNode",
  },
  {
    icon: "icon-chexiao",
    label: "撤销",
    commandkey: ["Ctrl", "Z"],
    minderCommand: "undo",
  },
  {
    icon: "icon-zhongzuo",
    label: "重做",
    commandkey: ["Ctrl", "Shift", "Z"],
    minderCommand: "redo",
  },
  {
    icon: "icon-shanchu1",
    label: "删除节点",
    commandkey: ["Delete"],
    minderCommand: "RemoveNode",
  },
  {
    icon: "icon-jia",
    label: "画布放大",
    commandkey: ["Ctrl", "="],
    minderCommand: "ZoomIn",
  },
  {
    icon: "icon-jian",
    label: "画布缩小",
    commandkey: ["Ctrl", "-"],
    minderCommand: "ZoomOut",
  },
  {
    icon: "icon-jian",
    label: "拖动画布     ",
    commandkey: ["Space", "鼠标左键"],
    minderCommand: "Hand",
  },
];

/**
 * 获取传入使用顺序的快捷键配置信息
 * @param labes 使用的操作
 * @returns 返回  [{
    icon: "icon-charuzijiedian",
    label: "新增子节点",
    commandkey: ["Enter"],
  }]
 */

export const getUseCommands = (labes: string[]) => {
  const result: {
    icon: string;
    label: string;
    commandkey: string[];
    minderCommand: string;
  }[] = [];
  labes.forEach((str) => {
    const matchData = mindCommands.find((k) => k.label === str);
    matchData && result.push(matchData);
  });
  return result;
};

/**
 * 获取传入使用的快捷键配置信息
 * @param labes 使用的操作
 * @returns 返回  {
    icon: "icon-charuzijiedian",
    label: "新增子节点",
    commandkey: ["Enter"],
  }
 */

export const getUseCommand = (labe: string) => {
  return mindCommands.find((k) => k.label === labe) as {
    icon: string;
    label: string;
    commandkey: string[];
    minderCommand?: string;
  };
};

/**
 * 获取树的最大层级
 */
export const getLevel = (data: any[], initLevel = 1) => {
  let level = initLevel;
  data.forEach((item: any) => {
    if (item.children.length) {
      level = Math.max(getLevel(item.children, initLevel + 1), level);
    }
  });
  return level;
};

/**将后端返回的数据转成插件的数据结构 */
export const transportRevertdata = (data: any[]) => {
  const arr: nodeDataType[] = [];
  data.forEach(({ id, text, type, level, children: child }) => {
    const data: any = { id, text, type, level };
    if (type === "COMBINE") {
      // 组合标签 需要加颜色区分
      data["border-radius"] = 50;
      data["border-color"] = leveColors[level - 1];
      data["background"] = "white";
    }
    if (type === "GLOBAL") {
      // 禁止增加子节点
      data.notAppend = true;
    }

    const children = child ? transportRevertdata(child) : [];
    arr.push({ data, children });
  });
  return arr;
};

/**将插件的数据转成后端需要的数据结构 */
export const transportdata = (sdata: nodeDataType[]) => {
  const arr: any[] = [];
  sdata.forEach(({ data, children: child }) => {
    const children = child ? transportdata(child) : [];
    arr.push({ ...data, children });
  });
  return arr;
};

/**初始化新节点的数据 */
export const initNodeData = (lev: number, index?: number, tag?: boolean) => {
  const defaultNodeData = {
    text: `${lev}级标签`,
    type: "COMBINE",
    "border-radius": 50,
    "border-color": leveColors[lev - 1],
    background: "white",
  };
  return defaultNodeData;
};
/**
 * 导出表格数据
 * @param  {any[]} data   主体数据
 * @param  {string} fileName 文件名
 */
export const exportTreeExcel = (data: any[], fileName: string) => {
  const sheelArr: any[][] = [];
  let maxLev = 1;
  const transArr = (arr: any[], defaultRow = []) => {
    arr.forEach((item) => {
      let row: any = [...defaultRow, item.data.text];
      if (item.children.length) {
        row = transArr(item.children, row);
      } else {
        maxLev = Math.max(maxLev, row.length);
        sheelArr.push(row);
      }
    });
  };
  transArr(data);

  const header = new Array(maxLev)
    .fill(0)
    .map((k, index) => `${index + 1}级标签`);

  const ws = XLSX.utils.aoa_to_sheet([header, ...sheelArr]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws);
  const wbOut = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  saveAs(
    new Blob([wbOut], { type: "application/octet-stream" }),
    `${fileName}.xlsx`
  );
};

/**
 * 判断树里的数据是否有重复的文本 排除根节点
 * @param  {any} minder
 * @param  {any} reNode
 */
export const vaildTreeRepeat = (
  minder: any,
  reNode?: { text: string; nid: number }
) => {
  console.log(999);
  const existNode = new Set();
  const arr = minder.getAllNode();
  for (let i = 0; i < arr.length; i++) {
    const { text, nid } = arr[i].data;
    if (arr[i].type === "root") continue;
    if (existNode.has(text) && !reNode) {
      return true;
    }
    // 非当前创建的节点 重复
    if (reNode && reNode.nid !== nid && reNode.text === text) {
      return true;
    }
    existNode.add(text);
  }
  return false;
};

/**
 * 拖动后 更新node 信息
 * @param  {} dragNodes  拖动的节点
 * @param  {} targetNode 目标节点
 */
export const dragNodesUpdate = (dragNodes: any[], targetNode: any) => {
  const lev = targetNode.getLevel() + 1;
  console.log(85);
  const updateNodes = (nodes: any[], curLev = 0) => {
    nodes.forEach((node: any) => {
      if (node.data.type === "COMBINE") {
        // 组合标签 需要加颜色区分
        node.setData({
          "border-radius": 50,
          "border-color": leveColors[lev + curLev - 1],
          background: "white",
        });
      }
      if (node.children.length) {
        updateNodes(node.children, curLev + 1);
      }
    });
  };
  updateNodes(dragNodes);

  console.log(dragNodes, "vvv");
};
