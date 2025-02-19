import {useEffect, useMemo, useState} from 'react';
import {Button, Divider, Space, Tag, Typography} from 'antd';
import {ColumnsType} from 'antd/es/table/interface';
import dayjs from 'dayjs';
import {Grid, PageHeader} from '@components';
import useGrid from '@/hooks/useGrid';
import RoleForm from './roleForm';
import * as services from './service';
import {getMenuList} from '@/store/store';

const prefix = '角色';

function Index() {
  const [resourceList, setResourceList] = useState<API.ResourceItem[]>([]);

  const grid = useGrid(services, prefix);

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
            <a onClick={() => grid.openEdit(record)}>编辑</a>
            <a onClick={() => updateRoleBizStatus(record)}>{record.bizStatus === 0 ? '启用' : '禁用'}</a>

            <a onClick={() => grid.openRemove(record.id, record.name)}>
              <Typography.Text type="danger">删除</Typography.Text>
            </a>
          </Space>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    // fetchRoleList();
    fetchResourceList();
  }, []);

  function fetchResourceList() {
    services.fetchResourceList({pageSize: 9999, pageNo: 1}).then((res) => {
      if (res.success) {
        setResourceList(res.data.data);
      }
    });
  }

  function updateRoleBizStatus(record) {
    // services.updateRole({id: record.id, bizStatus: record.bizStatus === 1 ? 0 : 1}).then((res) => {
    //   if (res.success) {
    //     // fetchRoleList();
    //   }
    // });
  }

  // function onFinish() {
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       const action = values.id ? 'updateRole' : 'createRole';
  //       const data = {
  //         ...values,
  //         resourceIds: values.resourceIds?.join(','),
  //       };
  //       services[action](data).then((res) => {
  //         if (res.success) {
  //           setOpenModal(false);
  //           fetchRoleList();
  //         }
  //       });
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }

  function beforeSubmit(values, postData) {
    postData({...values, resourceIds: values.resourceIds?.join(',')});
  }

  return (
    <div>
      <PageHeader
        title="添加角色"
        toolBar={
          <Button type="primary" onClick={grid.openAdd}>
            添加角色
          </Button>
        }
      />
      <Grid
        grid={grid}
        columns={columns}
        services={services}
        beforeSubmit={beforeSubmit}
        afterSubmit={() => {
          getMenuList({current: true});
        }}
        prefix={prefix}
        renderForm={<RoleForm form={grid} resourceList={resourceList} />}
      />
    </div>
  );
}

export default Index;
