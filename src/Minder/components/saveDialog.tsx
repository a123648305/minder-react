import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";

type PropsType = {
  formData: object | undefined;
  modeOptions: any[];
  onOK: (data: any) => void;
  onCancel: () => void;
};

const SaveDialog: React.FC<PropsType> = ({
  formData,
  modeOptions,
  onCancel,
  onOK,
}) => {
  const [form] = Form.useForm();
  const [visible, SetVisible] = useState(false);

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(JSON.parse(JSON.stringify(formData)));
    }
    SetVisible(!!formData);
  }, [formData]);

  const handleOk = () => {
    form
      .validateFields()
      .then((res) => {
        console.log(res, "form");
        onOK(res);
      })
      .catch();
  };

  return (
    <Modal
      title="绑定模块"
      okText="确认"
      cancelText="取消"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form}>
        <Form.Item
          label="业务视角名称"
          name="title"
          rules={[{ required: true, message: "名称不能为空!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="绑定模块" name="moduleIds">
          <Select
            options={modeOptions}
            placeholder="请选择"
            mode="multiple"
            allowClear
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveDialog;
