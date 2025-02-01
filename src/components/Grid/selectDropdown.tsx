import {useSet} from 'ahooks';
import {Button, Checkbox, Empty, Input, Select, Space, TableColumnType} from 'antd';
import {useEffect, useState} from 'react';

interface IProps {
  col: TableColumnType;
  selectedKeys: any;
  setSelectedKeys: any;
  confirm: any;
  clearFilters: any;
}
function SelectDropdown({col, selectedKeys, setSelectedKeys, confirm, clearFilters}: IProps) {
  const [searchText, setSearchText] = useState('');
  const [values, {add, remove, reset}] = useSet<any>([]);

  useEffect(() => {
    if (col.selectMode === 'multiple') {
      if (typeof selectedKeys?.[0] === 'string') {
        selectedKeys?.[0].split(',').forEach((it) => add(it));
      } else if (Array.isArray(selectedKeys)) {
        reset();
      }
    }
  }, [selectedKeys, col.selectMode]);

  const list = col.selectOptions
    ?.filter((it) => (it.label as string)?.includes(searchText))
    .map((it) => (
      <div key={it.value}>
        <Checkbox
          value={it.value}
          checked={values.has(it.value)}
          onChange={(e) => (e.target.checked ? add(it.value) : remove(it.value))}
        >
          {it.label}
        </Checkbox>
      </div>
    ));

  return (
    <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
      {col.selectMode === 'multiple' ? (
        <div>
          <Input type="text" placeholder="在筛选项中搜索" onChange={(e) => setSearchText(e.target.value)} />
          <div
            style={{
              margin: '8px 0',
              height: 120,
              overflowY: 'auto',
              borderTop: '1px solid rgba(0,0,0,.06)',
              borderBottom: '1px solid rgba(0,0,0,.06)',
              padding: '8px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {list?.length ? list : <Empty style={{margin: 0, width: '100%'}} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </div>
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedKeys([Array.from(values).join()] as string[]);
                confirm();
              }}
            >
              确定
            </Button>
            <Button size="small" onClick={() => clearFilters?.({confirm: true, closeDropdown: true})}>
              重置
            </Button>
          </Space>
        </div>
      ) : (
        <Select
          showSearch
          filterOption={(input, option) =>
            ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
          }
          placeholder={col.title as string}
          value={selectedKeys[0] ? `${selectedKeys[0]}` : undefined}
          options={col.selectOptions}
          style={{width: '100%'}}
          onChange={(v) => {
            setSelectedKeys([v] as string[]);
            confirm();
          }}
          allowClear
          onClear={() => clearFilters?.({confirm: true, closeDropdown: true})}
          mode={col.selectMode}
        />
      )}
    </div>
  );
}

export default SelectDropdown;
