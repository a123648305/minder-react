import { Drawer } from "antd";
import React, { useState } from "react";
import { getUseCommands } from "../utils";
import styles from "../index.module.less";

const classNames = require("classnames");

type PropsType = {};

const commandList = [
  {
    groupName: "节点",
    items: getUseCommands(["插入子节点", "插入同级节点"]),
  },
  {
    groupName: "操作",
    items: getUseCommands(["撤销", "重做", "删除节点"]),
  },
  {
    groupName: "画布",
    items: getUseCommands(["画布放大", "画布缩小", "拖动画布"]),
  },
];

const CommandList: React.FC<PropsType> = () => {
  const component = commandList.map(({ items, groupName }) => {
    const groupDom = (
      <li
        className={classNames(
          styles.commandDraw_item,
          styles.commandDraw_title
        )}
      >
        {groupName}
      </li>
    );
    const keysDom = (keys: string[]) => {
      const dom: React.ReactNode[] = [];
      keys.forEach((element, index) => {
        const elm =
          index > 0 ? (
            [
              <span className={styles.keys_plus}>+</span>,
              <span>{element}</span>,
            ]
          ) : (
            <span>{element}</span>
          );
        dom.push(elm);
      });
      return dom;
    };

    const kesDom = items.map((item) => (
      <li className={styles.commandDraw_item}>
        <div className={styles.command_item_basic}>
          <i className={`icon iconfont ${item.icon}`} />
          <span className={styles.command_item_label}> {item.label}</span>
        </div>
        <div className={styles.command_item_kyes}>
          {keysDom(item.commandkey)}
        </div>
      </li>
    ));
    return <ul className={styles.commandDraw_ul}>{[groupDom, kesDom]}</ul>;
  });

  return <>{component}</>;
};

const CommandDraw: React.FC<PropsType> = () => {
  const [open, SetOpen] = useState(true);

  return (
    <>
      <Drawer
        title="快捷键"
        placement="right"
        mask={false}
        open={open}
        getContainer={false}
        className={classNames(styles.tagDraw, styles.commandDraw)}
        onClose={() => SetOpen(false)}
      >
        <CommandList />
      </Drawer>
      <div className={styles.camand_popover}>
        <i
          className="icon iconfont icon-wenjuan"
          onClick={() => SetOpen(true)}
        ></i>
      </div>
    </>
  );
};

export default CommandDraw;
