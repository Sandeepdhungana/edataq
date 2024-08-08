import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { useDispatch, useSelector } from "react-redux";
import { chat } from "../../state/chat/chatSlice";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatInfo = useSelector((state) => state.chatInfo);
  const { botMessage, status, error } = chatInfo;
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const conversationEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Helper function to parse messages with links and lists
  function parseMessage(text) {
    console.log("Inside of parse Message", text)
    if (text) {
      const urlPatternExists = /\[\[(.*?)\]\]/.test(text);
      const listPatternExists = /\(\[(.*?)\]\)/.test(text);

      if (urlPatternExists) {
        const urlRegex = /\[\[(.*?)\]\]/;
        const textRegex = /^(.*?)\s*\[\[.*?\]\]/;

        const urlMatch = text.match(urlRegex);
        const url = urlMatch ? urlMatch[1] : "No URL found";

        const textMatch = text.match(textRegex);
        const regularText = textMatch ? textMatch[1] : text;

        return (
          <>
            {regularText} <a href={`mailto:${url}`}>{url}</a>
          </>
        );
      } else if (listPatternExists) {
        const listRegex = /\(\[(.*?)\]\)/
        const textRegex = /^(.*?)\s*\([^)]*\)/;

        const urlMatch = text.match(listRegex);
        const list = urlMatch ? urlMatch[1].split(",") : [];

        const textMatch = text.match(textRegex);
        const regularText = textMatch ? textMatch[1] : text;

        return (
          <>
            {regularText}
            <ul>
              {list.map((item, index) => (
                <li key={index}> {item}</li>
              ))}
            </ul>
          </>
        );
      } else {
        return text;
      }
    }
    return text
  }

  useEffect(() => {
    if (botMessage) {
      const newMessages = botMessage.map((msg) => ({
        message: parseMessage(msg.content),
        sender: "bot",
      }));
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    }
  }, [botMessage]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { message: input, sender: "user" }]);
      setInput("");
      setIsTyping(true);
      dispatch(chat({ message: input }));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div
        className={`chatbot-icon ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
      >
        {isOpen ? "✖" : "💬"}
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>InceptiveBI Bot</h3>
          </div>
          <div className="conversation">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.sender}`}>
                {msg.sender === "bot" && <div className="avatar bot">🤖</div>}
                <div className={`message ${msg.sender}`}>
                  {/* {parseMessage(msg.message)} */}
                  {msg.message}
                </div>
                {msg.sender === "user" && <div className="avatar user">😀</div>}
              </div>
            ))}
            {status === "loading" && (
              <div className="message-row bot">
                <div className="avatar bot">🤖</div>
                <div className="message bot typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
