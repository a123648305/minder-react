import { Spin, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import MinderHeader from "./components/header";
import MinderContainer from "./components/Minder";
import MinderTagsDraw from "./components/tagDraw";
import CommandDraw from "./components/commandDraw";
import SaveDialog from "./components/saveDialog";
import { getLevel, getUseCommand, leveColors, transportdata } from "./utils";
import styles from "./index.module.less";
import { AxiosError, AxiosResponse } from "axios";

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
    getTreeData: (data: any) => Promise<AxiosResponse>;
    getAlltags: (data: any) => Promise<AxiosResponse>;
    getModulesList: (data: any) => Promise<AxiosResponse>;
    saveTree: (data: any) => Promise<AxiosResponse>;
    importTreeData: (data: any) => Promise<AxiosResponse>;
    [key: string]: (data: any) => Promise<AxiosResponse>;
  };
  isCem?: boolean;
  type: string;
  id?: string;
  readonly?: boolean;
  title?: string;
  exictPage?: () => void;
};
const MinderPage: React.FC<PropsType> = (props) => {
  const {
    fetchApi: {
      getTreeData,
      getAlltags,
      getModulesList,
      saveTree,
      importTreeData,
    },
    projectId,
    isCem,
    type,
    id,
    readonly,
    title,
    exictPage,
  } = props;
  console.log("ccc");

  const [curTitle, SetTitle] = useState(title || "未命名");
  const minderRef = useRef<any>();
  const editTreeData = useRef<any>();
  const [tagList, SetTagList] = useState<
    { id: number; isEnabled: boolean; text: string }[]
  >([]);
  const [moduleList, SetModuleList] = useState<
    { label: string; value: string; [key: string]: string }[]
  >([]);

  const [treeData, SetTreeData] = useState<object>();
  const [loading, SetLoading] = useState(true);
  const [saveForm, SetSaveForm] = useState<
    { title: string; moduleIds: string[] } | undefined
  >();
  const [zoom, SetZoom] = useState(100);
  const [selectNode, SetSelectNode] = useState<any[]>([]);
  const [disabledList, SetDisabledList] = useState<number[]>([]); // 不可选择的全局标签 指标

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
        if (res.data.code === 20000) {
          const { businessTag, treeData } = res.data.result;
          const editTree = {
            root: {
              data: {
                text: businessTag.name,
              },
              children: transportdata(treeData),
            },
          };
          console.log("tree data ====>", editTree);
          SetTreeData(editTree);
          SetTitle(businessTag.name);
          editTreeData.current = businessTag;
          SetLoading(false);
        }
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
    getAlltags({ projectId, id }).then((res) => {
      if (res.data.code === 20000) {
        SetTagList(res.data.result);
        // 将此树里面用到的全局标签 指标 设为禁用状态
        const disabledTags = res.data.result.flatMap(
          (item: { id: number; isEnabled: boolean }) =>
            item.isEnabled ? item.id : []
        );
        SetDisabledList(disabledTags);
      }
    });
  };

  // 获取全局绑定模块列表
  const fetchModules = () => {
    getModulesList({ projectId, id }).then((res) => {
      if (res.data.code === 20000) {
        const arr = res.data.result.length
          ? res.data.result.map((item: { moduleName: string; id: number }) => ({
              ...item,
              label: item.moduleName,
              value: item.id,
            }))
          : [];
        SetModuleList(arr);
      }
    });
  };

  // 绑定模块
  const bindModule = async () => {
    // await minderRef.current.validTree();
    SetSaveForm({
      title: curTitle,
      moduleIds: id
        ? editTreeData.current.blocksId.map((k: { id: number }) => k.id)
        : [],
    });
  };

  // 保存数据
  const saveTreeData = (moduleForm: { title: string; moduleIds: string[] }) => {
    const treeData = minderRef.current.getTreeData();
    const { children, data } = treeData.root;
    const { moduleIds, title } = moduleForm;
    const params = {
      businessTagId: id,
      businessTagName: title,
      datas: children,
      level: children.length ? getLevel(children) : 0,
      projectId,
      moduleIds,
    };
    console.log(treeData, params, "save");
    saveTree(params).then((res) => {
      if (res.data.code === 20000) {
        if (title !== data.text) {
          // 树名称改变 同步显示
          data.text = title;
          SetTreeData(treeData);
          SetTitle(title);
        }
        SetSaveForm(undefined);
      }
    });
  };

  // 退出当前页面
  const exictClick = () => {
    Modal.confirm({
      title: "修改尚未保存，是否离开？",
      icon: <ExclamationCircleOutlined />,
      content: "离开后，已修改的指标将不会保存",
      cancelText: "离开",
      okText: "确认",
      onOk() {
        exictPage && exictPage();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
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
    minderRef.current.editeorComand(type, val);
  };

  // 增加全局指标、标签 节点
  const addGobalNode = (data: { id: number; text: string }) => {
    const { id, text } = data;
    const obj = {
      text,
      id,
      type: "GLOBAL", // GLOBAL,COMBINE
      // background: "#f1f1f4",
    };
    console.log(data, "add gobal");
    const shell = getUseCommand("插入子节点");
    excomand(shell.minderCommand as string, obj);
  };

  //
  const disabledTagsChange = (type: string, data: any) => {};

  useEffect(() => {
    fetchAllTags();
    fetchModules();
    constructTree();
  }, []);

  return (
    <div className={styles.minder_wrap}>
      <MinderHeader
        title={curTitle}
        saveStatus={false}
        exictPage={exictClick}
        importData={importData}
        saveData={bindModule}
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
            disabledTagsChange={disabledTagsChange}
          />
        )}
      </div>
      <MinderTagsDraw
        tagType={type}
        tagList={tagList}
        disabledList={disabledList}
        checkTag={addGobalNode}
        selectNode={selectNode}
      />
      <CommandDraw />
      <SaveDialog
        formData={saveForm}
        modeOptions={moduleList}
        onOK={saveTreeData}
        onCancel={() => SetSaveForm(undefined)}
      />
    </div>
  );
};

export default MinderPage;
