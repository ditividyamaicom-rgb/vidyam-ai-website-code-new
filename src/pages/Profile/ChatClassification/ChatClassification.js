import React, { useEffect, useState } from "react";
import SidebarCom from "../../../components/Sidebar/Sidebar";
import "./chatClassification.css";
import Select from 'react-select';
import "./../../../style.css";
import { supabaseTest } from "../../../supabaseClientTest";

const ChatClassification = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [filterCategories, setFilterCategories] = useState([]);
  const itemsPerPage = 10;
  const [categories, setCategories] = useState([]);

  
  useEffect(() => {
    // Fetch available categories for the dropdown
    const fetchCategories = async () => {
      const { data, error } = await supabaseTest.rpc('get_distinct_categories');
      console.log(data)
      if (error) {
        console.error("Error fetching categories:", error);  
      } else {
        setCategories(data.map((item) => ({ value: item["category"], label: item["category"] })));
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data, error } = await supabaseTest.rpc('filter_chats', {
          name_filter: filterName ? filterName : null,
          category_filter: filterCategories?.length > 0 ? filterCategories.map(category => category.value) : null,
          limit_count: itemsPerPage,
          offset_count: (currentPage - 1) * itemsPerPage

        });

        if (error) throw error;

        setChatHistory(data);
      } catch (error) {
        alert(error.message);
      }
    };

    getChats();
  }, [currentPage, filterName, filterCategories]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value); // Update filterName state
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleFilterCategoriesChange = (selectedOptions) => {
    setFilterCategories(selectedOptions); // Update filterCategories state
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="bot-messages">
      <SidebarCom />
      <div className="content">
        <div className="header">
          <h2>Chat Classification Analysis  </h2>
        </div>
        <div className="filters">
          <h3>Filters:</h3>
          <div className="filter-options">
          <label>
            Filter by Name and number:
            <input
              type="text"
              value={filterName}
              onChange={handleFilterNameChange}
            />
          </label>
          <label>
            Filter by Categories:
            <Select 
              isMulti 
              value={filterCategories}
              options={categories}
              onChange={handleFilterCategoriesChange}
              classNamePrefix="react-select"
            />
          </label>
          </div>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {chatHistory.map((item, key) => (
                <tr key={key}>
                  <td>
                    {new Date(item.created_at).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>
                    {item.name}
                    <br></br>
                    {item.mobile_no}
                  </td>
                  <td>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        width={300}
                        height="auto"
                        alt="jpg"
                      />
                    ) : (
                      ""
                    )}
                    <br></br>
                    {item.question}
                  </td>
                  <td>{item.answer}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button
            className="buttonFlat"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button className="buttonFlat" onClick={handleNextPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatClassification;