import {useEffect, useMemo, useReducer, useState} from 'react';
import {Button, Divider, Form, Input, Modal, Select, Space, Tag, Typography} from 'antd';
import {ColumnsType} from 'antd/es/table/interface';
import dayjs from 'dayjs';
import {Grid, PageHeader} from '@components';
import * as services from './service';
import * as styles from './index.module.less';
function Index() {
  const [list, setList] = useState<API.RoleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resourceList, setResourceList] = useState<API.ResourceItem[]>([]);
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
  const [form] = Form.useForm();

  const columns = useMemo<ColumnsType<API.RoleItem>>(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'bizStatus',
        key: 'bizStatus',
        render: (value) => {
          return value === 1 ? <Tag color="success">启用</Tag> : <Tag color="error">禁用</Tag>;
        },
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
            <a onClick={() => updateRoleBizStatus(record)}>{record.bizStatus === 0 ? '启用' : '禁用'}</a>

            <a onClick={() => onDel(record)}>
              <Typography.Text type="danger">删除</Typography.Text>
            </a>
          </Space>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    fetchRoleList();
    fetchResourceList();
  }, []);

  function fetchResourceList() {
    services.fetchResourceList({pageSize: 9999, pageNo: 1}).then((res) => {
      if (res.success) {
        setResourceList(res.data.data);
      }
    });
  }

  function fetchRoleList(params?: {pageNo: number; pageSize: number}) {
    setLoading(true);
    services
      .fetchRoleList({pageNo: params?.pageNo, pageSize: params?.pageSize})
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

  function deleteRole(id: string) {
    services.deleteRole(id).then((res) => {
      if (res.success) {
        fetchRoleList();
      }
    });
  }

  function onEdit(record: API.RoleItem) {
    setOpenModal(true);
    form.setFieldsValue(record);
  }

  function onAdd() {
    setOpenModal(true);
    form.resetFields();
  }

  function updateRoleBizStatus(record) {
    services.updateRole({id: record.id, bizStatus: record.bizStatus === 1 ? 0 : 1}).then((res) => {
      if (res.success) {
        fetchRoleList();
      }
    });
  }

  function onFinish() {
    form
      .validateFields()
      .then((values) => {
        const action = values.id ? 'updateRole' : 'createRole';
        const data = {
          ...values,
          resourceIds: values.resourceIds?.join(','),
        };
        services[action](data).then((res) => {
          if (res.success) {
            setOpenModal(false);
            fetchRoleList();
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function onDel(record: API.RoleItem) {
    Modal.confirm({
      title: '删除',
      content: '确定删除该角色？',
      onOk: () => {
        deleteRole(record.id);
      },
    });
  }

  function onTableChange(prePagination) {
    const nextPagination = {
      pageNo: prePagination.current,
      pageSize: prePagination.pageSize,
    };
    setPagination(nextPagination);
    fetchRoleList(nextPagination);
  }

  return (
    <div>
      <PageHeader
        title="添加角色"
        toolBar={
          <Button type="primary" onClick={onAdd}>
            添加角色
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
          <Form.Item name="id" hidden></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Index;
