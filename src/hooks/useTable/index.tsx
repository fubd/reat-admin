import {useEffect, useReducer, useState} from 'react';
import {useMap, useUpdateEffect} from 'ahooks';
import {useSearchParams} from 'react-router-dom';
import _ from 'lodash';
import {ReloadOutlined} from '@ant-design/icons';

export interface IService {
  (params: {pageNo?: number; pageSize?: number; [key: string]: any}): Promise<any>;
}

interface IPagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  onChange: (p1: number, p2: number) => void;
}

export interface TableInstance {
  filter: (filters: Record<string, any>) => void;
  filterReset: (dataIndex: any) => void;
  filterResetAll: () => void;
  refresh: () => void;
  pagination: IPagination;
  loading: boolean;
  dataSource: any[];
  filteredText: Map<any, any>;
}

export default (service: IService) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isRotating, setIsRotating] = useState(false);

  const [pagination, setPagination] = useReducer(
    (pre: IPagination, next: Partial<IPagination>) => {
      return {
        ...pre,
        ...next,
      };
    },
    {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      onChange: (current, pageSize) => {
        setPagination({current, pageSize});
      },
    },
  );

  const [
    filteredText,
    {set: setFilteredText, remove: removeFilteredText, reset: resetFilteredText, setAll: setFilteredTextAll},
  ] = useMap<string, any>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const filtersStr = searchParams.get('q');
    if (filtersStr) {
      initStateWithSearchParams(filtersStr);
    } else {
      tableAction.refresh();
    }
  }, []);

  useUpdateEffect(() => {
    syncSearchParamsWithState();
    tableAction.refresh();
  }, [filteredText, pagination.current, pagination.pageSize]);

  function onReload() {
    setIsRotating(true);
    tableAction.refresh();
    setTimeout(() => setIsRotating(false), 500);
  }

  function showTotal(total) {
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <ReloadOutlined className={`grid-table-reload ${isRotating ? 'rotate' : ''}`} onClick={onReload} /> 共 {total}{' '}
        条
      </div>
    );
  }
  function getParams() {
    const {current, pageSize} = pagination;

    const params: any = {
      pageNo: current,
      pageSize,
      ...Object.fromEntries(filteredText),
    };

    if (params.$$sort) {
      params.orderKey = params.$$sort.split('_')[0];
      params.orderValue = {ascend: 'asc', descend: 'desc'}[params.$$sort.split('_')[1]];
      delete params.$$sort;
    }

    return params;
  }

  function getDataSource() {
    const params = getParams();

    setLoading(true);
    service(params)
      .then((res) => {
        if (res.success) {
          const {
            data: {
              data: dataSource,
              pagination: {currentPage: current, perPage: pageSize, total},
            },
          } = res;
          setDataSource(dataSource);
          setPagination({current, pageSize, total: total});
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function syncSearchParamsWithState() {
    const filters: Record<string, any> = {current: pagination.current, pageSize: pagination.pageSize};
    filteredText.forEach((value, key) => {
      filters[key] = value;
    });
    if (filters.current === 1 && filters.pageSize === 10) {
      delete filters.current;
      delete filters.pageSize;
    }
    for (const key in filters) {
      if (_.isVoid(filters[key])) {
        delete filters[key];
      }
    }
    if (Object.keys(filters).length) {
      searchParams.set('q', JSON.stringify(filters));
      setSearchParams(searchParams);
    } else {
      searchParams.delete('q');
      setSearchParams(searchParams);
    }
  }

  function initStateWithSearchParams(filtersStr) {
    const filters = JSON.parse(filtersStr);
    Object.keys(filters).forEach((key) => {
      if (key === 'current' || key === 'pageSize') {
        setPagination({[key]: filters[key]});
      } else {
        setFilteredText(key, filters[key]);
      }
    });
  }

  function handleFilter(filters: Record<string, any>) {
    setFilteredTextAll(new Map(Object.entries(filters)));
    setPagination({current: 1});
  }

  function handleReset(dataIndex: any) {
    removeFilteredText(dataIndex);
  }

  function handleResetAll() {
    resetFilteredText();
    setPagination({current: 1});
  }

  const tableAction = {
    filter: handleFilter,
    filterReset: handleReset,
    filterResetAll: handleResetAll,
    refresh: getDataSource,
  };

  return [
    {
      ...tableAction,
      pagination: Object.assign(pagination, {showTotal}),
      loading,
      dataSource,
      filteredText,
    },
  ];
};
