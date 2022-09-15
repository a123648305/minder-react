import { Button, Popover } from "antd";
import { memo, useCallback, useState } from "react";
import { getUseCommands, getUseCommand } from "../utils";
import styles from "../index.module.less";

const classNames = require("classnames");

type PropsType = {
  title: string;
  saveStatus: boolean;
  zoom: number;
  isChecked?: boolean;
  readonly?: boolean;
  exitPage: () => void;
  importData: () => void;
  saveData: () => void;
  exportData: (type: "img" | "data") => void;
  excomand: (key: string) => void;
};

const MinderHeader: React.FC<PropsType> = ({
  title,
  saveStatus,
  zoom,
  importData,
  saveData,
  exportData,
  exitPage,
  excomand,
  isChecked,
  readonly,
}) => {
  const [headerOpeatorIcon] = useState(
    getUseCommands(["撤销", "重做", "插入子节点", "插入同级节点", "删除节点"])
  );

  const commandKey = useCallback(
    (data: {
      icon: string;
      label: string;
      commandkey: string[];
      minderCommand?: string;
    }) => {
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

      return (
        <Popover
          content={
            <div className={styles.commandKey_popover}>
              <p>{data.label}</p>
              <p>{keysDom(data.commandkey, data.label)}</p>
            </div>
          }
          key={Math.random()}
        >
          <i
            className={classNames("icon", "iconfont", data.icon, {
              [styles.comand_disabled]: readonly || !isChecked,
            })}
            onClick={() => {
              if (data.minderCommand && !readonly) {
                // 选中了节点才给操作
                if (
                  ["插入子节点", "插入同级节点", "删除节点"].includes(
                    data.label
                  )
                ) {
                  isChecked && excomand(data.minderCommand);
                } else {
                  excomand(data.minderCommand);
                }
              }
            }}
          />
        </Popover>
      );
    },
    [excomand, isChecked, readonly]
  );

  return (
    <div className={styles.minder_header}>
      <div className={styles.header_left}>
        <i className="icon iconfont icon-tuichu" onClick={() => exitPage()} />
        <span className={styles.title}>{title}</span>
        <div className={styles.save_tip}>
          <i className="icon iconfont icon-baocunzhuangtai" />
          <span>{saveStatus ? "未保存" : "已保存"}</span>
        </div>
      </div>
      <div className={styles.header_mid}>
        <div className={styles.opeator}>
          {headerOpeatorIcon.map((item) => commandKey(item))}
        </div>
        <div className={styles.zoom}>
          {commandKey(getUseCommand("画布缩小"))}
          <span>{zoom}%</span>
          {commandKey(getUseCommand("画布放大"))}
        </div>
      </div>
      <div className={styles.header_right}>
        <Button type="default" onClick={() => importData()}>
          导入
        </Button>
        <Button type="primary" onClick={() => saveData()}>
          保存
        </Button>
        <div className={styles.export}>
          <Popover content="导出图片">
            <i
              className="icon iconfont icon-daochutupian1"
              onClick={() => exportData("img")}
            />
          </Popover>
          <Popover content="导出表格">
            <i
              className="icon iconfont icon-daochubiaoge"
              onClick={() => exportData("data")}
            />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default memo(MinderHeader);
