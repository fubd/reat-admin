import React, {useState} from 'react';
import {Badge, Modal} from 'antd';
import classNames from 'classnames';
import {ReactComponent as LogoSvg} from '@/assets/logo.svg';
import * as AntIcons from '@ant-design/icons/lib/icons';
import * as styles from './picker.module.less';

interface IProps {
  open: boolean;
  onCancel: () => void;
  onIconSelect: {(name: string): void};
}

const customIcons = {
  'custom-logo': <LogoSvg />,
  default: <Badge color="#4072EE" style={{minWidth: 'auto'}} />,
};

const antIconNames = Object.keys(AntIcons).filter((it) => it.includes('Outlined'));

export const getIconCom = (name?: string | null) => {
  if (!name) {
    return;
  }
  if (name in customIcons) {
    return customIcons[name];
  } else {
    return React.createElement(AntIcons[name]);
  }
};

function Picker({open, onCancel, onIconSelect}: IProps) {
  const [selectedIcon, setSelectedIcon] = useState('');

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={800}
      onOk={() => {
        onIconSelect(selectedIcon);
        onCancel();
      }}
    >
      <h3>选择图标</h3>
      <div className={styles.iconList}>
        {antIconNames.map((iconName) => {
          const IconComponent = AntIcons[iconName];
          return (
            <div
              key={iconName}
              className={classNames([styles.iconItem, {[styles.active]: selectedIcon === iconName}])}
              onClick={() => handleIconClick(iconName)}
            >
              <IconComponent />
            </div>
          );
        })}
        {Object.keys(customIcons).map((iconName) => (
          <div
            key={iconName}
            className={classNames([styles.iconItem, {[styles.active]: selectedIcon === iconName}])}
            onClick={() => handleIconClick(iconName)}
          >
            {customIcons[iconName]}
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default Picker;
