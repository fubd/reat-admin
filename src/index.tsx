import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './utils/mixin';
import './index.less';

const root = createRoot(document.getElementById('app') as HTMLElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
