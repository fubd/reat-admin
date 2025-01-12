import {useEffect, useMemo, useReducer, useState} from 'react';
import {Button, Divider, Form, Input, Modal, Select, Space, Tag, Typography, message, notification} from 'antd';
import {ColumnsType} from 'antd/es/table/interface';
import dayjs from 'dayjs';
import {Grid, PageHeader} from '@components';
import * as services from './service';
import * as styles from './index.module.less';
import {MD5_SALT} from '@/utils/constants';
import CryptoJS from 'crypto-js';
function Index() {
  const [list, setList] = useState<API.UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [roleList, setRoleList] = useState<API.RoleItem[]>([]);
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

  const columns = useMemo<ColumnsType<API.UserItem>>(() => {
    return [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '联系方式',
        dataIndex: 'mobile',
        key: 'mobile',
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
        width: 280,
        render: (_, record) => (
          <Space split={<Divider type="vertical" />}>
            <a onClick={() => onEdit(record)}>编辑</a>
            <a onClick={() => updateUserBizStatus(record)}>{record.bizStatus === 0 ? '启用' : '禁用'}</a>
            <a onClick={() => resetPassword(record)}>
              <Typography.Text type="danger">重置密码</Typography.Text>
            </a>
            <a onClick={() => onDel(record)}>
              <Typography.Text type="danger">删除</Typography.Text>
            </a>
          </Space>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    fetchUserList();
    fetchRoleList();
  }, []);

  function fetchRoleList() {
    services.fetchRoleList({pageSize: 9999, pageNo: 1}).then((res) => {
      if (res.success) {
        setRoleList(res.data.data);
      }
    });
  }

  function resetPassword(record: API.UserItem) {
    Modal.confirm({
      title: '重置密码',
      content: '确定重置密码？',
      onOk() {
        services.updateUser({id: record.id, password: CryptoJS.MD5('123456' + MD5_SALT).toString()}).then((res) => {
          if (res.success) {
            notification.success({message: '重置密码成功'});
          }
        });
      },
    });
  }

  function fetchUserList(params?: {pageNo: number; pageSize: number}) {
    setLoading(true);
    services
      .fetchUserList({pageNo: params?.pageNo, pageSize: params?.pageSize})
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

  function deleteUser(id: string) {
    services.deleteUser(id).then((res) => {
      if (res.success) {
        fetchUserList();
      }
    });
  }

  function onEdit(record: API.UserItem) {
    setOpenModal(true);
    form.setFieldsValue(record);
  }

  function onAdd() {
    setOpenModal(true);
    form.resetFields();
  }

  function updateUserBizStatus(record) {
    services.updateUser({id: record.id, bizStatus: record.bizStatus === 1 ? 0 : 1}).then((res) => {
      if (res.success) {
        fetchUserList();
      }
    });
  }

  function onFinish() {
    form
      .validateFields()
      .then((values) => {
        const action = values.id ? 'updateUser' : 'createUser';
        const data = {
          ...values,
          roleIds: values.roleIds?.join(','),
        };
        services[action](data).then((res) => {
          if (res.success) {
            setOpenModal(false);
            fetchUserList();
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function onDel(record: API.UserItem) {
    Modal.confirm({
      title: '删除',
      content: `确定删除 ${record.username} ？`,
      onOk: () => {
        deleteUser(record.id);
      },
    });
  }

  function onTableChange(prePagination) {
    const nextPagination = {
      pageNo: prePagination.current,
      pageSize: prePagination.pageSize,
    };
    setPagination(nextPagination);
    fetchUserList(nextPagination);
  }

  return (
    <div>
      <PageHeader
        title="添加用户"
        toolBar={
          <Button type="primary" onClick={onAdd}>
            添加用户
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
          <Form.Item label="用户名" name="username" rules={[{required: true, message: '请输入名称'}]}>
            <Input placeholder="请输入用户名" allowClear />
          </Form.Item>
          <Form.Item shouldUpdate={(pre, next) => pre.id !== next.id} noStyle>
            {({getFieldValue}) => {
              if (!getFieldValue('id')) {
                return (
                  <Form.Item label="密码" name="password" rules={[{required: true, message: '请输入密码'}]}>
                    <Input placeholder="请输入密码" allowClear />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
          {/* <Form.Item label="密码" name="password" rules={[{required: true, message: '请输入密码'}]}>
            <Input placeholder="请输入密码" allowClear />
          </Form.Item> */}
          <Form.Item label="联系方式" name="mobile">
            <Input placeholder="请输入联系方式" allowClear />
          </Form.Item>
          <Form.Item label="角色" name="roleIds">
            <Select
              options={roleList.map((it) => ({label: it.name, value: it.id}))}
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              allowClear
              placeholder="请选择角色"
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
