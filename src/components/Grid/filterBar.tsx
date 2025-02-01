import {GridInstance} from '@/hooks/useGrid';
import {Tag, TableColumnType} from 'antd';

interface IProps {
  filteredText: Map<any, any>;
  columns: TableColumnType[];
  grid: GridInstance;
}
function FilterBar({filteredText, columns, grid}: IProps) {
  return (
    <div style={{marginBottom: 8}}>
      {Array.from(filteredText).map(([key, value]) => {
        if (key === '$$sort') {
          const [key, nValue] = value.split('_');
          const col = columns.find((it) => it.key === key) as TableColumnType;
          return (
            <Tag closable key={key} style={{padding: '2px 16px'}} onClose={() => grid.filterReset('$$sort')}>
              {col?.title}: {{ascend: '升序', descend: '降序'}[nValue]}
            </Tag>
          );
        }
        const col = columns.find((it) => it.key === key) as TableColumnType;

        const getSelectLabel = (selectKey) =>
          col.selectOptions?.find((it) => it.value?.toString?.() === selectKey?.toString())?.label as string;

        let nValue = '';
        if (col.selectable) {
          if (col.selectMode === 'multiple') {
            nValue = value
              .split(',')
              .reduce((acc, cur, i) => (i === 0 ? getSelectLabel(cur) : `${acc}、${getSelectLabel(cur)}`), '');
          } else {
            nValue = getSelectLabel(value);
          }
        } else {
          nValue = value;
        }

        return (
          <Tag closable key={key} style={{padding: '2px 16px'}} onClose={() => grid.filterReset(key)}>
            {col?.title as string}: {nValue}
          </Tag>
        );
      })}
      {!!filteredText.size && <a onClick={grid.filterResetAll}>清空</a>}
    </div>
  );
}

export default FilterBar;
