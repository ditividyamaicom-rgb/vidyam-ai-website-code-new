import React, { useEffect, useState, useRef } from "react";
import { IoSendSharp } from "react-icons/io5";
import { GrClearOption } from "react-icons/gr";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ReactMarkdown from "react-markdown";

import "./chat.css";
import axios from "axios";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const Chat = () => {
  const [chatMessages, setChatMessages] = useState([]);

  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const chatContainerRef = useRef(null);

  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);


  useEffect(() => {
    //  console.log(imageFile)
  }, [chatMessages, imageFile]);

  const handleSendMessage = async () => {
    if (!imageFile) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, type: "user" },
      ]);
      const text = inputText;
      setInputText("");

      const apiUrl =
        "https://whatsapp-bot-metadevloper-ab75293e41ff.herokuapp.com/chatbotAPI";

      let currentResponse = { text: "", type: "bot" };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: text }),
        });

        const reader = response.body.getReader();

        function read() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              setChatMessages((prevMessages) => [
                ...prevMessages.slice(0, -1),
                { ...currentResponse },
              ]);
              return;
            }
            let count;
            if (currentResponse.text.length === 0) {
              count = 0;
            }

            // Convert the binary data to a string using TextDecoder
            const chunk = new TextDecoder().decode(value);
            const cleanedChunk = chunk.replace(/^data:\s*/, "").trim();

            // Update the current response with the new chunk
            currentResponse.text += cleanedChunk;

            // Display the current chunk in the same message

            if (count === 0) {
              setChatMessages((prevMessages) => [
                ...prevMessages,
                { ...currentResponse },
              ]);
            } else {
              setChatMessages((prevMessages) => [
                ...prevMessages.slice(0, -1), // Exclude the last message
                { ...currentResponse },
              ]);
            }

            // Continue reading the next chunk
            read();
          });
        }

        // Start reading the response stream
        read();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      try {
        const imageURL = await submitImage();
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: [inputText, imageURL], type: "user" },
        ]);

        const text = inputText;
        setInputText("");
        setImageFile(null);

        const apiUrl =
          "https://whatsapp-bot-metadevloper-ab75293e41ff.herokuapp.com/chatbotAPIimage";

        const response = await axios.post(apiUrl, {
          prompt: imageURL,
          caption: text,
        });

        const apiResponse = response.data;

        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: apiResponse, type: "bot" },
        ]);

        setInputText("");
        setImageFile(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const Convert = (data) => {
    const lines = data.split("\n\n");

    return (
      <>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            <ReactMarkdown>{line}</ReactMarkdown>
            <br />
          </React.Fragment>
        ))}
      </>
    );
  };

  const submitImage = async () => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "imageUpload");
    data.append("cloud_name", "dzj2vdbpk");
    
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dzj2vdbpk/image/upload",
      {
        method: "post",
        body: data,
      }
    );

    const result = await response.json();
    console.log(result);

    return result.url; // Return the image URL
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };
  const handleRemoveFile = () => {
    setImageFile(null);
  };

  // const scrollToBottom = () => {
  //   if (chatWindowRef.current) {
  //     chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // If Enter key is pressed without Shift key, submit the message
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <div className="chat-container">
        <div className="right-section">
          <div className="chat-window" ref={chatContainerRef}
              style={{ overflowY: 'auto'}}>
            {chatMessages.map((message, index) => (
              <div key={index} className={message.type}
              >
                {message.type === "user" ? (
                  Array.isArray(message.text) ? (
                    <div>
                      <img
                        height={300}
                        width={100}
                        style={{ textAlign: "right", width: "100%" }}
                        src={message.text[1]}
                        alt="user-uploaded"
                      />
                      <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                        {message.text[0]}
                      </p>
                    </div>
                  ) : (
                    <p style={{ marginTop: "0px", marginBottom: "0px" }}>
                      {message.text}
                    </p>
                  )
                ) : (
                  <p>{Convert(message.text)}</p>
                )}
              </div>
            ))}
          </div>
          <div className="message-box">
            <span>
              {imageFile ? (
                <div className="file-item">
                  <span>{imageFile.name}</span>
                  <AiOutlineCloseCircle
                    style={{ marginLeft: "10px", color: "red" }}
                    className="remove-file-icon"
                    onClick={() => handleRemoveFile()}
                  />
                </div>
              ) : (
                ""
              )}
            </span>
            <div className="message-row">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ width: "100%", paddingRight: "8%" }}
                  onKeyDown={handleKeyPress}
                />
                <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                  <MdOutlineAddPhotoAlternate style={{ fontSize: "30px" }} />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  // value={imageFile}
                  name="imageFile"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              <button className="buttonOutline" onClick={handleSendMessage}>
                <IoSendSharp />
              </button>
              <button className="buttonOutline" onClick={handleClearChat}>
                <GrClearOption />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
