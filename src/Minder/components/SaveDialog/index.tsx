import { Form, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
const { Option } = Select;
type PropsType = {
  nameLabel: string;
  formData: object | undefined;
  modeOptions: any[];
  onOK: (data: any) => void;
  onCancel: () => void;
};

const SaveDialog: React.FC<PropsType> = ({ nameLabel, formData, modeOptions, onCancel, onOK }) => {
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
        console.log(res, 'form');
        onOK(res);
      })
      .catch();
  };

  return (
    <Modal
      title="绑定模块"
      okText="确认"
      cancelText="取消"
      maskClosable={false}
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form}>
        <Form.Item
          label={nameLabel}
          name="title"
          rules={[{ required: true, message: '名称不能为空!' }]}
        >
          <Input maxLength={100} />
        </Form.Item>

        <Form.Item label="绑定模块" name="moduleIds">
          <Select placeholder="请选择" mode="multiple" allowClear className="bind_module">
            {modeOptions.map((item: { value: string | number; label: string }) => (
              <Option
                value={item.value}
                key={item.value}
                label={item.label}
                className="bind_module_select"
              >
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveDialog;
