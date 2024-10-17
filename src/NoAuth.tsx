import {Button, Result} from 'antd';
import {useNavigate} from 'react-router-dom';

function NoAuth() {
  const navigate = useNavigate();

  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle="无权访问"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            返回上一页
          </Button>
        }
      />
    </div>
  );
}

export default NoAuth;
