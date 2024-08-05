import React, { useState, useEffect, useRef } from "react";
import { Tabs, Card, Typography, List, Progress } from "antd";
import "./LogTab.css";
import { socket } from "../../socket";

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

const LogTab = () => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
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
      const match = message.message.match(/(\d+)%/);
      if (match && match[1]) {
        setProgress(parseInt(match[1], 10));
      }
    });

    return () => {
      socket.off("file_upload_response");
    };
  }, []);

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
                  <Paragraph>{item}</Paragraph>
                </List.Item>
              )}
            />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default LogTab;
