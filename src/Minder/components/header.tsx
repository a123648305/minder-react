import { Button } from "antd";
import styles from "../index.module.less";

type PropsType = {
  title: string;
  saveStatus: boolean;
  zoom?: number;
  exitPage: () => void;
  importData: () => void;
  saveData: () => void;
  exportData: (type: "img" | "data") => void;
  excomand: (key: string) => void;
};

const headerOpeatorIcon = [
  {
    icon: "icon-chexiao",
    text: "撤销",
    commandkey: "",
  },
  {
    icon: "icon-zhongzuo",
    text: "重做",
    commandkey: "",
  },
  {
    icon: "icon-charuzijiedian",
    text: "新增子节点",
    commandkey: "",
  },
  {
    icon: "icon-charutongjijiedian",
    text: "新增同级节点",
    commandkey: "",
  },
  {
    icon: "icon-shanchu1",
    text: "删除节点",
    commandkey: "",
  },
];

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
        <ul>
          {headerOpeatorIcon.map((item) => (
            <li
              className={`icon iconfont ${item.icon}`}
              onClick={() => excomand(item.commandkey)}
            />
          ))}
        </ul>
        <div className={styles.zoom}>
          <i className="icon iconfont icon-jian" />
          <span>{zoom}%</span>
          <i className="icon iconfont icon-jia" />
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
