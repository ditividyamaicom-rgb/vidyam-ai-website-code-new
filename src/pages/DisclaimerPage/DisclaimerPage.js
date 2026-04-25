import React from 'react';
import './disclaimerPage.css';

const DisclaimerPage = () => {
  return (
    <div className="disclaimer-container">
      <div className="disclaimer-title">
        Terms and Conditions
      </div>

      <div className="disclaimer-text">
        <div className="disclaimer-section">
        Students must be 18 years or older to access this application.
        </div>
        <div className="disclaimer-section">
          Students or users under the age of 18 must use the application accompanied by a parent.
        </div>
        <div className="disclaimer-section">
           This application is designed to promote curiosity-based learning for free. However, please note that the answers provided by this application may contain mistakes. It is advisable to verify them with your teacher or textbook.
        </div>
        <div className="disclaimer-section">
          Inputs and responses will be used to improve the product and experience.
        </div>
      </div>

      <div className="disclaimer-title" style={{ marginTop: '30px' }}>
        नियम और शर्तें
      </div>

      <div className="disclaimer-text">
        <div className="disclaimer-section">
          इस एप्लिकेशन तक पहुंचने के लिए छात्रों को 18 वर्ष या अधिक होना चाहिए।
        </div>
        <div className="disclaimer-section">
          18 वर्ष से कम आयु के छात्र या उपयोगकर्ता केवल अपने माता-पिता के साथ इस एप्लिकेशन का उपयोग करें।
        </div>
        <div className="disclaimer-section">
           यह एप्लिकेशन जिज्ञासा-आधारित शिक्षा को बढ़ावा देने के लिए डिज़ाइन किया गया है। हालांकि, कृपया ध्यान दें कि इस एप्लिकेशन द्वारा प्रदान किए गए उत्तर में गलतियाँ हो सकती हैं। इन्हें अपने अध्यापक या पाठ्यपुस्तक के साथ सत्यापित करना उत्तम होगा।
        </div>
        <div className="disclaimer-section">
           इनपुट और प्रतिक्रियाओं का उपयोग उत्पाद और अनुभव को बेहतर बनाने के लिए किया जाएगा।
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
