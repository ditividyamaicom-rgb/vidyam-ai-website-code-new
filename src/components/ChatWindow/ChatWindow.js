import React, { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { GrClearOption } from "react-icons/gr";
import { CgAttachment } from "react-icons/cg";
import { AiOutlineCloseCircle } from "react-icons/ai";

import "./chatWindow.css";

const ChatWindow = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [systemInputText, setSystemInputText] = useState("");
  const [inputText, setInputText] = useState("");
  const [files, setFiles] = useState([]);

  const handleSendMessage = () => {
    // Your logic to send a message to the API and update the chat
    // For now, just adding a sample message
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, type: "user" },
      { text: "API response goes here", type: "bot" },
    ]);
    setInputText("");
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div className="app-container">
      <div className="left-section">
        <div className="system-message">
          <p>System Message</p>
          <textarea
            type="text"
            placeholder="You are a helpful assistant"
            value={systemInputText}
            onChange={(e) => setSystemInputText(e.target.value)}
          />
        </div>

        <div className="file">
          <div>
            {files.length > 0 && (
              <div className="file-list">
                {files.map((file) => (
                  <div key={file.name} className="file-item">
                    <span>{file.name}</span>
                    <AiOutlineCloseCircle
                      className="remove-file-icon"
                      onClick={() => handleRemoveFile(file.name)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="file-input-container" >
           
            <p>Files</p>
            <div className="file-input">
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                multiple
                style={{ display: "none" }}
              />
              <label htmlFor="file-upload" style={{ cursor: "pointer", color: "#10a37f"}}>
                <CgAttachment style={{ marginRight: "8px" }} />
                Add
              </label>
            </div>
            
          </div>
          {files.length>=1 ? <button className="upload-button buttonFlat" >Upload</button> : <span style={{height:'1rem'}}></span>
}
        </div>
      </div>
      <div className="right-section">
        <div className="chat-window">
          {chatMessages.map((message, index) => (
            <div key={index} className={message.type}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="message-box">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="buttonOutline" onClick={handleSendMessage}>
            <IoSendSharp />
          </button>
          <button className="buttonOutline" onClick={handleClearChat}>
            <GrClearOption />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
