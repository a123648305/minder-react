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
import { Button, Col, Dropdown, Menu, Row, Space, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import EditNode from "../../component/Editor/index";
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
  data: object;
};

const Minder: React.FC<PropsType> = forwardRef((props, ref: Ref<any>) => {
  const { theme = "normal", template = "normal", data } = props;
  console.log(data, ref, "ccccc");
  const kityRef = useRef(null);
  const [km, SetMinder] = useState();

  useEffect(() => {
    if (kityRef.current && data) {
      // 填充数据
      kityRef.current.append(JSON.stringify(data));
      // 创建 km 实例
      const km = (window.km = new kityminder.Minder());
      km.setup(kityRef.current);
      // km.disable();
      // km.execCommand("hand");
      SetMinder(km);
      // editeorComand("Template", template);
      // editeorComand("Theme", theme);
      // km.execCommand("Template", "normal");
      // km.execCommand("Theme", "normal");
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

  const menu = () => {
    const arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push({
        key: i + "",
        label: `展开到${i}级节点`,
      });
    }

    return (
      <Menu
        items={arr}
        onClick={(val) => editeorComand("ExpandToLevel", val.key)}
      />
    );
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
          <Dropdown overlay={menu}>
            <Space>
              展开
              <DownOutlined />
            </Space>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => console.log(km.exportJson())}>
            获取当前数据
          </Button>
        </Col>
        <Col>
          <Button onClick={() => exportFn("img")}>导出图片</Button>
        </Col>
        <Col>
          <Button onClick={() => exportFn("data")}>导出数据</Button>
        </Col>
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

  useImperativeHandle(ref, () => ({
    exportFn,
    getTreeData: () => {},
    getSelectionData: () => {},
  }));

  return (
    <div className={styles.minder_containter}>
      <div className={styles.contentbox}>
        {/* {opeatorArea} */}
        <div
          ref={kityRef}
          type="application/kityminder"
          minder-data-type="json"
          style={{ height: "100%" }}
        ></div>
        <EditNode minder={km} canEdit />
        <ul className={styles.lev_popover}>
          {leveColors.map((background, index) => (
            <li>
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
