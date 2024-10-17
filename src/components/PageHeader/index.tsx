import {ReactElement} from 'react';

function PageHeader({title, toolBar}: {title: string; toolBar: ReactElement}) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 50}}>
      <h3 style={{margin: 0, padding: 0}}>{title}</h3>
      {toolBar}
    </div>
  );
}

export default PageHeader;
