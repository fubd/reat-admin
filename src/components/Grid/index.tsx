import useGrid, {GridInstance} from '@/hooks/useGrid';
import {FilterOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Input, Modal, Space, Table, TableColumnType, TableColumnsType} from 'antd';
import _ from 'lodash';
import {cloneElement, useMemo} from 'react';
import Highlighter from 'react-highlight-words';
import SelectDropdown from './selectDropdown';
import FilterBar from './filterBar';

interface Services {
  query: any;
  add: any;
  edit: any;
  remove: any;
  [key: string]: any;
}

interface IProps<T> {
  columns: TableColumnsType<T>;
  prefix: string;
  renderForm: JSX.Element;
  services: Services;
  modalClassName?: string;
  grid?: GridInstance;
  beforeSubmit?: (values: any, postData: (params: any) => void) => void;
  afterSubmit?: () => void;
}

function Grid<T extends Record<string, any>>({
  services,
  columns,
  prefix,
  modalClassName,
  renderForm,
  beforeSubmit,
  afterSubmit,
  grid: gridInstance,
}: IProps<T>) {
  const grid = gridInstance || useGrid(services, prefix);

  const {scrollY, modalState, closeModal, filteredText, dataSource, loading, pagination} = grid;

  const nextColumns = useMemo(() => {
    return columns.map((it: TableColumnType<T>) => {
      const dataIndex = it.dataIndex as string;
      const commonProps = {
        filteredValue: filteredText.get(dataIndex) ? [filteredText.get(dataIndex)] : [],
        filtered: filteredText.get(dataIndex) ? true : false,
      };

      if (it.searchable) {
        return {
          ...it,
          ...commonProps,
          filterIcon: (filtered) => <SearchOutlined style={{color: filtered ? '#4072EE' : undefined}} />,
          filterDropdown: ({selectedKeys, setSelectedKeys, confirm, clearFilters}: any) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
              <Input
                placeholder={it.title as string}
                value={`${selectedKeys[0] || ''}`}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => confirm()}
                style={{marginBottom: 8, display: 'block'}}
              />
              <Space>
                <Button type="primary" size="small" onClick={() => confirm()}>
                  搜索
                </Button>
                <Button size="small" onClick={() => clearFilters?.({confirm: true, closeDropdown: true})}>
                  重置
                </Button>
              </Space>
            </div>
          ),
          render: (text) =>
            filteredText.has(dataIndex) ? (
              <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[filteredText.get(dataIndex)]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
              />
            ) : (
              text
            ),
        };
      }
      if (it.selectable) {
        return {
          ...it,
          ...commonProps,
          filterIcon: (filtered: boolean) => <FilterOutlined style={{color: filtered ? '#4072EE' : undefined}} />,
          filterDropdown: ({selectedKeys, setSelectedKeys, confirm, clearFilters}: any) => (
            <SelectDropdown
              col={it}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              confirm={confirm}
              clearFilters={clearFilters}
            />
          ),
        };
      }

      if (it.sorter) {
        if (!filteredText.get('$$sort')) {
          return {...it, sortOrder: undefined};
        } else {
          const [key, value] = filteredText.get('$$sort').split('_');
          if (key === dataIndex) {
            return {
              ...it,
              sortOrder: value,
            };
          }
        }
      }
      return it;
    }) as TableColumnsType<T>;
  }, [columns, filteredText]);

  function onTableChange(__, filters, sorter, {action}) {
    if (action === 'sort' || action === 'filter') {
      grid.filter(
        _.chain({...filters, ...(sorter.order ? {$$sort: [sorter.columnKey + '_' + sorter.order]} : {})})
          .mapValues((v) => (Array.isArray(v) ? v.join() : undefined))
          .omitBy(_.isVoid)
          .value(),
      );
    }
  }

  function postData(params) {
    const service = modalState.type === 'add' ? services.add : services.edit;
    service(params).then((res) => {
      if (res.success) {
        closeModal();
        grid.resetFields();
        grid.refresh();
        afterSubmit?.();
      }
    });
  }

  function onSubmit() {
    grid
      .validateFields()
      .then((values) => {
        if (beforeSubmit) {
          beforeSubmit(values, postData);
          return;
        }
        postData(values);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <div>
      <FilterBar columns={columns} grid={grid} filteredText={filteredText} />
      <Table
        pagination={pagination}
        loading={loading}
        dataSource={scrollY === 'auto' ? [] : dataSource}
        onChange={onTableChange}
        columns={nextColumns}
        rowKey="id"
        scroll={{y: scrollY}}
        className="grid-table"
      />
      <Modal
        title={modalState.title + prefix}
        open={modalState.open}
        className={modalClassName || ''}
        onCancel={() => {
          grid.resetFields();
          closeModal();
        }}
        onOk={onSubmit}
        bodyStyle={{marginBottom: -24}}
      >
        {cloneElement(renderForm, {grid})}
      </Modal>
    </div>
  );
}

export default Grid;
