import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { getKeyCode } from "./utils";
import { debounce, throttle } from "lodash";

type PropsType = {
  defaultValue?: string;
  width?: number;
  maxLength?: number;
  onSubmit: Function;
  onChange?: (val: string) => void;
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
  const valRef = useRef<any>("");

  const onKeydown = (evt: any) => {
    evt.stopPropagation();
    //@ts-ignore
    const { KeyMap } = window.kityminder;
    const keyCode = getKeyCode(evt);
    if (keyCode === KeyMap.enter) {
      handleSubmit();
    }
    if (keyCode === KeyMap.esc) {
      onCancel();
    }
  };

  const onInputChange = (e: any) => {
    const { value } = e.target;
    valRef.current = value;
    onChange && onChange(value);
  };

  useEffect(() => {
    console.log("*");
    valRef.current = defaultValue;
    autoFocus();
  }, [defaultValue]);

  // 自动聚焦
  const autoFocus = () => {
    inputRef.current.focus();
    inputRef.current.select();
  };

  const handleSubmit = () => {
    // 确认输入值是否正常
    if (!valRef.current) {
      // 不能为空
      autoFocus();
    } else {
      onSubmit(valRef.current);
    }
  };

  useImperativeHandle(ref, () => ({
    autoFocus,
  }));
  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      key={defaultValue}
      maxLength={maxLength}
      onChange={onInputChange}
      onKeyDown={onKeydown}
      onBlur={() => handleSubmit()}
      style={{
        width,
        border: "none",
        outline: "none",
        paddingLeft: 5,
      }}
    />
  );
});

export default InputBox;
