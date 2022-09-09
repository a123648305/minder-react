import { Button, Popover } from "antd";
import { useState } from "react";
import { getUseCommands, getUseCommand } from "../utils";
import styles from "../index.module.less";

type PropsType = {
  title: string;
  saveStatus: boolean;
  zoom?: number;
  exitPage: () => void;
  importData: () => void;
  saveData: () => void;
  exportData: (type: "img" | "data") => void;
  excomand: (key: string | string[]) => void;
};

const MinderHeader: React.FC<PropsType> = ({
  title,
  saveStatus,
  zoom = 100,
  importData,
  saveData,
  exportData,
  exitPage,
  excomand,
}) => {
  const [headerOpeatorIcon] = useState(
    getUseCommands(["撤销", "重做", "插入子节点", "插入同级节点", "删除节点"])
  );

  const commandKey = (data: {
    icon: string;
    label: string;
    commandkey: string[];
    minderCommand?: string;
  }) => {
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

    return (
      <Popover
        content={
          <div className={styles.commandKey_popover}>
            <p>{data.label}</p>
            <p>{keysDom(data.commandkey)}</p>
          </div>
        }
      >
        <i
          className={`icon iconfont ${data.icon}`}
          onClick={() => excomand(data.commandkey)}
        />
      </Popover>
    );
  };

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
          <i
            className="icon iconfont icon-daochutupian1"
            onClick={() => exportData("img")}
          />
          <i
            className="icon iconfont icon-daochubiaoge"
            onClick={() => exportData("data")}
          />
        </div>
      </div>
    </div>
  );
};

export default MinderHeader;
