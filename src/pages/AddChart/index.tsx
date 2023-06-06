import { genChartByAiUsingPOST } from '@/services/bi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    // add chart, upload data
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('Analysis failed');
      } else {
        message.success('Analysis success');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('Chart Analysis failed');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('fail to add chart: ' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="BI Analysis">
            <Form
              name="addChart"
              onFinish={onFinish}
              labelAlign="left"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              initialValues={{}}
            >
              <Form.Item
                name="goal"
                label="Analyze Goal"
                rules={[{ required: true, message: 'Please Enter Analyze Goal!' }]}
              >
                <TextArea placeholder="Please Enter Your Analyze goal, e.g. Analyze website user growth" />
              </Form.Item>
              <Form.Item name="name" label="Chart Name">
                <Input placeholder="Please Enter Your Chart Name" />
              </Form.Item>
              <Form.Item name="chartType" label="Chart Type">
                <Select
                  options={[
                    { value: 'Line Chart', label: 'Line Chart' },
                    { value: 'Bar Chart', label: 'Bar Chart' },
                    { value: 'Pie Chart', label: 'Pie Chart' },
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item name="file" label="CSV File">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>Click to upload CSV</Button>
                </Upload>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                  <Button htmlType="reset">Reset</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Analysis Result">
            {chart?.genResult ?? <div>Please submit your form</div>}
            {submitting && <Spin spinning={submitting} />}
          </Card>
          <Divider />
          <Card title="Chart Result">
            {option ? <ReactECharts option={option} /> : <div>Please submit your form</div>}
            {submitting && <Spin spinning={submitting} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddChart;
