import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JSZip from "jszip";
import {
  Form,
  Upload,
  Button,
  Input,
  Row,
  Col,
  Card,
  Typography,
  Select,
  Table,
} from "antd";
import { UploadOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { uploadToS3 } from "../../state/uploadxml/uploadxmlSlice";
import LogTab from "../LogTab/LogTab";

import "./ZipUpload.css";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const ZipUpload = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [parameters, setParameters] = useState([]);
  const dispatch = useDispatch();

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      handleZipFile(fileList[0].originFileObj);
    }
  };

  const handleZipFile = (file) => {
    const zip = new JSZip();
    zip.loadAsync(file).then((contents) => {
      Object.keys(contents.files).forEach((filename) => {
        if (filename.endsWith(".xml")) {
          zip
            .file(filename)
            .async("string")
            .then((content) => {
              const params = extractParameters(content);
              setParameters(params);
            });
        }
      });
    });
  };

  const extractParameters = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const params = [];

    const promptPages = xmlDoc.querySelectorAll("promptPages");
    promptPages.forEach((promptPage) => {
      const selectValues = promptPage.querySelectorAll("selectValue");
      selectValues.forEach((selectValue) => {
        const parameter = selectValue.getAttribute("parameter");
        const required = selectValue.getAttribute("required") === "true";
        const headerTextElement = selectValue.querySelector(
          "headerText > defaultText"
        );
        const headerText = headerTextElement
          ? headerTextElement.textContent
          : "";

        if (parameter) {
          params.push({
            key: parameter,
            value: [],
            required: required,
            headerText: headerText,
          });
        }
      });
    });

    return params;
  };

  const handleInputChange = (key, value) => {
    setParameters((prevParams) =>
      prevParams.map((param) =>
        param.key === key ? { ...param, value } : param
      )
    );
  };

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text, record) => (
        <Select
          mode="tags"
          style={{ width: "20rem" }}
          placeholder={record.headerText}
          value={record.value}
          onChange={(value) => handleInputChange(record.key, value)}
          tokenSeparators={[","]}
        >
          {record.value.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const handleSubmit = async (values) => {
    try {
      await dispatch(uploadToS3(fileList[0].originFileObj)).unwrap();
    } catch (error) {
      console.error("Error in handleSubmit: ", error);
    }
  };

  const uploadXMLInfo = useSelector((state) => state.uploadXMLInfo);

  const { status, error } = uploadXMLInfo;

  return (
    <div className="body-wrapper">
      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card className="input-card">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="sourcePath"
                label="Visualizations - Source Path"
                rules={[
                  { required: true, message: "Please upload a ZIP file" },
                ]}
              >
                <Upload
                  fileList={fileList}
                  onChange={handleFileChange}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload ZIP File</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="destinationPath"
                label="Visualizations - Destination API Path"
                rules={[
                  {
                    required: true,
                    message: "Please enter the destination API path",
                  },
                ]}
              >
                <TextArea
                  placeholder="Enter destination API path here"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </Form.Item>

              <Title level={4}>API Credentials</Title>

              <Form.Item
                name="userId"
                rules={[
                  { required: true, message: "Please enter your User ID" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="User ID" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-button"
                >
                  Assess
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-button"
                >
                  Migrate
                </Button>
              </Form.Item>
            </Form>
            {status === "loading" && <p>Uploading file. Please wait.</p>}
            {error && <p>{error}</p>}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          {parameters.length > 0 && (
            <Card className="table-card">
              <Table
                dataSource={parameters}
                columns={columns}
                pagination={false}
              />
            </Card>
          )}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <LogTab />
        </Col>
      </Row>
    </div>
  );
};

export default ZipUpload;
