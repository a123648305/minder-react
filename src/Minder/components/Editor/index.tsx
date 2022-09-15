// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { getKeyCode, isInputValue, isIntendToInput } from "./utils";
import InputBox from "./InputBox";
import "./index.css";
import { message } from "antd";

type PropsType = {
  Editor: React.ReactNode | Function;
  canEdit: boolean;
  onEdit?: Function;
  minder: any;
  defaultValue?: string;
};

const EditorWrapper: React.FC<PropsType> = (props) => {
  const { canEdit, onEdit, minder, defaultValue } = props;
  // console.log(props, "edit");
  const valueRef = useRef();
  const editingNodeRef = useRef();
  const editorRef = useRef();
  const [initialValue, setInitialValue] = useState();
  const [editingNode, setEditingNode] = useState<{
    box: {
      height: number;
      x: number;
      y: number;
      width: number;
    };
  }>();

  const setEditorValue = (v) => {
    valueRef.current = v;
  };

  const setEditorEditingNode = (v?: any) => {
    editingNodeRef.current = v;
    setEditingNode(v);
  };

  const exitEdit = () => {
    setEditorEditingNode();
    minder.focus();
  };
  const onSubmit = (...args) => {
    const { node } = editingNodeRef.current || {};
    if (node && (!onEdit || (onEdit && onEdit(...args) !== false))) {
      node.setText(valueRef.current);
      minder.select(node, true);
      minder.fire("nodechange", { node });
      minder.fire("contentchange");
      minder.getRoot().renderTree();
      minder.layout(300);
    }
    exitEdit();
  };

  useEffect(() => {
    const edit = (e) => {
      if (canEdit) {
        const node = minder.getSelectedNode();
        if (node) {
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
            // editorRef.style = {
            //   position: "absolute",
            //   top: `${editingNode.box.y + editingNode.box.height / 2}px`,
            //   left: `${editingNode.box.x}px`,
            //   transform: "translateY(-50%)",
            //   border: "1px solid red",
            //   width: `${editingNode.box.width}`,
            // };
            setEditorEditingNode(editingNode);
            setInitialValue(value || defaultValue);
            setEditorValue(value);
          }
        }
      }
    };

    const editNodeName = "editnode";
    const editNodeHandler = edit;
    const dblclickName = "dblclick";
    const dblclickHandler = edit;
    const keydownName = "keydown";
    const selectionchangeName = "selectionchange";

    const keydownHandler = (e) => {
      if (isIntendToInput(e.originEvent) && minder.getSelectedNode()) {
        edit(e);
      }
    };
    if (minder) {
      minder.on(editNodeName, editNodeHandler);
      minder.on(dblclickName, dblclickHandler);
      minder.on(keydownName, keydownHandler);
    }
    return () => {
      if (minder) {
        minder.off(editNodeName, editNodeHandler);
        minder.off(dblclickName, dblclickHandler);
        minder.off(keydownName, keydownHandler);
        minder.off(selectionchangeName);
      }
    };
  }, [minder, canEdit]);

  useEffect(() => {
    const escHandler = (evt) => {
      const keyCode = getKeyCode(evt);
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
          // style={{
          //   position: "absolute",
          //   top: 0,
          //   bottom: 0,
          //   left: 0,
          //   right: 0,
          // }}
          onClick={onSubmit}
        >
          <div
            ref={editorRef}
            style={{
              position: "absolute",
              top: `${editingNode.box.y + editingNode.box.height / 2}px`,
              left: `${editingNode.box.x}px`,
              transform: "translateY(-50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <InputBox
              {...props}
              defaultValue={initialValue}
              onSubmit={onSubmit}
              onChange={setEditorValue}
              onCancel={exitEdit}
              width={editingNode.box.width}
            />
          </div>
        </div>
      ) : null,
    [minder, initialValue, editingNode]
  );
  return editFunction;
};

export default memo(EditorWrapper);
