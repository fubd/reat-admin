import useGrid, {GridInstance} from '@/hooks/useGrid';
import {FilterOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Input, Modal, Select, Space, Table, TableColumnType, TableColumnsType, Tag} from 'antd';
import _ from 'lodash';
import {cloneElement, useMemo} from 'react';
import Highlighter from 'react-highlight-words';

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

  const {scrollY, modalState, cancelModal} = grid;
  const {filteredColumn, filteredText, ...tableState} = grid.getTableState();

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
                <Button size="small" onClick={() => clearFilters?.({confirm: true})}>
                  重置
                </Button>
              </Space>
            </div>
          ),
          render: (text) =>
            filteredColumn.has(dataIndex) ? (
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
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
              <Select
                showSearch
                filterOption={(input, option) =>
                  ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
                }
                placeholder={it.title as string}
                value={selectedKeys[0] ? `${selectedKeys[0]}` : undefined}
                options={it.selectOptions}
                style={{width: '100%'}}
                onSelect={(v) => {
                  setSelectedKeys([v] as string[]);
                  confirm();
                }}
                allowClear
                onClear={() => clearFilters?.({confirm: true, closeDropdown: true})}
              />
            </div>
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
  }, [columns, filteredText, filteredColumn]);

  function onTableChange(pagination, filters, sorter) {
    if (
      pagination.current === tableState.pagination.current &&
      pagination.pageSize === tableState.pagination.pageSize
    ) {
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
        cancelModal();
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
      <div style={{marginBottom: 8}}>
        {Array.from(filteredText).map(([key, value]) => {
          if (key === '$$sort') {
            const [key, nValue] = value.split('_');
            const col = columns.find((it) => it.key === key) as TableColumnType<T>;
            return (
              <Tag closable key={key} style={{padding: '2px 16px'}} onClose={() => grid.filterReset('$$sort')}>
                {col?.title}: {{ascend: '升序', descend: '降序'}[nValue]}
              </Tag>
            );
          }
          const col = columns.find((it) => it.key === key) as TableColumnType<T>;
          const nValue = col?.selectable
            ? col.selectOptions?.find((it) => it.value?.toString?.() === value?.toString())?.label
            : value;
          return (
            <Tag closable key={key} style={{padding: '2px 16px'}} onClose={() => grid.filterReset(key)}>
              {col?.title}: {nValue}
            </Tag>
          );
        })}
        {!!filteredText.size && <a onClick={grid.filterResetAll}>清空</a>}
      </div>
      <Table
        {...tableState}
        dataSource={scrollY === 'auto' ? [] : tableState.dataSource}
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
        onCancel={cancelModal}
        onOk={onSubmit}
      >
        {cloneElement(renderForm, {grid})}
      </Modal>
    </div>
  );
}

export default Grid;
