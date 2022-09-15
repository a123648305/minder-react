import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import MinderHeader from "./components/header";
import MinderContainer from "./components/Minder";
import MinderTagsDraw from "./components/tagDraw";
import CommandDraw from "./components/commandDraw";
import { getLevel, getUseCommand, leveColors } from "./utils";
import styles from "./index.module.less";

// import { data as tagLe } from "./mock";

/**
 * projectId string 项目id
 * fetchApi  promise 一些要用到的接口
 * isCem  boolean  用于区分cemforont or oms
 * type  string   用于区分标签还是指标
 * id  string  树的id
 * readonly boolean 是否只读模式 预览
 */

type PropsType = {
  projectId: string;
  fetchApi: {
    getTreeData: (data: any) => Promise<Response>;
    getAlltags: (data: any) => Promise<Response>;
    saveTree: (data: any) => Promise<Response>;
    importTreeData: (data: any) => Promise<Response>;
    [key: string]: (data: any) => Promise<Response>;
  };
  isCem?: boolean;
  type: string;
  id?: string;
  readonly?: boolean;
};
const MinderPage: React.FC<PropsType> = (props) => {
  const {
    fetchApi: { getTreeData, getAlltags, saveTree, importTreeData },
    projectId,
    isCem,
    type,
    id,
    readonly,
  } = props;
  console.log("ccc");

  const title = `业务视角名称1`;
  const minderRef = useRef<any>();
  const [tagList, SetTagList] = useState<
    { id: number; isEnabled: boolean; text: string }[]
  >([]);
  const [treeData, SetTreeData] = useState<object>();
  const [loading, SetLoading] = useState(true);
  const [zoom, SetZoom] = useState(100);
  const [selectNode, SetSelectNode] = useState<any[]>([]);

  const disabledList: string[] = [];

  // 获取树的数据 构造符合的结构
  const constructTree = () => {
    const defaultData = {
      root: {
        data: {
          text: title,
        },
      },
    };
    if (id) {
      getTreeData({ projectId, id }).then((res) => {
        // SetTreeData(res);
        console.log(res);
      });
    } else {
      setTimeout(() => {
        SetTreeData(defaultData);
        SetLoading(false);
      }, 300);
    }
  };

  // 获取全局指标、标签
  const fetchAllTags = () => {
    getAlltags({ projectId, businessId: id }).then((res) => {
      SetTagList(res.result);
    });
    // setTimeout(() => SetTagList(tagLe), 500);
  };

  // 保存数据
  const saveTreeData = () => {
    const treeData = minderRef.current.getTreeData();
    const { data, children } = treeData.root;
    const params = {
      businessTagId: id,
      businessTagName: data.text,
      datas: children,
      level: children.length ? getLevel(children) : 0,
      projectId,
    };
    console.log(treeData, params, "save");
    saveTree(params);
  };

  // 退出当前页面
  const exitPage = () => {
    console.log("exit", minderRef.current.getTreeData());
    const tset = {
      root: {
        data: {
          text: "百度产品",
        },
        children: [
          { data: { text: "新闻" } },
          {
            data: {
              text: "网页",
              priority: 1,
              "border-radius": 50,
              "border-color": "red",
            },
            children: [
              { data: { text: "新闻1" } },
              { data: { text: "网页3", priority: 1 } },
            ],
          },
          { data: { text: "贴吧", priority: 2 } },
          { data: { text: "知道", priority: 2 } },
          { data: { text: "音乐", priority: 3 } },
        ],
      },
    };
    // SetTreeData(tset);
  };

  // 导入数据
  const importData = () => {};

  // 导出数据 图片
  const exportData = (type: "img" | "data") => {
    console.log(minderRef.current, "ccxzzc");
    minderRef.current.exportFn(type);
  };

  // 执行命令快捷键
  const excomand = (type: string, val?: any) => {
    console.log("excomand", type, val);
    minderRef.current.editeorComand(type, val);
  };

  // 增加全局指标、标签 节点
  const addGobalNode = (data: { id: number; text: string }) => {
    const { id, text } = data;
    const obj = {
      text,
      id,
      type: "GLOBAL", // GLOBAL,COMBINE
      "border-radius": 50,
      "border-color": leveColors[selectNode[0].getLevel()],
      background: "white",
    };
    console.log(data, "add gobal", selectNode[0].getLevel());
    const shell = getUseCommand("插入子节点");
    excomand(shell.minderCommand as string, obj);
  };

  useEffect(() => {
    fetchAllTags();
    constructTree();
  }, []);

  return (
    <div className={styles.minder_wrap}>
      <MinderHeader
        title={title}
        saveStatus={false}
        exitPage={exitPage}
        importData={importData}
        saveData={() => saveTreeData()}
        exportData={exportData}
        excomand={excomand}
        zoom={zoom}
        isChecked={!!selectNode.length}
        readonly={readonly}
      />
      <div className={styles.minder_content}>
        {loading ? (
          <Spin spinning={loading}></Spin>
        ) : (
          <MinderContainer
            readonly={readonly}
            data={treeData}
            ref={minderRef}
            zoomChange={(zoom: number) => SetZoom(zoom)}
            selectionchange={(selectNode: any[]) => SetSelectNode(selectNode)}
          />
        )}
        {/* <MinderContainer
          readonly={readonly}
          data={treeData}
          ref={minderRef}
          zoomChange={(zoom: number) => SetZoom(zoom)}
          selectionchange={(selectNode: any[]) => SetSelectNode(selectNode)}
        /> */}
        <MinderTagsDraw
          tagType={type}
          tagList={tagList}
          disabledList={disabledList}
          checkTag={addGobalNode}
          selectNode={selectNode}
        />
        <CommandDraw />
      </div>
    </div>
  );
};

export default MinderPage;
