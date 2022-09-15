// @ts-nocheck
import "./dist/kityminder.core.css";
import "./dist/kity";
import "./dist/kityminder.core";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import React from "react";
import { OptionsType } from "../edit";
import { Button, Col, Row, message } from "antd";
import { saveAs } from "file-saver";
import EditNode from "./Editor/index";
import CommandDraw from "./commandDraw";
import styles from "../index.module.less";

const leveColors = [
  "rgba(101,120,155,0.2)",
  "rgba(255,136,0,0.2)",
  "rgba(114,46,209,0.2)",
  "rgba(246,60,162,0.2)",
  "rgba(22,93,255,0.2)",
  "rgba(255,51,51,0.2)",
  "rgba(241,241,244,1)",
];

type PropsType = OptionsType & {
  defaultOptions?: object; //思维导图默认配置
  data: object;
  readonly?: boolean;
  zoomChange: (zoom) => void;
  selectionchange: (selectNode) => void;
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
  console.log(data, ref, "ccccc");
  const kityRef = useRef(null);
  const [km, SetMinder] = useState();

  useEffect(() => {
    if (kityRef.current && data) {
      // 填充数据
      kityRef.current.append(JSON.stringify(data));
      // 创建 km 实例
      const km = (window.km = new kityminder.Minder(defaultOptions));
      km.setup(kityRef.current);
      // km.disable();
      // km.execCommand("hand");
      SetMinder(km);
    }
  }, [data, kityRef]);

  // useEffect(() => {}, [data]);

  const editeorComand = (type: string, value?: string | number) => {
    console.log(type, value);
    km.queryCommandState(type) < 1 && km.execCommand(type, value);
  };

  const selectNode = (type: string) => {
    const minder = km;
    switch (type) {
      case "all":
        var selection = [];
        minder.getRoot().traverse(function (node) {
          selection.push(node);
        });
        console.log(selection, "all");

        minder.select(selection, true);
        minder.fire("receiverfocus");
        break;
      case "revert":
        var selected = minder.getSelectedNodes();
        var selection = [];
        minder.getRoot().traverse(function (node) {
          if (selected.indexOf(node) == -1) {
            selection.push(node);
          }
        });
        minder.select(selection, true);
        minder.fire("receiverfocus");
        break;
      case "siblings":
        var selected = minder.getSelectedNodes();
        var selection = [];
        selected.forEach(function (node) {
          if (!node.parent) return;
          node.parent.children.forEach(function (sibling) {
            if (selection.indexOf(sibling) == -1) selection.push(sibling);
          });
        });
        minder.select(selection, true);
        minder.fire("receiverfocus");
        break;
      case "level":
        var selectedLevel = minder.getSelectedNodes().map(function (node) {
          return node.getLevel();
        });
        var selection = [];
        minder.getRoot().traverse(function (node) {
          if (selectedLevel.indexOf(node.getLevel()) != -1) {
            selection.push(node);
          }
        });
        minder.select(selection, true);
        minder.fire("receiverfocus");
        break;
      case "path":
        var selected = minder.getSelectedNodes();
        var selection = [];
        selected.forEach(function (node) {
          while (node && selection.indexOf(node) == -1) {
            selection.push(node);
            node = node.parent;
          }
        });
        minder.select(selection, true);
        minder.fire("receiverfocus");
        break;
      case "tree":
        var selected = minder.getSelectedNodes();
        var selection = [];
        selected.forEach(function (parent) {
          parent.traverse(function (node) {
            if (selection.indexOf(node) == -1) selection.push(node);
          });
        });
        minder.select(selection, true);
        minder.fire("receiverfocus");
        break;
    }
  };

  const exportFn = async (type: "img" | "data") => {
    try {
      if (type === "img") {
        const base64Data = await km.exportData("png");
        saveAs(base64Data, "test.png");
      } else {
        const mindData = await km.exportData("json"); // text or json
        const blob = new Blob([mindData], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, "test.json");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const editNode = () => {
  //   var receiverElement = km.receiver.element;
  //   var fsm = km.fsm;
  //   var receiver = km.receiver;

  //   receiverElement.innerText = km.queryCommandValue("text");
  //   fsm.jump("input", "input-request");
  //   receiver.selectAll();
  // };

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
  console.log(km, "vv");

  const opeatorArea = (
    <div>
      <Row>
        <Col>
          <Button onClick={() => editNode()}>编辑</Button>
        </Col>
        <Col>
          <Button onClick={() => editeorComand("AppendChildNode", "children")}>
            插入子节点
          </Button>
        </Col>
        <Col>
          <Button onClick={() => editeorComand("AppendParentNode", "parent")}>
            插入父节点
          </Button>
        </Col>
        <Col>
          <Button onClick={() => editeorComand("AppendSiblingNode", "brother")}>
            插入同级节点
          </Button>
          <Button onClick={() => editeorComand("resetlayout")}>整理布局</Button>
        </Col>
      </Row>
    </div>
  );

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
        const { commandName, commandArgs } = e;
        const currentNode = km.getSelectedNode();
        const shouldStopPropagation = () => true; // 用于终止操作

        console.log(e, "execCommandTest", currentNode);
        // 插入父，子节点
        if ("appendchildnode" === commandName) {
          if (currentNode.id) {
            message.warning("不可添加子节点");
            e.shouldStopPropagation = shouldStopPropagation;
          }

          if (currentNode.level === 7) {
            message.warning("超出层级限制");
            e.shouldStopPropagation = shouldStopPropagation;
          }
        }

        // 移动节点
        if ("movetoparent" === commandName) {
          message.warning("不可移动到此节点下");
          e.shouldStopPropagation = shouldStopPropagation;
        }

        // 移动节点
        if ("removenode" === commandName) {
          message.warning("不可添加子节点");
          e.shouldStopPropagation = shouldStopPropagation;
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
        {opeatorArea}
        <div
          ref={kityRef}
          type="application/kityminder"
          minder-data-type="json"
          style={{ height: "100%" }}
        ></div>
        <EditNode minder={km} canEdit={!readonly} />
        <ul
          className={styles.lev_popover}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {leveColors.map((background, index) => (
            <li
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editeorComand("ExpandToLevel", index + 1);
              }}
            >
              <span style={{ background }} />
              <span>{index + 1}级</span>
            </li>
          ))}
        </ul>
        <CommandDraw />
      </div>
    </div>
  );
});

export default Minder;
