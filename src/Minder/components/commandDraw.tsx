import { Drawer, Popover } from "antd";
import React, { useState } from "react";
import { getUseCommands } from "../utils";
import styles from "../index.module.less";

const classNames = require("classnames");

type PropsType = {};

const commandGroup = [
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
  const component = commandGroup.map(({ items, groupName }) => {
    const groupDom = (
      <li
        className={classNames(
          styles.commandDraw_item,
          styles.commandDraw_title
        )}
        key={groupName + "li"}
      >
        {groupName}
      </li>
    );
    const keysDom = (keys: string[], suffixkey: string) => {
      const dom: React.ReactNode[] = [];
      keys.forEach((element, index) => {
        const elm =
          index > 0 ? (
            [
              <span className={styles.keys_plus} key={suffixkey + index}>
                +
              </span>,
              <span key={suffixkey + index + 100}>{element}</span>,
            ]
          ) : (
            <span key={suffixkey + index}>{element}</span>
          );
        dom.push(elm);
      });
      return dom;
    };

    const kesDom = items.map((item) => (
      <li className={styles.commandDraw_item} key={item.label}>
        <div className={styles.command_item_basic}>
          <i className={`icon iconfont ${item.icon}`} />
          <span className={styles.command_item_label}> {item.label}</span>
        </div>
        <div className={styles.command_item_kyes}>
          {keysDom(item.commandkey, item.label)}
        </div>
      </li>
    ));
    return (
      <ul className={styles.commandDraw_ul} key={groupName}>
        {[groupDom, kesDom]}
      </ul>
    );
  });

  return <>{component}</>;
};

const CommandDraw: React.FC<PropsType> = () => {
  const [open, SetOpen] = useState(false);

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
        <Popover content="帮助" placement="top">
          <i
            className="icon iconfont icon-wenjuan"
            onClick={() => SetOpen(true)}
          ></i>
        </Popover>
      </div>
    </>
  );
};

export default CommandDraw;
