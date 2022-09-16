import { Drawer, Input, message, Popover } from 'antd';
import { useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';

const classNames = require('classnames');

type PropsType = {
  selectNode: any[];
  title?: string;
  tagType: string;
  tagList: Array<{
    id: number;
    isEnabled: boolean;
    text: string;
  }>;
  disabledList?: Array<string | number>;
  checkTag: (data: any) => void;
};

const MinderTagsDraw: React.FC<PropsType> = ({
  title,
  tagType,
  tagList = [],
  disabledList = [],
  selectNode,
  checkTag,
}) => {
  const isTag = tagType === 'tag';
  const tagLabel = isTag ? '标签' : '指标';
  const defaultTitle = isTag ? '全局标签' : '全局指标';

  const [kewWord, SetKewWord] = useState('');
  const [open, SetOpen] = useState(false);
  const curTagsList = useMemo(() => {
    return tagList.filter((k) => k.text.includes(kewWord));
  }, [tagList, kewWord]);

  const searchVal = useRef('');

  const searchTags = () => {
    SetKewWord(searchVal.current);
  };

  const openTagsDraw = () => {
    if (selectNode.length !== 1 || selectNode[0].getLevel() === 6) return;
    SetOpen(true);
  };

  return (
    <>
      <Drawer
        title={title || defaultTitle}
        placement="right"
        mask={false}
        visible={open}
        getContainer={false}
        className={styles.tagDraw}
        onClose={() => SetOpen(false)}
        width={378}
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
                onClick={() => {
                  searchVal.current = '';
                  searchTags();
                }}
              />
            ),
          }}
          suffix={<i className="icon iconfont  icon-sousuo1" onClick={() => searchTags()} />}
          onPressEnter={() => searchTags()}
        />
        <div className={styles.tagDraw_list}>
          {curTagsList.map((item) => (
            <span
              className={classNames(styles.tagDraw_item, {
                [styles.tagDraw_item_tag]: isTag,
                [styles.tagDraw_item_disabled]: disabledList.includes(item.id),
              })}
              key={item.id}
              onClick={() => checkTag(item)}
            >
              {item.text}
            </span>
          ))}
        </div>
      </Drawer>
      <div className={styles.tagDraw_popover}>
        <Popover content="添加全局指标" placement="top">
          <i className="icon iconfont icon-jia" onClick={() => openTagsDraw()}></i>
        </Popover>
      </div>
    </>
  );
};

export default MinderTagsDraw;
