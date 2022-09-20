export function upperFirst(string: string) {
  return string[0].toUpperCase() + string.substr(1);
}

export function getKeyCode(evt: any) {
  return evt.keyCode || evt.witch;
}

export function isInputValue(e: any) {
  const keyCode = getKeyCode(e);

  // a-zA-Z
  if (keyCode >= 65 && keyCode <= 90) return true;

  // 0-9 以及其上面的符号
  if (keyCode >= 48 && keyCode <= 57) return true;

  // 小键盘区域 (除回车外)
  if (keyCode !== 108 && keyCode >= 96 && keyCode <= 111) return true;

  return false;
}

export function isIntendToInput(e: any) {
  const keyCode = getKeyCode(e);

  if (e.ctrlKey || e.metaKey || e.altKey) return false;

  if (isInputValue(e)) return true;

  // 输入法
  if (keyCode === 229 || keyCode === 0) return true;

  return false;
}
