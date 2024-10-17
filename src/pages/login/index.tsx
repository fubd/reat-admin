import {useState} from 'react';
import {Form, Input, Button, message, Modal, notification} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';
import {request} from '@/utils/request';
import {MD5_SALT} from '@/utils/constants';
import {setUserInfo} from '@/utils/utils';
import * as styles from './index.module.less';

const fetchUserInfo = async (values: {username: string; password: string}) => {
  const hashedPassword = CryptoJS.MD5(values.password + MD5_SALT).toString();
  const res = await request<API.LoginResult>({
    method: 'post',
    url: '/api/user/login',
    data: {
      username: values.username,
      password: hashedPassword,
    },
  });

  return res;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: {username: string; password: string}) => {
    setLoading(true);
    try {
      const res = await fetchUserInfo(values);

      if (res.success) {
        notification.success({
          message: '登录成功',
        });
        setUserInfo(res.data);
        navigate('/statistics');
      } else {
        message.error(res.errorMessage || '登录失败');
      }
    } catch (error) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  const onForget = () => {
    Modal.info({
      title: '忘记密码？',
      content: '请联系管理员重置密码',
      okText: '确定',
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.welcome}>欢迎登录</div>
        <div className={styles.divider}></div>
        <div className={styles.signIn}>
          SIGN
          <br />
          IN.
        </div>
      </div>
      <div className={styles.formWrapper}>
        <Form size="large" initialValues={{remember: true}} onFinish={onFinish} className={styles.mainForm}>
          <div className={styles.title}>登录</div>
          <Form.Item name="username" rules={[{required: true, message: '请输入账号'}]}>
            <Input prefix={<UserOutlined />} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item name="password" rules={[{required: true, message: '请输入密码'}]}>
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <div style={{margin: '8px 0'}}>
            <a onClick={onForget}>忘记密码？</a>
          </div>
          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading} className={styles.submitBtn}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
