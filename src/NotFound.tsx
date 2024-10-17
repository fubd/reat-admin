import {Button, Result} from 'antd';
import {useNavigate} from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="页面不存在"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            返回上一页
          </Button>
        }
      />
    </div>
  );
}

export default NotFound;
