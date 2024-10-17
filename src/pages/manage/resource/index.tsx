import {useEffect, useMemo, useReducer, useState} from 'react';
import {Button, Divider, Form, Input, InputNumber, Modal, Radio, Select, Space, Table, Typography} from 'antd';
import {ColumnsType} from 'antd/es/table/interface';
import dayjs from 'dayjs';
import * as services from './service';
import Picker, {getIconCom} from './Picker';
import * as styles from './index.module.less';
import {Grid, PageHeader} from '@components';
function Index() {
  const [list, setList] = useState<API.ResourceItem[]>([]);
  const [pagination, setPagination] = useReducer(
    (pre, next) => {
      return {
        ...pre,
        ...next,
      };
    },
    {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      showTotal: (total) => `共 ${total} 条`,
      showSizeChanger: true,
    },
  );
  const [firstList, setFirstList] = useState<API.ResourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openIconModal, setOpenIconModal] = useState(false);
  const [form] = Form.useForm();

  const columns = useMemo<ColumnsType<API.ResourceItem>>(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
      },
      {
        title: '图标',
        dataIndex: 'icon',
        key: 'icon',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (value) => {
          return dayjs(+value).format('YYYY-MM-DD HH:mm');
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space split={<Divider type="vertical" />}>
            <a onClick={() => onEdit(record)}>编辑</a>
            <a onClick={() => onDel(record)}>
              <Typography.Text type="danger">删除</Typography.Text>
            </a>
          </Space>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    fetchResourceList();
    fetchFirstResourceList();
  }, []);

  function fetchFirstResourceList() {
    services.fetchFirstResourceList().then((res) => {
      if (res.success) {
        setFirstList(res.data.data);
      }
    });
  }

  function fetchResourceList(params?: {pageNo: number; pageSize: number}) {
    setLoading(true);
    services
      .fetchResourceList({pageNo: params?.pageNo, pageSize: params?.pageSize})
      .then((res) => {
        if (res.success) {
          setList(res.data.data);
          setPagination({
            pageNo: res.data.pagination.currentPage,
            pageSize: res.data.pagination.perPage,
            total: res.data.pagination.total,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteResource(id: string) {
    services.deleteResource(id).then((res) => {
      if (res.success) {
        fetchResourceList();
      }
    });
  }

  function onEdit(record: API.ResourceItem) {
    setOpenModal(true);
    form.setFieldsValue(record);
  }

  function onAdd() {
    setOpenModal(true);
    form.resetFields();
    form.setFieldsValue({type: 1, level: 1});
  }

  function onFinish() {
    form
      .validateFields()
      .then((values) => {
        const action = values.id ? 'updateResource' : 'createResource';
        services[action](values).then((res) => {
          if (res.success) {
            setOpenModal(false);
            fetchResourceList();
            fetchFirstResourceList();
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function onDel(record: API.ResourceItem) {
    Modal.confirm({
      title: '删除',
      content: '确定删除该资源？',
      onOk: () => {
        deleteResource(record.id);
      },
    });
  }

  function onTableChange(prePagination) {
    const nextPagination = {
      pageNo: prePagination.current,
      pageSize: prePagination.pageSize,
    };
    setPagination(nextPagination);
    fetchResourceList(nextPagination);
  }

  return (
    <div>
      <PageHeader
        title="添加资源"
        toolBar={
          <Button type="primary" onClick={onAdd}>
            添加资源
          </Button>
        }
      />
      <Grid
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="id"
        pagination={pagination}
        onChange={onTableChange}
      />
      <Modal
        className={styles.formWrapper}
        open={openModal}
        title={form.getFieldValue('id') ? '编辑' : '添加'}
        onCancel={() => setOpenModal(false)}
        onOk={onFinish}
      >
        <Form form={form} layout="horizontal" labelCol={{span: 4}} wrapperCol={{span: 20}}>
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
                  <Select options={firstList.map((it) => ({label: it.name, value: it.id}))} />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, next) => prev.type !== next.type}>
            {({getFieldValue}) =>
              getFieldValue('type') === 1 && (
                <Form.Item label=" " name="icon" colon={false}>
                  <div className={styles.iconFormItem}>
                    {getFieldValue('icon') ? getIconCom(getFieldValue('icon')) : null}
                    <Button type="primary" onClick={() => setOpenIconModal(true)}>
                      选择图标
                    </Button>
                  </div>
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item name="id" hidden></Form.Item>
        </Form>
      </Modal>
      <Picker
        open={openIconModal}
        onCancel={() => setOpenIconModal(false)}
        onIconSelect={(icon) => form.setFieldsValue({icon})}
      />
    </div>
  );
}

export default Index;
