export const getAlltags = () => {
  const data = {
    code: 20000,
    msg: "操作成功",
    result: [
      {
        id: 4,
        isEnabled: true,
        text: "标签4444",
      },
      {
        id: 5,
        isEnabled: true,
        text: "标签2",
      },
      {
        id: 8,
        isEnabled: true,
        text: "测试",
      },
      {
        id: 10,
        isEnabled: true,
        text: "标签1",
      },
      {
        id: 11,
        isEnabled: true,
        text: "标签2",
      },
      {
        id: 12,
        isEnabled: true,
        text: "标签3",
      },
      {
        id: 13,
        isEnabled: true,
        text: "标签4",
      },
      {
        id: 14,
        isEnabled: true,
        text: "标签5",
      },
      {
        id: 15,
        isEnabled: true,
        text: "标签6",
      },
      {
        id: 16,
        isEnabled: true,
        text: "标签7",
      },
      {
        id: 17,
        isEnabled: true,
        text: "标签8",
      },
      {
        id: 18,
        isEnabled: true,
        text: "标签9",
      },
      {
        id: 19,
        isEnabled: true,
        text: "标签10",
      },
      {
        id: 20,
        isEnabled: true,
        text: "测试1",
      },
      {
        id: 21,
        isEnabled: true,
        text: "测试12",
      },
      {
        id: 22,
        isEnabled: true,
        text: "222",
      },
      {
        id: 33,
        isEnabled: true,
        text: "自定义标签k2",
      },
      {
        id: 34,
        isEnabled: true,
        text: "hhhhh",
      },
    ],
  };
  // return Promise.resolve(setTimeout(() => data, 500));
  return Promise.resolve({ data });
};

export const getTreeData = () => {
  const data = {
    code: 20000,
    msg: "操作成功",
    result: {
      businessTag: {
        id: 13,
        name: "标签树1",
        businessTagLevel: 3,
        projectId: "fa5cf22f6a154d66993611e7974a7c19",
        blocks: [
          {
            id: 1,
            moduleName: "产品洞察",
            moduleCode: "ANALYZE_INSIGHT",
          },
          {
            id: 2,
            moduleName: "服务洞察",
            moduleCode: "WAITER_INSIGHT",
          },
        ],
        creatorId: "4149d7ba173a47eb90f0d0689109c5e6",
        updatedAt: "2022-09-13 15:43:19",
      },
      treeData: [
        {
          id: 10,
          text: "标签1",
          nlpName: "标签1",
          ytName: "标签1",
          leftNumber: 1,
          rightNumber: 2,
          type: "GLOBAL",
          level: 1,
          branchNum: 1,
          children: null,
          updatedAt: "2022-09-13 15:43:19",
        },
        {
          id: 13,
          text: "合成标签1",
          leftNumber: 1,
          rightNumber: 6,
          type: "COMBINE",
          level: 1,
          branchNum: 2,
          children: [
            {
              id: 11,
              text: "标签2",
              nlpName: "标签2",
              ytName: "标签2",
              leftNumber: 2,
              rightNumber: 3,
              type: "GLOBAL",
              level: 2,
              branchNum: 2,
              children: null,
              updatedAt: "2022-09-13 15:43:19",
            },
            {
              id: 12,
              text: "标签3",
              nlpName: "标签3",
              ytName: "标签3",
              leftNumber: 4,
              rightNumber: 5,
              type: "GLOBAL",
              level: 2,
              branchNum: 2,
              children: null,
              updatedAt: "2022-09-13 15:43:19",
            },
          ],
          updatedAt: "2022-09-13 15:43:19",
        },
        {
          id: 18,
          text: "合成标签2",
          leftNumber: 1,
          rightNumber: 10,
          type: "COMBINE",
          level: 1,
          branchNum: 3,
          children: [
            {
              id: 14,
              text: "标签4",
              nlpName: "标签4",
              ytName: "标签4",
              leftNumber: 2,
              rightNumber: 3,
              type: "GLOBAL",
              level: 2,
              branchNum: 3,
              children: null,
              updatedAt: "2022-09-13 15:43:19",
            },
            {
              id: 17,
              text: "合成标签3",
              leftNumber: 4,
              rightNumber: 9,
              type: "COMBINE",
              level: 2,
              branchNum: 3,
              children: [
                {
                  id: 15,
                  text: "标签5",
                  nlpName: "标签5",
                  ytName: "标签5",
                  leftNumber: 5,
                  rightNumber: 6,
                  type: "GLOBAL",
                  level: 3,
                  branchNum: 3,
                  children: null,
                  updatedAt: "2022-09-13 15:43:19",
                },
                {
                  id: 16,
                  text: "标签6",
                  nlpName: "标签6",
                  ytName: "标签6",
                  leftNumber: 7,
                  rightNumber: 8,
                  type: "GLOBAL",
                  level: 3,
                  branchNum: 3,
                  children: null,
                  updatedAt: "2022-09-13 15:43:19",
                },
              ],
              updatedAt: "2022-09-13 15:43:19",
            },
          ],
          updatedAt: "2022-09-13 15:43:19",
        },
      ],
    },
  };
  return Promise.resolve({ data });
};

export const getModulesList = () => {
  const data = {
    code: 20000,
    msg: "操作成功",
    result: [
      {
        id: 1,
        moduleName: "产品洞察",
        moduleCode: "ANALYZE_INSIGHT",
      },
      {
        id: 2,
        moduleName: "服务洞察",
        moduleCode: "WAITER_INSIGHT",
      },
      {
        id: 3,
        moduleName: "市场洞察",
        moduleCode: "MARKET_INSIGHT",
      },
      {
        id: 4,
        moduleName: "全局分析",
        moduleCode: "GLOBAL_ANALYSIS",
      },
    ],
  };
  return Promise.resolve({ data });
};
