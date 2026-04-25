import React, { useState } from "react";
import axios from "axios";
import { CgAttachment } from "react-icons/cg";
import "./salesMagicChat.css";

const SalesMagicChat = () => {
  const [textEmail, setTextEmail] = useState("");
  const [emailFile, setEmailFile] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [resultStatus, setResultStatus] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setEmailFile([selectedFile]);
    setTextEmail("");
  };

  const isInputNotEmpty = textEmail.trim() !== "";
  const isFilesSelected = emailFile.length > 0;

  const handleClear = () => {
    // setTextEmail("")
    // setEmailFile([])
    window.location.reload();
  };

  const handleGenerateBookingDetails = async () => {
    setLoadingData(true);

    if (isFilesSelected) {
      const formData = new FormData();
      formData.append("file", emailFile[0]);
      formData.append("upload_preset", "mflvfbit");
      formData.append("cloud_name", "dsv2uguly");
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dsv2uguly/upload/",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        const eml_url = data.secure_url;
        const apiUrl =
          "https://magicemailextractdata-e22c7fb1aeec.herokuapp.com/magicemail";

        const modelResponse = await axios.post(apiUrl, {
          emailfile: eml_url,
        });

        setExtractedData(modelResponse.data.bookings);
        setResultStatus(true);
      } catch (error) {
        console.error("Error uploading file to Cloudinary: ", error);
        setApiError(true);
      } finally {
        setLoadingData(false);
      }
    } else {
      try {
        const apiUrl =
          "https://magicemailextractdata-e22c7fb1aeec.herokuapp.com/magicemail";

        const response = await axios.post(apiUrl, {
          emailfile: textEmail,
        });
        setExtractedData(response.data.bookings);
        setResultStatus(true);
      } catch (error) {
        console.error("Error sending message:", error);
        setApiError(true);
      } finally {
        setLoadingData(false);
      }
    }
  };

  return (
    <div className="magic-email-container">
      <div className="left-section">
        <div className="system-message">
          <p>Booking Email</p>
          <textarea
            type="text"
            placeholder="Paste your booking email here or upload an eml file."
            value={textEmail}
            onChange={(e) => setTextEmail(e.target.value)}
            disabled={isFilesSelected}
          />
        </div>

        <div className="file">
          <div className="file-input-container">
            <p>
              {emailFile.length > 0 ? emailFile[0].name : "Choose an EML file"}
            </p>
            <div className="file-input">
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                disabled={isInputNotEmpty}
                style={{ display: "none" }}
              />
              <label
                htmlFor="file-upload"
                className={isInputNotEmpty ? "disabled" : ""}
                style={{ cursor: "pointer", color: "#10a37f" }}
              >
                <CgAttachment style={{ marginRight: "8px" }} />
                Upload
              </label>
            </div>
          </div>
          <button onClick={handleClear} className="clearBtn">
            Clear fields
          </button>
          <button
            className="upload-button buttonFlat generate-btn"
            disabled={(!isInputNotEmpty && !isFilesSelected) || resultStatus}
            onClick={handleGenerateBookingDetails}
          >
            Generate Booking Details
          </button>
        </div>
      </div>
      <div className="right-section">
        <div className="info-window">
          {apiError ? (
            <p>API Error has Occurred</p>
          ) : extractedData.length > 0 ? (
            <div>
              <p style={{ fontWeight: "500" }}>Booking Details</p>
              {extractedData.map((booking, index) => (
                <div key={index}>
                  <p style={{fontWeight:"bold"}}>Booking {index + 1}</p>
                  <div className="field-value-pairs">
                    {Object.entries(booking).map(([key, value]) => (
                      <div className="pair" key={key}>
                        <div className="field">{key}</div>
                        {typeof value === "object" ? (
                          <div className="nested-value">
                            {Object.entries(value).map(
                              ([nestedKey, nestedValue]) => (
                                <div className="nested-pair" key={nestedKey}>
                                  <div className="nested-field">
                                    {nestedKey}
                                  </div>
                                  <div
                                    className="nested-value"
                                    title={nestedValue}
                                  >
                                    {nestedValue.length > 30
                                      ? nestedValue.slice(0, 30) + "..."
                                      : nestedValue}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="value" title={value}>
                            {value.length > 30
                              ? value.slice(0, 30) + "..."
                              : value}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <img src="/images/city.jpeg" alt="City" />
              <p>Booking information will be shown here. </p>
            </div>
          )}
          {loadingData ? <p>Loading...</p> : null}
        </div>
      </div>
    </div>
  );
};

export default SalesMagicChat;
