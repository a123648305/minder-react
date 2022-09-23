import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { getKeyCode } from "./utils";

type PropsType = {
  defaultValue?: string;
  width?: number;
  maxLength?: number;
  onSubmit: Function;
  onChange: Function;
  onCancel: Function;
  ref: any;
};

const InputBox: React.FC<PropsType> = forwardRef((props, ref: Ref<any>) => {
  const {
    defaultValue,
    onChange,
    onSubmit,
    onCancel,
    maxLength = 100,
    width = 120,
  } = props;
  const inputRef = useRef<any>();

  const onKeydown = (evt: any) => {
    evt.stopPropagation();
    //@ts-ignore
    const { KeyMap } = window.kityminder;
    const keyCode = getKeyCode(evt);
    if (keyCode === KeyMap.enter) {
      onSubmit();
    }
    if (keyCode === KeyMap.esc) {
      onCancel();
    }
  };

  const onInputChange = (e: any) => {
    const { value } = e.target;
    onChange(value);
  };

  useEffect(() => {
    autoFocus();
  }, [defaultValue]);

  // 自动聚焦
  const autoFocus = () => {
    console.log(9);
    inputRef.current.focus();
    inputRef.current.select();
  };

  useImperativeHandle(ref, () => ({
    autoFocus,
  }));

  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      maxLength={maxLength}
      onChange={onInputChange}
      onKeyDown={onKeydown}
      onBlur={(e) => onSubmit(e)}
      style={{
        width,
        // border: "none",
        // outline: "none",
        paddingLeft: 5,
      }}
    />
  );
});

export default InputBox;
