// @ts-nocheck
import "./minderDist/kityminder.core.css";
import "./minderDist/kity.min";
import "./minderDist/kityminder.core.min";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import React from "react";
import { OptionsType } from "../edit";
import { message } from "antd";
import { saveAs } from "file-saver";
import EditNode from "./Editor/index";
import styles from "../index.module.less";
import { leveColors, initNodeData, exportTreeExcel } from "../utils";

type PropsType = OptionsType & {
  defaultOptions?: object; //思维导图默认配置
  data: object;
  readonly?: boolean;
  zoomChange: (zoom) => void;
  selectionchange: (selectNode) => void;
  disabledTagsChange: (type: string, data: object) => void;
};

const Minder: React.FC<PropsType> = forwardRef((props, ref: Ref<any>) => {
  const {
    defaultOptions = {
      zoom: [25, 50, 75, 100, 125, 175, 200],
      defaultTheme: "normal",
    },
    readonly,
    data,
    zoomChange,
    selectionchange,
  } = props;
  // console.log(data, ref, "ccccc");
  const kityRef = useRef(null);
  const [km, SetMinder] = useState();

  useEffect(() => {
    if (kityRef.current && !km) {
      // 填充数据
      kityRef.current.append(JSON.stringify(data));
      // 创建 km 实例
      const km = (window.km = new kityminder.Minder(defaultOptions));
      km.setup(kityRef.current);
      if (readonly) {
        km.disable();
        //km.execCommand("hand");
      } else {
        SetMinder(km);
      }
    }
  }, [kityRef]);

  useEffect(() => {
    km && km.importJson(data);
  }, [data]);

  const editeorComand = (type: string, value?: string | number) => {
    console.log(type, value);
    if (km.queryCommandState(type) < 1) {
      value ? km.execCommand(type, value) : km.execCommand(type);
    }
  };

  const exportFn = async (type: "img" | "data") => {
    try {
      const { root } = km.exportJson();
      if (type === "img") {
        const base64Data = await km.exportData("png");
        saveAs(base64Data, `${root.data.text}.png`);
      } else {
        try {
          exportTreeExcel(root.children, root.data.text);
        } catch (error) {
          message.error(error.toString());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const searchNode = (node, previewKeyword) => {
  //   km.execCommand("camera", node, 50);
  //   setTimeout(function () {
  //     km.select(node, true);
  //     if (!node.isExpanded()) km.execCommand("expand", true);
  //     if (previewKeyword) {
  //       km.fire("shownoterequest", {
  //         node: node,
  //         keyword: previewKeyword,
  //       });
  //     }
  //   }, 60);
  // };

  // 一些事件监听
  useEffect(() => {
    if (km) {
      // 放大缩小
      km.on("zoom", (e) => {
        zoomChange(e.zoom);
      });
      // 执行命令前
      km.on("beforeExecCommand", (e) => {
        // 这里做一些判断 通过后继续执行指令
        km.focus(); // 聚焦视图
        const { commandName, commandArgs } = e;
        const currentNodes = km.getSelectedNodes();
        const shouldStopPropagation = () => true; // 用于终止操作

        console.log(e, "execCommandTest", currentNodes);

        // 移动节点
        if ("movetoparent" === commandName) {
          const [targetNode] = commandArgs[0];
          if (targetNode.data.id) {
            // message.warning("不可移动到此节点下");
            e.shouldStopPropagation = shouldStopPropagation;
          }
        }

        // 删除节点
        if ("removenode" === commandName) {
          //  message.warning("莫及节点");
          currentNodes.forEach((element) => {
            // 父级节点只有这一个子节点
            if (element.parent.children.length === 1) {
              e.shouldStopPropagation = shouldStopPropagation;
            }
          });
        }

        // 插入子节点
        if ("appendchildnode" === commandName) {
          if (commandArgs.length === 0) {
            // 快捷键新增 给个默认数据 和颜色
            const curLev = currentNodes[0].isRoot()
              ? 1
              : currentNodes[0].parent.getLevel() + 2;
            const data = initNodeData(curLev);
            e.commandArgs.push(data);
          }
          if (currentNodes[0].data.id) {
            message.warning("不可添加子节点");
            e.shouldStopPropagation = shouldStopPropagation;
          }

          if (
            (currentNodes[0].data.level || currentNodes[0].getLevel()) === 7
          ) {
            message.warning("超出层级限制");
            e.shouldStopPropagation = shouldStopPropagation;
          }
        }
        // 插入同级节点
        if ("appendsiblingnode" === commandName) {
          if (commandArgs.length === 0) {
            // 快捷键新增 未带
            const curLev = currentNodes[0].isRoot()
              ? 1
              : currentNodes[0].parent.getLevel() + 1;
            const data = initNodeData(curLev);
            e.commandArgs.push(data);
          }
        }
        return e;
      });

      km.on("selectionchange", (e) => {
        const selNode = km.getSelectedNodes() || [];
        selectionchange(selNode);
      });
    }
    return () => {
      if (km) {
        km.off("zoom");
        km.off("beforeExecCommand");
      }
    };
  }, [km]);

  useImperativeHandle(ref, () => ({
    exportFn,
    editeorComand,
    validTree: () => {
      return new Promise((resolve, reject) => {
        km.getRoot().traverse(function (node) {
          if (node.data.type === "COMBINE" && node.children?.length < 1) {
            message.error("未选择末级指标");
            // km.focus();
            // km.select([node]);
            reject("未选择末级指标");
          }
          resolve();
        });
      });
    },
    getTreeData: () => {
      return km.exportJson();
    },
    getSelectionData: () => {
      km.exportJson();
    },
  }));

  return (
    <div className={styles.minder_containter}>
      <div className={styles.contentbox}>
        <div
          ref={kityRef}
          type="application/kityminder"
          minder-data-type="json"
          style={{ height: "100%" }}
        ></div>
        <EditNode minder={km} canEdit={!readonly} />
        <ul className={styles.lev_popover}>
          {leveColors.map((background, index) => (
            <li
              onClick={(e) => {
                editeorComand("ExpandToLevel", index + 1);
              }}
              key={index}
            >
              <span style={{ background }} />
              <span>{index + 1}级</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Minder;
