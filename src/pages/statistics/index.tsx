import {Card, Row, Col, Statistic} from 'antd';
import {ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';

function Statistics() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Users"
              value={11.1}
              precision={2}
              valueStyle={{color: '#3f8600'}}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Idle Users"
              value={9.311}
              precision={2}
              valueStyle={{color: '#cf1322'}}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Users" value={1128} valueStyle={{color: '#1890ff'}} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Statistics;
