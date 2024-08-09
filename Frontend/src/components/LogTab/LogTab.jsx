import React, { useState, useEffect, useRef } from "react";
import { Tabs, Card, Typography, List, Progress, Table } from "antd";
import "./LogTab.css";
import { socket } from "../../socket";

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

const LogTab = () => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState([]);
  const listEndRef = useRef(null);

  const scrollToBottom = () => {
    if (listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    socket.on("file_upload_response", (message) => {
      setLogs((prevLogs) => {
        const newLogs = [...prevLogs, message.message];
        scrollToBottom();
        return newLogs;
      });

      if (message.progress) {
        setProgress(message.progress);
      }

      if (message.summary && message.summary.length > 0) {
        setSummary(message.summary);
      }
    });

    return () => {
      socket.off("file_upload_response");
    };
  }, []);

  const columns = [
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <span style={{ color: record.completed ? "green" : "red" }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <Card className="log-card">
      {progress > 0 && (
        <Progress
          percent={progress}
          status={progress < 100 ? "active" : "normal"}
          className="progressbar"
        />
      )}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Assessment Log" key="1">
          <Title level={4}>Progress</Title>
          <div className="tab-content">
            <List
              dataSource={logs}
              renderItem={(item, index) => (
                <List.Item ref={index === logs.length - 1 ? listEndRef : null}>
                  <Paragraph
                    style={{
                      color: item.toLowerCase().includes("error") ? "red" : "inherit",
                    }}
                  >
                    {item}
                  </Paragraph>
                </List.Item>
              )}
            />
          </div>
        </TabPane>
        <TabPane tab="Summary" key="2">
          <Title level={4}>Summary</Title>
          <div className="tab-content">
            <Table
              dataSource={summary}
              columns={columns}
              rowKey="file_name"
              pagination={false}
            />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default LogTab;
