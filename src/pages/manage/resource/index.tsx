import {useEffect, useState} from 'react';
import {Button, Divider, Space, Typography, TableColumnsType} from 'antd';
import dayjs from 'dayjs';
import {Grid, PageHeader} from '@components';
import useGrid from '@/hooks/useGrid';
import Picker from './Picker';
import ResourceForm from './resourceForm';
import * as services from './service';
import * as styles from './index.module.less';
import {getMenuList} from '@/store/store';

const prefix = '资源';

function Index() {
  const [openPicker, setOpenPicker] = useState(false);
  const [firstResourceList, setFirstResourceList] = useState<API.ResourceItem[]>([]);

  const grid = useGrid(services, prefix);

  useEffect(() => {
    fetchFirstResourceList();
  }, []);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      searchable: true,
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      searchable: true,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (text) => {
        return text === 1 ? '父级' : '子级';
      },
      width: 100,
      selectable: true,
      selectOptions: [
        {label: '父级', value: '1'},
        {label: '子级', value: '2'},
      ],
      selectMode: 'multiple',
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
      width: 80,
      sorter: true,
    },
    {
      title: '更新时间',
      sorter: true,
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
          <a onClick={() => grid.openEdit({...record, iconType: record?.icon !== 'default'})}>编辑</a>
          <a onClick={() => grid.openRemove(record.id, record.name)}>
            <Typography.Text type="danger">删除</Typography.Text>
          </a>
        </Space>
      ),
    },
  ] as TableColumnsType<any>;

  function fetchFirstResourceList() {
    services.fetchFirstResourceList().then((res) => {
      if (res.success) {
        setFirstResourceList(res.data.data);
      }
    });
  }

  function beforeSubmit(values, postData) {
    if (!values.iconType) {
      values.icon = 'default';
    }
    delete values.iconType;
    postData(values);
  }

  return (
    <div>
      <PageHeader
        title="添加资源"
        toolBar={
          <Button type="primary" onClick={grid.openAdd}>
            添加资源
          </Button>
        }
      />
      <Grid
        grid={grid}
        columns={columns}
        services={services}
        beforeSubmit={beforeSubmit}
        afterSubmit={() => {
          fetchFirstResourceList();
          getMenuList({current: true});
        }}
        prefix={prefix}
        modalClassName={styles.formWrapper}
        renderForm={
          <ResourceForm form={grid} firstResourceList={firstResourceList} openPicker={() => setOpenPicker(true)} />
        }
      />
      <Picker
        open={openPicker}
        onCancel={() => setOpenPicker(false)}
        onIconSelect={(icon) => grid.setFieldValue('icon', icon)}
      />
    </div>
  );
}

export default Index;
