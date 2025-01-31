import 'antd/es/table';
import {DefaultOptionType} from 'antd/es/select';

declare module 'antd' {
  interface TableColumnType<RecordType = any> {
    searchable?: boolean;
    selectable?: boolean;
    selectOptions?: DefaultOptionType[];
  }
}

declare module 'lodash' {
  interface LoDashStatic {
    isVoid(value: any): boolean;
  }
}

declare module 'valtio' {
  function useSnapshot<T extends object>(p: T): T;
}
