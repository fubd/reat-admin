import {Form, FormInstance, Modal} from 'antd';
import useTable, {TableInstance} from '../useTable';
import useGridModal, {ModalState} from '../useGridModal';
import useGridScroll from '../useGridScroll';

export interface GridInstance extends FormInstance, TableInstance {
  scrollY: any;
  modalState: ModalState;
  closeModal: () => void;
  openEdit: (values: Record<string, any>) => void;
  openAdd: () => any;
  openRemove: (id: any, extra?: string) => any;
}

export default function useGrid(services, prefix): GridInstance {
  const [form] = Form.useForm();
  const [table] = useTable(services.query);
  const [modalState, setModal] = useGridModal();
  const {scrollY} = useGridScroll(table);

  const gridInstance = {
    scrollY,
    modalState,
    closeModal: () => setModal('cancel'),
    openEdit: (values) => {
      form.setFieldsValue(values);
      setModal('edit');
    },
    openAdd: () => setModal('add'),
    openRemove: (id, extra) => {
      Modal.confirm({
        title: '删除',
        content: (
          <span>
            确定删除该{prefix} {extra ? <span style={{fontSize: 13, color: 'rgba(0,0,0,0.5)'}}>({extra})</span> : ''} ？
          </span>
        ),
        onOk: () => {
          services.remove(id).then((res) => {
            if (res.success) {
              table.refresh();
            }
          });
        },
      });
    },
    ...form,
    ...table,
  };
  return gridInstance;
}
