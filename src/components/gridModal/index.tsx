import {FormInstance, Modal} from 'antd';
import {ReactElement, useImperativeHandle, useReducer} from 'react';
import {GridRef} from '../grid';

interface IState {
  title: '添加' | '编辑';
  open: boolean;
  type: 'add' | 'edit';
}

interface IProps {
  _ref: React.Ref<GridModalRef>;
  children: ReactElement;
  prefix: string;
  form: FormInstance;
  grid: GridRef;
  services: Array<(arg: any) => Promise<any>>;
  className?: string;
  getParams?: (arg: any) => any;
  serviceCb?: () => void;
}

export interface GridModalRef {
  edit: () => void;
  add: () => void;
}

function GridModal({_ref, children, prefix, className, form, grid, services, getParams, serviceCb}: IProps) {
  const [state, setState] = useReducer(
    (pre: IState, action: 'add' | 'edit' | 'cancel'): IState => {
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

  const {open, title, type} = state;

  useImperativeHandle(_ref, () => ({
    edit: () => setState('edit'),
    add: () => setState('add'),
  }));

  function onFinish() {
    form
      .validateFields()
      .then((values) => {
        const params = getParams ? getParams(values) : values;
        const service = type === 'add' ? services[0] : services[1];
        service(params).then((res) => {
          if (res.success) {
            setState('cancel');
            form.resetFields();
            grid.refresh();
            serviceCb?.();
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <Modal
      title={title + prefix}
      open={open}
      className={className || ''}
      onCancel={() => setState('cancel')}
      onOk={onFinish}
    >
      {children}
    </Modal>
  );
}
export default GridModal;
