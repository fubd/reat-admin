import {GridInstance} from '@/hooks/useGrid';
import {Form, Input, Select} from 'antd';

interface IProps {
  resourceList: API.ResourceItem[];
  form: GridInstance;
}

function RoleForm({resourceList, form}: IProps) {
  return (
    <Form
      initialValues={{type: 1, level: 1, iconType: false}}
      form={form}
      layout="horizontal"
      labelCol={{span: 4}}
      wrapperCol={{span: 20}}
    >
      <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入名称'}]}>
        <Input placeholder="请输入名称" allowClear />
      </Form.Item>
      <Form.Item label="资源" name="resourceIds">
        <Select
          options={resourceList.map((it) => ({label: it.name, value: it.id}))}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          allowClear
          placeholder="请选择资源"
          mode="multiple"
        />
      </Form.Item>
      <Form.Item name="id" hidden>
        <Input type="hidden" />
      </Form.Item>
    </Form>
  );
}

export default RoleForm;
