import "./App.css";
import Home from "./pages/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./pages/Profile/Profile";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
// import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import NavbarComp from "./components/Navbar/Navbar";
import BannerCarousel from "./components/BannerCarousel/BannerCarousel";

import Magic from "./pages/Profile/Magic/Magic";
import MagicChat from "./pages/Profile/MagicChat/MagicChat";
import MagicChatPro from "./pages/Profile/MagicChatPro/MagicChatPro";
import BotMessages from "./pages/Profile/BotMessages/BotMessages";
import SalesProfile from "./pages/SalesProfile/SalesProfile";
import SalesMagicChat from "./pages/SalesProfile/SalesMagicChat/SalesMagicChat";

import FormChat from "./pages/Profile/FormChat/FormChat";

import UserDataExpose from "./pages/Profile/UserDataExpose/UserDataExpose";
import DataAnalytics from "./pages/Profile/DataAnalytics/DataAnalytics";
import DisclaimerPage from "./pages/DisclaimerPage/DisclaimerPage";
import QuizData from "./pages/Profile/QuizData/QuizData";
import QuizHistory from "./pages/Profile/QuizHistory/QuizHistory";
import Blog from "./pages/Blog/Blog";
import QuizAnalytics from "./pages/Profile/QuizAnalytics/QuizAnalytics";
import Serper from "./pages/Profile/SerperContext/serper";
import UserEngagement from "./pages/engagement/UserEngagement";
// import ChatClassification from "./pages/Profile/ChatClassification/ChatClassification";
// import ChatClassificationFiltered from "./pages/Profile/ChatClassification/ChatClassificationWithoutAbusive";



function App() {
  
  return (
    <div className="App">
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

function AppContent() {
  
  // const location = useLocation();
  const email = localStorage.getItem("email");
  // const teamEmail = "team@vidyamai.com"
  // const saleEmail = "sales@vidyamai.com"


  return (
    <>
      {/* Use the same navbar on all routes, including the homepage */}
      <NavbarComp />
      <BannerCarousel />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {email && <Route path="/profile" element={<Profile />} />}
          {email && <Route path="/sales-profile" element={<SalesProfile />} />}
          {email && <Route path="/magic" element={<Magic />} />}
          {email && <Route path="/magic-chat" element={<MagicChat />} />}
          {email && <Route path="/sales-magic-chat" element={<SalesMagicChat />} />}
          {email && <Route path="/magic-chat-pro" element={<MagicChatPro />} />}
          {email && <Route path="/bot-messages" element={<BotMessages />} />}

          {email && <Route path="/form-chat" element={<FormChat />} />}

          {email && <Route path="/user-data" element={<UserDataExpose/>} />}

          {email && <Route path="/quiz-data" element={<QuizData/>} />}
          {email && <Route path="/quiz-history" element={<QuizHistory/>} />}

          {email && <Route path="/data-analytics" element={<DataAnalytics/>} />}
          {email && <Route path="/quiz-analytics" element={<QuizAnalytics/>} />}
          {email && <Route path="/serper" element={<Serper />} />}
          {email && <Route path="/engagement/user-engagement" element={<UserEngagement />} />}



          {/* {email && <Route path="/chat-classification" element={<ChatClassification/>} />}
          {email && <Route path="/chat-classification-filtered" element={<ChatClassificationFiltered/>} />} */}

          <Route path="/saarthi/tnc" element={<DisclaimerPage/>} />
          <Route path="/blog/Vidyam-llm" element={<Blog/>} />


        </Routes>
      </div>
    </>
  );
}

export default App;
