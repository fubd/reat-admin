import {useSize, useThrottleFn} from 'ahooks';
import {useEffect, useState} from 'react';

export default (tableState) => {
  const size = useSize(document.documentElement);
  const [scrollY, setScrollY] = useState<any>('auto');

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
      }
    },
    {wait: 200},
  );

  useEffect(run, [winH, winW, tableState.dataSource]);

  return {scrollY};
};
