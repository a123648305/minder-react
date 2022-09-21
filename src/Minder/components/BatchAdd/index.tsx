import React, { Fragment } from "react";
import { Button, Modal, Spin, message, Upload, Result } from "antd";
import styles from "./index.module.less";

const { Dragger } = Upload;
const originState = {
  steps: 1,
  file: null,
  fileTest: true,
  fileResult: null,
  dragenter: false,
  uploading: false,
  importType: "INSERT",
  percent: 0,
};

type PropsType = {
  title: string;
  width?: number | string;
  visible: boolean;
  stepsList: Array<{ value: number; label: string; render?: React.ReactNode }>;
  accept?: string; // 默认只接受xlsx格式
  templateTip: string;
  templateUrl?: string;
  failedFileUrl?: string;
  footer?: React.ReactNode[];
  resultDesc?: {
    title: string;
    subTitle: string;
    status: "success" | "error" | "info" | "warning";
  };
  onCancel: () => void;
  onUploadFile: (file: File) => Promise<any>;
  onUploadSucess: (result: any) => void;
};

type StatesType = {
  steps: number;
  file: File | null;
  fileTest: boolean;
  fileResult: any;
  dragenter: boolean;
  uploading: boolean;
  importType: string;
  percent: number;
};

export default class BatchAdd extends React.Component<PropsType, StatesType> {
  constructor(props: any) {
    super(props);
    this.state = { ...Object.assign({}, originState) };
  }

  componentDidMount() {
    // this.setState({
    //   ...Object.assign({}, originState),
    // });
  }

  readFile = (file: any) => {
    if (file.name.slice(file.name.lastIndexOf(".") + 1) !== "xlsx") {
      message.warning("只支持 xlsx 格式,请重新上传");
      this.setState({ fileTest: false });
    } else {
      this.setState({ file, fileTest: true }, () => {
        // this.upLoadFile();
      });
    }
  };

  downLoadFile = () => {
    // 兼容开发环境和生产环境
    const proxy = process.env.NODE_ENV === "development" ? "proxy" : "api";
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    // anchor.href = `/${proxy}/customer-profile/contact/v2/download/template?_token=${
    //   localStorage.getItem('authorization') || localStorage.getItem(CEMConst.store.token)
    // }&projectId=${this.props.projectId}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  /**
   *@description 上传文件 ，
   */
  upload = () => {
    const { onUploadFile, onUploadSucess } = this.props;
    const { file } = this.state;
    if (!file) return;
    this.setState(
      {
        uploading: true,
      },
      async () => {
        try {
          const response = await onUploadFile(file);
          console.log(response, "response");
          this.setState({
            steps: this.state.steps + 1,
            fileResult: response,
            uploading: false,
          });
          onUploadSucess && onUploadSucess(response);
        } catch (error) {
          this.setState({ fileResult: null, uploading: false });
          message.error("上传出错，请检查文件格式或联系管理员");
        }
      }
    );
  };

  step1 = () => {
    // 模拟进度条
    const { fileTest, file } = this.state;
    const { templateTip, accept = ".xls, .xlsx," } = this.props;
    const props = {
      name: "file",
      multiple: true,
      action: "",
      accept,
      showUploadList: false,
      beforeUpload: (file: File) => {
        this.readFile(file);
        return false; // 手动上传 不用默认上传
      },
      onChange() {},
      onDrop() {},
    };

    return (
      <Dragger {...props} className="upload_wrap">
        {/* 文件选择输入框 END */}
        {!file && (
          <Fragment>
            <div className="upload">
              <div className="INSERT">
                <img
                  // src={require("@cem/entity-resource/images/import/file.png")}
                  src={require("./import/file.png")}
                  alt=""
                />
              </div>
              <b>
                <span>点击</span>
                或将EXCEL文件拖拽到这里上传
              </b>
              <p
                className="download_template"
                onClick={(e) => this.downLoadFile()}
              >
                下载标准模板
              </p>
              <div
                className="accept"
                style={{ color: fileTest ? "" : "#D96969" }}
              >
                {templateTip ||
                  `（只支持xlsx格式，单次上传不超过5000条，若超过5000条，请分批上传）`}
              </div>
            </div>
          </Fragment>
        )}
        {file && (
          <div className="file_name">
            <img
              // src={require("@cem/entity-resource/images/import/excel.png")}
              src={require("./import/excel.png")}
              alt=""
            />
            <div>{file.name}</div>
            <span>重新上传</span>
          </div>
        )}
      </Dragger>
    );
  };

  // 得到结果图
  step2 = () => {
    const { fileResult } = this.state;
    const { failedFileUrl, resultDesc } = this.props;

    return (
      <div className="result_wrapper">
        <Result
          status={resultDesc?.status || "success"}
          title={<p className="result_text">{resultDesc?.title}</p>}
          subTitle={
            resultDesc?.subTitle ||
            (failedFileUrl && (
              <a
                className="result_faile_text"
                // href={`/api/customer-profile/contact/v2/download/excel?_token=${
                //   localStorage.getItem("authorization") ||
                //   localStorage.getItem(CEMConst.store.token)
                // }&projectId=${this.props.projectId}&fileName=${fileName}`}
                href={failedFileUrl}
                target="_blank"
                rel="noreferrer"
              >
                查看失败日志
              </a>
            ))
          }
        />
      </div>
    );
  };

  pre = () => {
    this.setState({ steps: this.state.steps - 1 });
  };

  next = (type: string) => {
    this.setState({
      steps: this.state.steps + 1,
      importType: type,
    });
  };

  _handleOnCancel = () => {
    const { steps } = this.state;
    const { onCancel } = this.props;
    this.setState({
      ...Object.assign({}, originState),
    });

    steps === 2 && onCancel();
  };

  rendStepsContext = (steps: number) => {
    const { stepsList } = this.props;

    // 外部传入了自定义渲染内容 则用外部 否则用默认
    const renderItem = stepsList.find((v) => v.value === steps);
    if (renderItem?.render) {
      return renderItem?.render;
    }

    switch (steps) {
      case 1:
        return this.step1();
      case 2:
        return this.step2();
      default:
        return null;
    }
  };

  renderFooter = () => {
    const { steps, file, uploading } = this.state;
    if (steps === 2) {
      return null;
    }
    return (
      <>
        {steps < 2 && (
          <Button onClick={steps === 1 ? this._handleOnCancel : this.pre}>
            {steps === 1 ? "取消" : "上一步"}
          </Button>
        )}
        <Button
          type="primary"
          disabled={!file || uploading}
          onClick={() => this.upload()}
        >
          确定上传
        </Button>
      </>
    );
  };

  render() {
    const { steps, uploading } = this.state;
    const { width, stepsList, visible, footer, title } = this.props;
    return (
      <div className="np_add_contact_batch_add">
        <Modal
          className={styles.batch_add_dialog}
          title={title}
          visible={visible}
          onCancel={this._handleOnCancel}
          width={width}
          footer={footer || this.renderFooter()}
        >
          <Spin spinning={uploading}>
            <div className="steps_warper">
              {stepsList.map(
                (item: { value: string | number; label: string }) => (
                  <div
                    className={
                      steps === item.value ? "setps_item sel" : "setps_item"
                    }
                  >
                    <div className="steps_item_circle">
                      <span>{item.value}</span>
                      <p>{item.label}</p>
                    </div>
                  </div>
                )
              )}
            </div>
            {this.rendStepsContext(steps)}
          </Spin>
        </Modal>
      </div>
    );
  }
}
