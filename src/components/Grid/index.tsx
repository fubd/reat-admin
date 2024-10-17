import {useSize, useThrottleFn} from 'ahooks';
import {Table, TableProps} from 'antd';
import {useEffect, useState} from 'react';

function Grid(props: TableProps<any>) {
  const size = useSize(document.documentElement);
  const [scrollY, setScrollY] = useState<any>('auto');
  const [data, setData] = useState<any[]>([]);

  const {height: winH, width: winW} = size || {width: 0, height: 0};

  const {run} = useThrottleFn(
    () => {
      const tableBody = document.querySelector('.grid-table .ant-table-body') as HTMLElement | null;
      const pagination = document.querySelector('.grid-table .ant-pagination') as HTMLElement | null;

      if (tableBody && pagination) {
        const top = tableBody.getBoundingClientRect().top;
        const style = window.getComputedStyle(pagination, null);
        const scrollY =
          winH - 16 - (top + parseInt(style.marginTop) + parseInt(style.marginBottom) + parseInt(style.height));
        setScrollY(scrollY);
        setData([...(props.dataSource ?? [])]);
      }
    },
    {wait: 200},
  );

  useEffect(run, [winH, winW, props.dataSource?.length]);

  return <Table {...props} dataSource={data} scroll={{y: scrollY}} className="grid-table" />;
}

export default Grid;
