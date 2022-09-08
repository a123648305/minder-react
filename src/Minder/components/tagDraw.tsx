import { Drawer, Input } from "antd";
import { useMemo, useRef, useState } from "react";
import styles from "../index.module.less";

const classNames = require("classnames");

type PropsType = {
  onClose: () => void;
  visible: boolean;
  title?: string;
  tagType: string;
  tagList: Array<{ value: string | number; label: string }>;
  disabledList?: Array<string | number>;
};

const MinderTagsDraw: React.FC<PropsType> = ({
  onClose,
  title,
  visible,
  tagType,
  tagList = [],
  disabledList = [],
}) => {
  const isTag = tagType === "tag";
  const tagLabel = isTag ? "标签" : "指标";
  const defaultTitle = isTag ? "全局标签" : "全局指标";

  const [kewWord, SetKewWord] = useState("");
  const curTagsList = useMemo(() => {
    return tagList.filter((k) => k.label.includes(kewWord));
  }, [tagList, kewWord]);

  const searchVal = useRef("");

  const searchTags = (keyword?: string) => {
    const val = keyword || searchVal.current;
    SetKewWord(val);
  };

  return (
    <Drawer
      title={title || defaultTitle}
      placement="right"
      mask={false}
      onClose={onClose}
      open={visible}
      getContainer={false}
      className={styles.tagDraw}
    >
      <Input
        placeholder={`请输入${tagLabel}名称`}
        onChange={(e) => {
          searchVal.current = e.target.value;
        }}
        allowClear={{
          clearIcon: (
            <i
              className="icon iconfont  icon-cem_close-window"
              onClick={() => searchTags()}
            />
          ),
        }}
        suffix={
          <i
            className="icon iconfont  icon-sousuo1"
            onClick={() => searchTags()}
          />
        }
        onPressEnter={() => searchTags()}
      />
      <div className={styles.tagDraw_list}>
        {curTagsList.map((item) => (
          <span
            className={classNames(styles.tagDraw_item, {
              [styles.tagDraw_item_tag]: isTag,
              [styles.tagDraw_item_disabled]: disabledList.includes(item.value),
            })}
            key={item.value}
          >
            {item.label}
          </span>
        ))}
      </div>
    </Drawer>
  );
};

export default MinderTagsDraw;
