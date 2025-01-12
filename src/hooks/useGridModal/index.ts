import {useReducer} from 'react';

export interface ModalState {
  title: '添加' | '编辑';
  open: boolean;
  type: 'add' | 'edit';
}

export default () => {
  const [state, setState] = useReducer(
    (pre: ModalState, action: 'add' | 'edit' | 'cancel'): ModalState => {
      switch (action) {
        case 'add':
          return {title: '添加', open: true, type: 'add'};
        case 'edit':
          return {title: '编辑', open: true, type: 'edit'};
        case 'cancel':
          return {...pre, open: false};
        default:
          return pre;
      }
    },
    {open: false, title: '添加', type: 'add'},
  );

  return [state, setState] as const;
};
