import React, { useEffect, useState } from "react";
import SidebarCom from "../../../components/Sidebar/Sidebar";
import "./formChat.css";
import "./../../../style.css";
import { supabase } from "../../../supabaseClinet";

const FormChat = () => {
  const [chatHisoty, setChatHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filterName, setFilterName] = useState("");
  const itemsPerPage = 10;


  // useEffect(() => {
  //   const getChats = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from("user_data")
  //         .select("*")
  //         .order("id", { ascending: false })
  //         .range((currentPage - 1) * 10, currentPage * 10 - 1);

  //       if (error) throw error;

  //       if (data != null) {
  //         setChatHistory(data);
  //         setHasMoreData(data.length <10);

  //       }
  //     } catch (error) {
  //       alert(error.message);
  //     }
  //   };

  //   getChats();
  // }, [currentPage]);

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value); // Update filterName state
    setCurrentPage(1); // Reset to first page when filter changes
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data, error } = await supabase.rpc('filter_user_data', {
          name_filter: filterName ? filterName : null,
          limit_count: itemsPerPage,
          offset_count: (currentPage - 1) * itemsPerPage

        });

        if (error) throw error;

        if (data != null) {
          setChatHistory(data);
          console.log(data.length);
          setHasMoreData(data.length < 10); // If less than 10, there is no more data
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getUserData();
  }, [currentPage,filterName]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log(chatHisoty);

  return (
    <div className="form-chat">
      <SidebarCom />
      <div className="content">
        <h2>User Registration Conversation</h2>
        <div className="filters">
          <h3>Filters:</h3>
          <div className="filter-options">
            <label>
              Filter by Name or Number or Address:
              <input
                type="text"
                value={filterName}
                onChange={handleFilterNameChange}
              />
            </label>
          </div>
          </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Initiation Date</th>
                <th>Mobile No.</th>
                <th>Name</th>
                <th>Role</th>
                <th>Chat</th>
                <th>Disclaimer</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {chatHisoty?.map((item, key) => (
                <tr key={key}>
                  <td>
                    {new Date(item.created_at).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>

                  <td>{item.mobile_no}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>
                    {item?.form_chat &&
                      item.form_chat.map((message, index) => (
                        <div
                          key={index}
                          style={{ textAlign: "start", marginBottom: "10px" }}
                        >
                          <div style={{ fontSize: "10px" }}>
                            <span style={{ fontWeight: "bold" }}>Time </span>
                            <span>
                              {new Date(message?.created_at).toLocaleString(
                                "en-US",
                                {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }
                              )}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontWeight: "bold" }}>User: </span>
                            <span>{message?.user && message.user}</span>
                          </div>
                          <div>
                            <span style={{ fontWeight: "bold" }}>Model:</span>
                            <span>
                              {message?.model_response &&
                                message.model_response}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontWeight: "bold" }}>Saarthi:</span>
                            <span>{message?.bot && message.bot}</span>
                          </div>
                          {message?.error && (
                            <div style={{ color: "red" }}>
                              <span style={{ fontWeight: "bold" }}>Error:</span>
                              <span>{message?.error && message.error}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </td>
                  <td>{item.disclaimer}</td>
                  <td>{item.verified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button
            class="buttonFlat"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button class="buttonFlat" onClick={handleNextPage} disabled={hasMoreData}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormChat;
