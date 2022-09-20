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
      level = getLevel(item.children, level + 1);
    }
  });
  return level;
};

export const transportdata = (data: any[]) => {
  const arr: nodeDataType[] = [];
  data.forEach(({ id, text, type, level, children: child }) => {
    const data: any = { id, text, type, level };
    if (type === "COMBINE") {
      // 组合标签 需要加颜色区分
      data["border-radius"] = 50;
      data["border-color"] = leveColors[level - 1];
      data["background"] = "white";
    }

    const children = child ? transportdata(child) : [];
    arr.push({ data, children });
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
