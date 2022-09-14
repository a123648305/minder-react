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
    minderCommand: "",
  },
  {
    icon: "icon-zhongzuo",
    label: "重做",
    commandkey: ["Ctrl", "Shift", "Z"],
    minderCommand: "",
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
