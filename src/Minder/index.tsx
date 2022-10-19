import { Spin, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import MinderHeader from "./components/header";
import MinderContainer from "./components/Minder";
import CommandDraw from "./components/commandDraw";
import {
  getLevel,
  getUseCommand,
  transportdata,
  transportRevertdata,
} from "./utils";
import styles from "./index.module.less";
import { AxiosError, AxiosResponse } from "axios";
// import { Prompt } from 'react-router-dom';

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
    updateTree: (data: any) => Promise<AxiosResponse>;
    importTreeData: (file: File, projectId?: string) => Promise<AxiosResponse>;
    [key: string]: (data: any) => Promise<AxiosResponse>;
  };
  isCem?: boolean;
  type: string;
  id?: string;
  readonly?: boolean;
  title?: string;
};
const MinderPage: React.FC<PropsType> = (props) => {
  const {
    fetchApi: {
      getTreeData,
      getAlltags,
      getModulesList,
      saveTree,
      updateTree,
      importTreeData,
    },
    projectId,
    isCem,
    id,
    readonly,
    title,
  } = props;
  // console.log("ccc", props, router);
  const [curTitle, SetTitle] = useState(title || "未命名");
  const minderRef = useRef<any>();
  const editTreeData = useRef<any>({ blocks: [] });

  const [treeData, SetTreeData] = useState<object>();
  const [loading, SetLoading] = useState(true);
  const [saveForm, SetSaveForm] = useState<
    { title: string; moduleIds: string[] } | undefined
  >();
  const [zoom, SetZoom] = useState(100);
  const [selectNode, SetSelectNode] = useState<any[]>([]);
  const [disabledList, SetDisabledList] = useState<number[]>([]); // 不可选择的全局标签 指标
  const [uploadVisible, SetuploadVisible] = useState(false);
  const [disabledIcons, SetDisabledIcons] = useState([]);

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
          const { businessPoint, treeData } = res.data.result;
          const editTree = {
            root: {
              data: {
                text: businessPoint.name,
              },
              children: transportRevertdata(treeData),
            },
          };
          console.log("tree data ====>", editTree);
          SetTreeData(editTree);
          SetTitle(businessPoint.name);
          editTreeData.current = businessPoint;
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

  // 绑定模块
  const bindModule = async () => {
    minderRef.current
      .validTree()
      .then((res: any) => {
        console.log(res, "ed", editTreeData);
        SetSaveForm({
          title: curTitle,
          moduleIds: editTreeData.current.blocks.map(
            (k: { id: number }) => k.id
          ),
        });
      })
      .catch((err: any) => console.log(err, "err"));
  };

  // 保存数据
  const saveTreeData = (moduleForm: { title: string; moduleIds: string[] }) => {
    const treeData = minderRef.current.getTreeData();
    const { children, data } = treeData.root;
    const { moduleIds, title } = moduleForm;
    const params = {
      businessPointId: editTreeData.current.id,
      businessPointName: title,
      datas: transportdata(children),
      level: children.length ? getLevel(children) : 0,
      projectId,
      moduleIds,
      kind: isCem ? "SELF" : "SYSTEM_DEFAULT", // 区分自定义还是系统标签、指标树
    };
    console.log(treeData, params, "save");

    // 区分新增/编辑
    const Fn = editTreeData.current.id ? updateTree : saveTree;
    Fn(params).then((res) => {
      if (res.data.code === 20000) {
        if (title !== data.text) {
          // 树名称改变 同步显示
          data.text = title;
          SetTreeData(treeData);
          SetTitle(title);
        }
        editTreeData.current = {
          id: res.data.result,
          blocks: moduleIds.map((id) => ({ id })),
        };
        message.success("保存成功");
        SetSaveForm(undefined);
      }
    });
  };

  // 导入数据
  const importData = (res: any) => {
    if (res.data.code === 20000) {
      const editTree = {
        root: {
          data: {
            text: curTitle,
          },
          children: transportRevertdata(res.data.result),
        },
      };
      console.log("tree data ====>", editTree);
      SetTreeData(editTree);
    }
  };

  // 导出数据 图片
  const exportData = (type: "img" | "data") => {
    minderRef.current.exportFn(type);
  };

  // 执行命令快捷键 special：任意时刻可执行的命令
  const excomand = (type: string, val?: any, special?: boolean) => {
    minderRef.current.editeorComand(type, val, special);
  };

  useEffect(() => {
    constructTree();
  }, []);

  return (
    <div className={styles.minder_wrap}>
      <MinderHeader
        title={curTitle}
        saveStatus={false}
        importData={() => SetuploadVisible(true)}
        saveData={bindModule}
        exportData={exportData}
        excomand={excomand}
        zoom={zoom}
        isChecked={!!selectNode.length}
        readonly={readonly}
        disabledIcons={disabledIcons}
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
            changeTitle={(text: string) => {
              text !== curTitle && SetTitle(text);
            }}
            changeHistory={(e: any) => SetDisabledIcons(e)}
          />
        )}
        <CommandDraw />
      </div>
    </div>
  );
};

export default MinderPage;
