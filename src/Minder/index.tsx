import { useState } from "react";
import MinderHeader from "./components/header";
import MinderContainer from "./components/Minder";
import MinderTagsDraw from "./components/tagDraw";
import styles from "./index.module.less";

type PropsType = {};
const MinderPage: React.FC<PropsType> = () => {
  const title = `业务视角名称1`;
  const [tagShow, SetTagShow] = useState(true);
  const tagList = [
    {
      value: 1,
      label: "颜色",
    },
    {
      value: 2,
      label: "内存",
    },
  ].concat(new Array(100).fill({ value: Math.random, label: "内存2" }));

  const disabledList = [1, 2];

  return (
    <div className={styles.minder_wrap}>
      <MinderHeader
        title={title}
        saveStatus={false}
        exitPage={function (): void {
          throw new Error("Function not implemented.");
        }}
        importData={function (): void {
          throw new Error("Function not implemented.");
        }}
        saveData={() => {
          SetTagShow(true);
        }}
        exportData={function (type: "data" | "img"): void {
          throw new Error("Function not implemented.");
        }}
        excomand={function (key: string): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className={styles.minder_content}>
        <MinderContainer />
        <MinderTagsDraw
          onClose={() => SetTagShow(false)}
          visible={tagShow}
          tagType="tag1"
          tagList={tagList}
          disabledList={disabledList}
        />
      </div>
    </div>
  );
};

export default MinderPage;
