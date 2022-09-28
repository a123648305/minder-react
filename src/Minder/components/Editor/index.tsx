import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { getKeyCode, isIntendToInput } from "./utils";
import InputBox from "./InputBox";
import { message } from "antd";
import { debounce, throttle } from "lodash";
import { vaildTreeRepeat } from "../../utils";

type PropsType = {
  Editor: React.ReactNode | Function;
  canEdit: boolean;
  onEdit?: Function;
  minder: any;
  tagList: { id: number; isEnabled: boolean; text: string }[];
  defaultValue?: string;
};

const EditorWrapper: React.FC<PropsType> = (props) => {
  const { canEdit, onEdit, minder, defaultValue, tagList } = props;
  const editingNodeRef = useRef();
  const inputBoxRef = useRef<any>();
  const [initialValue, setInitialValue] = useState();
  const [inputStyle, SetIputStyle] = useState({});
  const [editingNode, setEditingNode] = useState<{
    box: {
      height: number;
      x: number;
      y: number;
      width: number;
    };
  }>();

  const setEditorEditingNode = (v?: any) => {
    editingNodeRef.current = v;
    setEditingNode(v);
  };

  const exitEdit = () => {
    setEditorEditingNode();
    minder.focus();
  };
  const onSubmit = (val: string) => {
    console.log("sumbit", editingNodeRef);
    //@ts-ignore
    const { node } = editingNodeRef.current || {};
    if (!node) return;
    message.destroy();
    const isRepeat = tagList.find((d) => d.text === val);
    // 与全局标签、指标重复了
    if (isRepeat) {
      message.warning("名称不能与全局标签重复");
      inputBoxRef.current.autoFocus();
      return;
    }
    // 与其他节点重复了
    if (vaildTreeRepeat(minder, { text: val, nid: node.data.nid })) {
      message.warning("名称不能重复");
      inputBoxRef.current.autoFocus();
      return;
    }

    // minder.getAllNode((mnode: any) => {
    //   if (!mnode.isRoot() && node.data.nid !== mnode.data.nid && mnode.data.text === val) {
    //     message.warning('名称不能重复');
    //     inputBoxRef.current.autoFocus();
    //     throw Error('名称不能重复');
    //   }
    // });

    if (node && (!onEdit || (onEdit && onEdit(val) !== false))) {
      node.setText(val);
      minder.select(node, true);
      minder.fire("nodechange", { node });
      minder.fire("contentchange");
      minder.getRoot().renderTree();
      minder.layout(300);
    }
    exitEdit();
  };

  useEffect(() => {
    const edit = (e: any) => {
      console.log("edit");
      if (canEdit) {
        console.log("edit1");

        const node = minder.getSelectedNode();
        if (node) {
          // 全局指标 标签 禁止编辑
          if (node.data.notAppend) {
            return false;
          }

          const box = node
            .getRenderer("OutlineRenderer")
            .getRenderShape()
            .getRenderBox("view");
          const { text = "" } = node.data;
          const editingNode = {
            node,
            box,
          };
          if (box.x > 0 || box.y > 0) {
            let value = text;
            setEditorEditingNode(editingNode);
            setInitialValue(value || defaultValue);
            const styles = {
              position: "absolute",
              top: `${box.y + box.height / 2}px`,
              left: `${box.x}px`,
              transform: "translateY(-50%)",
            };
            SetIputStyle(styles);
          }
        }
      }
    };

    const editNodeName = "editnode";
    const editNodeHandler = debounce(edit, 500);
    const dblclickName = "dblclick";
    const dblclickHandler = edit;
    const keydownName = "keydown";
    const selectionchangeName = "selectionchange";
    const viewChangeName = "viewchange viewchanged";

    const keydownHandler = (e: { originEvent: any }) => {
      if (isIntendToInput(e.originEvent) && minder.getSelectedNode()) {
        edit(e);
      }
    };

    const viewChangeHandler = (e: any) => {
      const node = minder.getSelectedNode();
      if (node && !node.data.notAppend) {
        const box = node
          .getRenderer("OutlineRenderer")
          .getRenderShape()
          .getRenderBox("view");
        if (box.x > 0 || box.y > 0) {
          const styles = {
            position: "absolute",
            top: `${box.y + box.height / 2}px`,
            left: `${box.x}px`,
            transform: "translateY(-50%)",
          };
          SetIputStyle(styles);
        }
      }
    };

    if (minder) {
      minder.on(editNodeName, editNodeHandler);
      minder.on(dblclickName, dblclickHandler);
      minder.on(keydownName, keydownHandler);
      minder.on(viewChangeName, viewChangeHandler);
    }
    return () => {
      if (minder) {
        minder.off(editNodeName, editNodeHandler);
        minder.off(dblclickName, dblclickHandler);
        minder.off(keydownName, keydownHandler);
        minder.off(selectionchangeName);
        minder.off(viewChangeName);
      }
    };
  }, [minder, canEdit]);

  useEffect(() => {
    const escHandler = (evt: any) => {
      const keyCode = getKeyCode(evt);
      //@ts-ignore
      if (keyCode === window.kityminder.KeyMap.esc) {
        exitEdit();
      }
    };
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("keydown", escHandler);
    };
  }, [minder]);

  const editFunction = useMemo(
    () =>
      editingNode ? (
        <div
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <div style={inputStyle} onClick={(e) => e.stopPropagation()}>
            <InputBox
              defaultValue={initialValue}
              onSubmit={onSubmit}
              onCancel={exitEdit}
              width={editingNode.box.width}
              maxLength={20}
              ref={inputBoxRef}
            />
          </div>
        </div>
      ) : null,
    [minder, initialValue, editingNode, inputStyle]
  );
  return editFunction;
};

export default memo(EditorWrapper);
