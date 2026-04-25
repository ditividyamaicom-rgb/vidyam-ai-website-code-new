import React, { useState, useEffect, useRef } from "react";
import "./chatbot.css";
import { BsSend, BsPaperclip, BsX, BsChatSquareDots } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Vidyam Assistant. You can try free chats. Please register to continue after that.",
      type: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [freeChatCount, setFreeChatCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    studentId: "",
    mobileNumber: "",
    name: "",
    age: "",
    grade: "",
    address: "",
    language: "",
    role: "",
    schoolName: "",
    password: "",
    agreeToTerms: false,
  });
  const [loginData, setLoginData] = useState({
    studentId: "",
    password: "",
  });
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Validate and prepare data
      const ageValue = parseInt(registerData.age);
      if (isNaN(ageValue) || ageValue <= 0) {
        alert("Please enter a valid age.");
        return;
      }

      // Keep grade as string (API might expect string or number)
      const gradeValue = registerData.grade?.toString().trim();
      
      if (!gradeValue) {
        alert("Please select a valid grade.");
        return;
      }

      // Format mobile number: must be 10 digits and start with 91
      // If user enters 7678910123, it should become 917678910123
      let mobileNumber = registerData.mobileNumber?.trim().replace(/\D/g, ''); // Remove non-digits
      
      // If it's 10 digits, add 91 prefix
      if (mobileNumber.length === 10) {
        mobileNumber = "91" + mobileNumber;
      }
      // If it already starts with 91 and has 12 digits total, keep it
      else if (mobileNumber.startsWith("91") && mobileNumber.length === 12) {
        // Already correct format
      }
      // If it starts with 91 but has more/less digits, try to fix
      else if (mobileNumber.startsWith("91")) {
        const remainingDigits = mobileNumber.substring(2);
        if (remainingDigits.length === 10) {
          mobileNumber = "91" + remainingDigits;
        }
      }

      // Validate mobile number format
      if (!mobileNumber || !/^91\d{10}$/.test(mobileNumber)) {
        alert("Mobile number must be 10 digits (India) and will be formatted to start with 91.\nExample: 7678910123 becomes 917678910123");
        return;
      }

      // Convert role to lowercase (API expects 'student' or 'teacher')
      const roleValue = registerData.role?.trim().toLowerCase() || "";

      // Trim all string values to remove whitespace
      const payload = {
        student_id: registerData.studentId?.trim() || "",
        password: registerData.password?.trim() || "",
        name: registerData.name?.trim() || "",
        age: ageValue,
        grade: gradeValue,
        address: registerData.address?.trim() || "",
        language: registerData.language?.trim() || "",
        role: roleValue, // Now lowercase
        mobile_no: mobileNumber, // Formatted with 91 prefix
        school: registerData.schoolName?.trim() || "",
        source: "web_chat_bot",
        agree: registerData.agreeToTerms,
      };

      // Validate required fields
      if (!payload.student_id || !payload.password || !payload.name || !payload.mobile_no || 
          !payload.address || !payload.language || !payload.role || !payload.school) {
        alert("Please fill in all required fields.");
        return;
      }

      console.log("Registration payload:", payload);

      const response = await fetch(
        "https://vidyam-student-copilot-chatbot-preprod-116376022054.us-central1.run.app/ui/register_auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          mode: "cors", // Explicitly set CORS mode
          credentials: "omit", // Don't send credentials unless needed
        }
      );

      console.log("Registration response status:", response.status);
      console.log("Registration response headers:", response.headers);

      // Check if response is OK before parsing JSON
      if (response.ok) {
        const data = await response.json();
        console.log("Registration response data:", data);
        setSessionId(data.session_id || registerData.studentId);
        setIsLoggedIn(true);
        setIsRegisterOpen(false);
        setFreeChatCount(0); // Reset free chat count after registration
        setMessages([
          {
            text: "Registration successful! You can now chat unlimited times.",
            type: "bot",
          },
        ]);
        localStorage.setItem("chatbot_session", data.session_id || registerData.studentId);
      } else {
        // Handle error response - 422 usually means validation error
        let errorMessage = "Registration failed. Please try again.";
        let errorDetails = null;
        
        try {
          const errorData = await response.json();
          console.error("Registration error response (full):", JSON.stringify(errorData, null, 2));
          errorDetails = errorData;
          
          // Try to extract detailed error message
          if (errorData.detail) {
            // FastAPI style validation errors
            if (Array.isArray(errorData.detail)) {
              const validationErrors = errorData.detail.map(err => 
                `${err.loc?.join('.')}: ${err.msg}`
              ).join('\n');
              errorMessage = `Validation errors:\n${validationErrors}`;
            } else if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            }
          } else if (errorData.error) {
            errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            // Handle multiple validation errors
            errorMessage = JSON.stringify(errorData.errors, null, 2);
          }
        } catch (parseError) {
          // If response is not JSON, try to get text
          const errorText = await response.text();
          console.error("Registration error text:", errorText);
          errorMessage = errorText || errorMessage;
        }
        
        console.error("Registration failed with status:", response.status);
        console.error("Error details:", errorDetails);
        
        // Show user-friendly error
        alert(`Registration failed (Status: ${response.status}).\n\n${errorMessage}\n\nPlease check the console for more details.`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check for CORS errors
      if (error.message.includes("CORS") || error.message.includes("Failed to fetch")) {
        alert("CORS Error: The API might not allow requests from localhost. Check your browser console for details.");
      } else {
        alert(`An error occurred during registration: ${error.message}. Please check the console for details.`);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        student_id: loginData.studentId,
        password: loginData.password,
      };

      console.log("Login payload:", payload);

      const response = await fetch(
        "https://vidyam-student-copilot-chatbot-preprod-116376022054.us-central1.run.app/ui/login_auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          mode: "cors", // Explicitly set CORS mode
          credentials: "omit", // Don't send credentials unless needed
        }
      );

      console.log("Login response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Login response data:", data);
        setSessionId(data.session_id || loginData.studentId);
        setIsLoggedIn(true);
        setIsLoginOpen(false);
        setFreeChatCount(0); // Reset free chat count after login
        setMessages([
          {
            text: "Login successful! Welcome back.",
            type: "bot",
          },
        ]);
        localStorage.setItem("chatbot_session", data.session_id || loginData.studentId);
      } else {
        // Handle error response
        let errorMessage = "Login failed. Please check your credentials.";
        try {
          const errorData = await response.json();
          console.error("Login error response:", errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON, try to get text
          const errorText = await response.text();
          console.error("Login error text:", errorText);
          errorMessage = errorText || errorMessage;
        }
        console.error("Login failed with status:", response.status);
        alert(`Login failed (Status: ${response.status}). ${errorMessage}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check for CORS errors
      if (error.message.includes("CORS") || error.message.includes("Failed to fetch")) {
        alert("CORS Error: The API might not allow requests from localhost. Check your browser console for details.");
      } else {
        alert(`An error occurred during login: ${error.message}. Please check the console for details.`);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !imageFile) return;

    // Check if user is trying to upload image without login
    if (!isLoggedIn && imageFile) {
      setMessages([
        ...messages,
        {
          text: "Please login to use all features of Saarthi, including image upload.",
          type: "bot",
        },
      ]);
      setIsLoginOpen(true);
      setImageFile(null);
      setImagePreview(null);
      setInputText("");
      return;
    }

    if (!isLoggedIn && freeChatCount >= 5) {
      setMessages([
        ...messages,
        {
          text: "You've reached the free chat limit. Please register or login to continue.",
          type: "bot",
        },
      ]);
      setIsRegisterOpen(true);
      return;
    }

    const userMessage = { text: inputText, type: "user", image: imagePreview };
    const currentInput = inputText;
    const hasImage = !!imageFile;
    const currentImageFile = imageFile;
    
    setInputText("");
    setImageFile(null);
    setImagePreview(null);
    setIsLoading(true);

    // Add user message and loading indicator
    setMessages((prev) => [
      ...prev,
      userMessage,
      { text: "Typing...", type: "bot", isLoading: true },
    ]);

    try {
      if (hasImage && currentImageFile) {
        // Handle image upload
        const formData = new FormData();
        
        // Image file - required (binary file, sent as raw binary)
        formData.append("image", currentImageFile);
        
        // Session ID - required, use empty string if not logged in (for free chat)
        formData.append("session_id", sessionId || "");
        
        // Caption - optional on UI, but always send to API
        // If user didn't change from default "", send empty string
        // Otherwise send the trimmed caption
        const captionToSend = currentInput && currentInput.trim() && currentInput.trim() !== "" 
          ? currentInput.trim() 
          : "";
        formData.append("caption", captionToSend);

        console.log("Image upload - FormData entries:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1]));
        }

        const imageResponse = await fetch(
          "https://vidyam-student-copilot-chatbot-preprod-116376022054.us-central1.run.app/ui/image",
          {
            method: "POST",
            body: formData,
          }
        );

        console.log("Image response status:", imageResponse.status);

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error("Image API error:", errorText);
          let errorMessage = "Sorry, I couldn't process the image. Please try again.";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            // Keep default error message
          }
          setMessages((prev) => {
            const newMessages = prev.filter((msg) => !msg.isLoading);
            return [...newMessages, { text: errorMessage, type: "bot" }];
          });
          return;
        }

        const imageData = await imageResponse.json();
        console.log("Image response data:", imageData);
        
        // Try different response formats
        const botResponse = imageData.text || imageData.response || imageData.answer || imageData.message || "I've received your image.";
        
        // Create message object with optional media
        const botMessage = {
          text: botResponse,
          type: "bot",
        };
        
        // Add image URL if present
        if (imageData.image_url) {
          botMessage.image_url = imageData.image_url;
        }
        
        // Add video URL if present
        if (imageData.video_url) {
          botMessage.video_url = imageData.video_url;
        }

        setMessages((prev) => {
          const newMessages = prev.filter((msg) => !msg.isLoading);
          return [...newMessages, botMessage];
        });

        // Update free chat count from API response
        if (!isLoggedIn && imageData.chats_remaining !== undefined) {
          const remaining = imageData.chats_remaining;
          setFreeChatCount(5 - remaining);
        } else if (!isLoggedIn) {
          setFreeChatCount((prev) => prev + 1);
        }
      } else {
        // Handle text chat
        const chatPayload = {
          text: currentInput,
        };
        if (sessionId) {
          chatPayload.session_id = sessionId;
        } else {
          chatPayload.session_id = ""; // Empty string for free chats
        }

        console.log("Sending chat request:", chatPayload);

        const response = await fetch(
          "https://vidyam-student-copilot-chatbot-preprod-116376022054.us-central1.run.app/ui/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(chatPayload),
          }
        );

        console.log("Chat response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Chat API error:", errorText);
          let errorMessage = `Sorry, I couldn't process that. Error: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            // Keep default error message
          }
          setMessages((prev) => {
            const newMessages = prev.filter((msg) => !msg.isLoading);
            return [...newMessages, { text: errorMessage, type: "bot" }];
          });
          return;
        }

        const data = await response.json();
        console.log("Chat response data:", data);
        
        // Extract response text
        const botResponse = data.text || data.response || data.answer || data.message || "I'm sorry, I couldn't process that.";
        
        // Create message object with optional media
        const botMessage = {
          text: botResponse,
          type: "bot",
        };
        
        // Add image URL if present
        if (data.image_url) {
          botMessage.image_url = data.image_url;
        }
        
        // Add video URL if present
        if (data.video_url) {
          botMessage.video_url = data.video_url;
        }

        setMessages((prev) => {
          const newMessages = prev.filter((msg) => !msg.isLoading);
          return [...newMessages, botMessage];
        });

        // Update free chat count from API response
        if (!isLoggedIn && data.chats_remaining !== undefined) {
          const remaining = data.chats_remaining;
          setFreeChatCount(5 - remaining);
        } else if (!isLoggedIn) {
          setFreeChatCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = prev.filter((msg, idx) => !msg.isLoading);
        return [
          ...newMessages,
          { text: `Sorry, an error occurred: ${error.message}. Please check the console for details.`, type: "bot" },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if user is logged in before allowing image upload
      if (!isLoggedIn) {
        setMessages([
          ...messages,
          {
            text: "Please login to use all features of Saarthi, including image upload.",
            type: "bot",
          },
        ]);
        setIsLoginOpen(true);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Auto-fill caption with default text when image is selected
      if (!inputText.trim()) {
        setInputText("");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isChatbotOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsChatbotOpen(true)}
          title="Open Chat"
        >
          <BsChatSquareDots />
        </button>
      )}
      
      {isChatbotOpen && (
        <div className="chatbot-container">
        <div className="chatbot-header">
          <h3>Vidyam Assistant</h3>
          <div className="header-buttons">
            <button
              className="login-register-btn"
              onClick={() => {
                if (isLoggedIn) {
                  setIsLoggedIn(false);
                  setSessionId(null);
                  localStorage.removeItem("chatbot_session");
                  setMessages([
                    {
                      text: "You have been logged out. You can try free chats or login again.",
                      type: "bot",
                    },
                  ]);
                } else {
                  setIsLoginOpen(true);
                }
              }}
            >
              {isLoggedIn ? "Logout" : "Login/Register"}
            </button>
            <button
              className="close-chatbot-btn"
              onClick={() => setIsChatbotOpen(false)}
              title="Close Chat"
            >
              <BsX />
            </button>
          </div>
        </div>

        <div className="chatbot-messages" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.image && (
                <img src={message.image} alt="uploaded" className="message-image" />
              )}
              {message.image_url && (
                <img src={message.image_url} alt="response" className="message-image" />
              )}
              <p>{message.text}</p>
              {message.video_url && (
                <div className="message-video">
                  <a href={message.video_url} target="_blank" rel="noopener noreferrer" className="video-link">
                    📹 Watch Video
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chatbot-input-container">
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="preview" />
              <button
                className="remove-image-btn"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                <BsX />
              </button>
            </div>
          )}
          <div className="chatbot-input-wrapper">
             <button
               className="attach-btn"
               onClick={() => {
                 if (!isLoggedIn) {
                   setMessages([
                     ...messages,
                     {
                       text: "Please login to use all features of Saarthi, including image upload.",
                       type: "bot",
                     },
                   ]);
                   setIsLoginOpen(true);
                   return;
                 }
                 fileInputRef.current?.click();
               }}
               disabled={isLoading || !isLoggedIn}
               title={!isLoggedIn ? "Please login to upload images" : "Attach image"}
             >
               <BsPaperclip />
             </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />
            <input
              type="text"
              className="chatbot-input"
              placeholder={imagePreview ? "" : "Type a message..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <button className="send-btn" onClick={handleSendMessage} disabled={isLoading}>
              <BsSend />
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsLoginOpen(false)}>
              <AiOutlineClose />
            </button>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Student ID"
                value={loginData.studentId}
                onChange={(e) =>
                  setLoginData({ ...loginData, studentId: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>
            <p className="modal-footer">
              No account?{" "}
              <span
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsRegisterOpen(true);
                }}
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={() => setIsRegisterOpen(false)}>
          <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsRegisterOpen(false)}>
              <AiOutlineClose />
            </button>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Student ID (must be unique)"
                value={registerData.studentId}
                onChange={(e) =>
                  setRegisterData({ ...registerData, studentId: e.target.value })
                }
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number (10 digits, e.g., 7678910123)"
                value={registerData.mobileNumber}
                onChange={(e) =>
                  setRegisterData({ ...registerData, mobileNumber: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={registerData.age}
                onChange={(e) =>
                  setRegisterData({ ...registerData, age: e.target.value })
                }
                required
              />
              <select
                value={registerData.grade}
                onChange={(e) =>
                  setRegisterData({ ...registerData, grade: e.target.value })
                }
                required
              >
                <option value="">Select Grade</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Address"
                value={registerData.address}
                onChange={(e) =>
                  setRegisterData({ ...registerData, address: e.target.value })
                }
                required
              />
              <select
                value={registerData.language}
                onChange={(e) =>
                  setRegisterData({ ...registerData, language: e.target.value })
                }
                required
              >
                <option value="">Select Language</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Bengali">Bengali</option>
                <option value="French">French</option>
                <option value="Telugu">Telugu</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={registerData.role}
                onChange={(e) =>
                  setRegisterData({ ...registerData, role: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
              <input
                type="text"
                placeholder="School Name"
                value={registerData.schoolName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, schoolName: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
              />
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={registerData.agreeToTerms}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      agreeToTerms: e.target.checked,
                    })
                  }
                  required
                />
                I have read and agree to the{" "}
                <a href="/saarthi/tnc" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>
              </label>
              <button type="submit" className="submit-btn">
                Register
              </button>
            </form>
            <p className="modal-footer">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setIsRegisterOpen(false);
                  setIsLoginOpen(true);
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsLoginOpen(false)}>
              <AiOutlineClose />
            </button>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Student ID"
                value={loginData.studentId}
                onChange={(e) =>
                  setLoginData({ ...loginData, studentId: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>
            <p className="modal-footer">
              No account?{" "}
              <span
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsRegisterOpen(true);
                }}
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={() => setIsRegisterOpen(false)}>
          <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsRegisterOpen(false)}>
              <AiOutlineClose />
            </button>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Student ID (must be unique)"
                value={registerData.studentId}
                onChange={(e) =>
                  setRegisterData({ ...registerData, studentId: e.target.value })
                }
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number (10 digits, e.g., 7678910123)"
                value={registerData.mobileNumber}
                onChange={(e) =>
                  setRegisterData({ ...registerData, mobileNumber: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={registerData.age}
                onChange={(e) =>
                  setRegisterData({ ...registerData, age: e.target.value })
                }
                required
              />
              <select
                value={registerData.grade}
                onChange={(e) =>
                  setRegisterData({ ...registerData, grade: e.target.value })
                }
                required
              >
                <option value="">Select Grade</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Address"
                value={registerData.address}
                onChange={(e) =>
                  setRegisterData({ ...registerData, address: e.target.value })
                }
                required
              />
              <select
                value={registerData.language}
                onChange={(e) =>
                  setRegisterData({ ...registerData, language: e.target.value })
                }
                required
              >
                <option value="">Select Language</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Bengali">Bengali</option>
                <option value="French">French</option>
                <option value="Telugu">Telugu</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={registerData.role}
                onChange={(e) =>
                  setRegisterData({ ...registerData, role: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
              <input
                type="text"
                placeholder="School Name"
                value={registerData.schoolName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, schoolName: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
              />
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={registerData.agreeToTerms}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      agreeToTerms: e.target.checked,
                    })
                  }
                  required
                />
                I have read and agree to the{" "}
                <a href="/saarthi/tnc" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>
              </label>
              <button type="submit" className="submit-btn">
                Register
              </button>
            </form>
            <p className="modal-footer">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setIsRegisterOpen(false);
                  setIsLoginOpen(true);
                }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;

