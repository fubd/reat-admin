import {Form, FormInstance, Modal} from 'antd';
import useTable, {TableInstance} from '../useTable';
import useGridModal, {ModalState} from '../useGridModal';
import useGridScroll from '../useGridScroll';

export interface GridInstance extends FormInstance, TableInstance {
  scrollY: any;
  modalState: ModalState;
  cancelModal: () => void;
  openEdit: () => void;
  openAdd: () => any;
  openRemove: (id: any, extra?: string) => any;
}

export default function useGrid(services, prefix): GridInstance {
  const [form] = Form.useForm();
  const [table] = useTable(services.query);
  const [modalState, setModal] = useGridModal();
  const {scrollY} = useGridScroll(table.getTableState());

  const gridInstance = {
    scrollY,
    modalState,
    cancelModal: () => setModal('cancel'),
    openEdit: () => setModal('edit'),
    openAdd: () => setModal('add'),
    openRemove: (id, extra) => {
      Modal.confirm({
        title: '删除',
        content: `确定删除该${prefix}${extra ? `(${extra})` : ''}？`,
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
