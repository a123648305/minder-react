import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import MinderHeader from "./components/header";
import MinderContainer from "./components/Minder";
import MinderTagsDraw from "./components/tagDraw";
import CommandDraw from "./components/commandDraw";
import styles from "./index.module.less";

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
    [key: string]: (data: any) => Promise<Response>;
  };
  isCem?: boolean;
  type: string;
  id?: string;
  readonly?: boolean;
};
const MinderPage: React.FC<PropsType> = (props) => {
  const {
    fetchApi: { getTreeData, getAlltags },
    projectId,
    isCem,
    type,
    id,
    readonly,
  } = props;
  console.log("ccc");

  const title = `业务视角名称1`;
  const minderRef = useRef<any>();
  const [tagShow, SetTagShow] = useState(false);
  const [tagList, SetTagList] = useState([]);
  const [treeData, SetTreeData] = useState();
  const [loading, SetLoading] = useState(true);
  const [zoom, SetZoom] = useState(100);
  const [selectNode, SetSelectNode] = useState<any[]>([]);

  const disabledList: string[] = [];

  // 获取树的数据 构造符合的结构
  const constructTree = () => {
    // getTreeData(id).then((res) => {
    //   SetTreeData(res);
    // });
    const data = {
      root: {
        data: {
          text: "百度产品",
        },
        children: [
          { data: { text: "新闻" } },
          { data: { text: "网页", priority: 1 } },
          { data: { text: "贴吧", priority: 2 } },
        ],
      },
    };

    const defaultData = {
      root: {
        data: {
          text: title,
          children: [],
        },
      },
    };
    setTimeout(() => {
      //@ts-ignore
      SetTreeData(defaultData);
    }, 300);
    setTimeout(() => SetLoading(false), 300);
  };

  // 获取全局指标、标签
  const fetchAllTags = () => {
    // getAlltags().then((res) => {
    //   SetTagList(res);
    // });
  };

  // 保存数据
  const saveTreeData = () => {
    const data = minderRef.current.getTreeData();

    console.log(data, "save");
  };

  // 退出当前页面
  const exitPage = () => {
    console.log("exit");
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
  const addGobalNode = (data: any) => {
    const obj = {
      text: "d",
      id: "1",
      type: "22",
    };
    console.log(data, "add gobal");
  };

  useEffect(() => {
    // constructTree();
    // fetchAllTags();
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
        {/* {loading ? (
          <Spin spinning={loading}></Spin>
        ) : (
          <MinderContainer data={treeData} ref={minderRef} />
        )} */}
        <MinderContainer
          readonly={readonly}
          data={treeData}
          ref={minderRef}
          zoomChange={(zoom: number) => SetZoom(zoom)}
          selectionchange={(selectNode: any[]) => SetSelectNode(selectNode)}
        />
        <MinderTagsDraw
          onClose={() => SetTagShow(false)}
          visible={tagShow}
          tagType={type}
          tagList={tagList}
          disabledList={disabledList}
          checkTag={addGobalNode}
        />
        <CommandDraw />
      </div>
    </div>
  );
};

export default MinderPage;
