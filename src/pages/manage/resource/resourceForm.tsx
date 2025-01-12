import {Button, Form, FormInstance, Input, InputNumber, Radio, Select, Switch} from 'antd';
import * as styles from './index.module.less';
import {getIconCom} from './Picker';

interface IProps {
  openPicker: () => void;
  form?: FormInstance;
  firstResourceList: API.ResourceItem[];
}

export interface ResourceFormRef {
  fetchFirstResourceList: () => void;
}

function ResourceForm({openPicker, firstResourceList, form}: IProps) {
  return (
    <Form form={form as FormInstance} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 20}}>
      <Form.Item label="类型" name="type">
        <Select options={[{label: '菜单', value: 1}]} />
      </Form.Item>
      <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入名称'}]}>
        <Input placeholder="请输入名称" allowClear />
      </Form.Item>
      <Form.Item label="路径" name="path">
        <Input placeholder="请输入路径" allowClear />
      </Form.Item>
      <Form.Item label="排序" name="sort">
        <InputNumber precision={0} />
      </Form.Item>
      <Form.Item label="级别" name="level">
        <Radio.Group>
          <Radio value={1}>父级</Radio>
          <Radio value={2}>子级</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prev, next) => prev.level !== next.level}>
        {({getFieldValue}) =>
          getFieldValue('level') === 2 && (
            <Form.Item label="父级" name="pid">
              <Select options={firstResourceList.map((it) => ({label: it.name, value: it.id}))} />
            </Form.Item>
          )
        }
      </Form.Item>

      <Form.Item label="自定义标签" name="iconType" valuePropName="checked">
        <Switch></Switch>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prev, next) =>
          prev.type !== next.type || prev.icon !== next.icon || prev.iconType !== next.iconType
        }
      >
        {({getFieldValue}) =>
          getFieldValue('type') === 1 &&
          getFieldValue('iconType') && (
            <Form.Item label=" " name="icon" colon={false}>
              <div className={styles.iconFormItem}>
                {getFieldValue('icon') ? getIconCom(getFieldValue('icon')) : null}
                <Button onClick={openPicker}>选择图标</Button>
                {/* <Button onClick={() => setFieldValue('icon', 'custom-default')}>使用默认图标</Button> */}
              </div>
            </Form.Item>
          )
        }
      </Form.Item>

      <Form.Item name="id" hidden>
        <Input type="hidden" />
      </Form.Item>
    </Form>
  );
}

export default ResourceForm;
