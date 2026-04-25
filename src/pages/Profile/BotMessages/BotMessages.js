import React, { useEffect, useState } from "react";
import Select from "react-select";
import SidebarCom from "../../../components/Sidebar/Sidebar";
import "./BotMessages.css";
import "./../../../style.css";
import { supabase } from "../../../supabaseClinet";
import { fetchData } from "../../../components/DownloadExcel/DownloadExcel";
import { exportToExcel } from "../../../components/DownloadExcel/DownloadExcel";

const BotMessages = () => {
  const [chatHisoty, setChatHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch available categories for the dropdown
    const fetchCategories = async () => {
      const { data, error } = await supabase.rpc("get_distinct_classification");
      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        // const regularCategories = data.filter(item => !item.is_broke_from_gemini)
        //                               .map(item => ({ value: item.category, label: item.category }));
        const regularCategories = data
          .filter(
            (item) => !item.is_broke_from_gemini && item.category !== null
          ) // Filter out null values
          .map((item) => ({
            value: item.category || "", // Replace blank values with 'Blank'
            label: item.category || "Blank", // Replace blank values with 'Blank'
          }));

        const brokeFromGeminiOption = {
          value: "Broke from Gemini",
          label: "Broke from: Gemini Safety Rating",
        };

        let totalCategories = [...regularCategories, brokeFromGeminiOption];
        // Sort by label alphabetically
        totalCategories.sort((a, b) => (a.label > b.label ? 1 : -1));

        setCategories(totalCategories);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const getChats = async () => {
      try {
        let categoryFilter =
          filterCategories?.length > 0
            ? filterCategories.map((category) => category.value)
            : null;
        let isBrokeFromGeminiSelected =
          categoryFilter && categoryFilter.includes("Broke from Gemini");
        if (isBrokeFromGeminiSelected) {
          categoryFilter.push(
            "Classifier Keyword: Mathematics Broke from: Gemini Safety Rating Breach in chat message agent"
          );
          categoryFilter.push(
            "Classifier Keyword: Other Broke from: Gemini Safety Rating Breach in chat message agent"
          );
          categoryFilter.push(
            "Classifier Keyword: Science Broke from: Gemini Safety Rating Breach in chat message agent"
          );
          categoryFilter.push(
            "Classifier Keyword: Science Broke from: Gemini Security Breach in Keyword Serach"
          );
          categoryFilter.push(
            "Classifier Keyword: Social Science Broke from: Gemini Safety Rating Breach in chat message agent"
          );
          categoryFilter.push(
            "Classifier Keyword: Social Science Broke from: Gemini Security Breach in Keyword Serach"
          );
        }

        const { data, error } = await supabase.rpc("filter_chat_history", {
          name_filter: filterName ? filterName : null,
          category_filter: categoryFilter,
          limit_count: itemsPerPage,
          offset_count: (currentPage - 1) * itemsPerPage,
        });

        if (error) throw error;
        setChatHistory(data);
        console.log("Chat History", data);
        setHasMoreData(data.length < 10);
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

  const handleExport = async () => {
    const tableName = "chat_history";
    const data = await fetchData(tableName);
    exportToExcel(data);
  };

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterCategoriesChange = (selectedOptions) => {
    setFilterCategories(selectedOptions);
    setCurrentPage(1);
  };

  return (
    <div className="bot-messages">
      <SidebarCom />
      <div className="content">
        <div class="header">
          <h2>Chat History</h2>
          <button className="buttonFlat" onClick={handleExport}>
            Export to Excel
          </button>
        </div>
        <div className="filters">
          <h3>Filters:</h3>
          <div className="filter-options">
            <label>
              Filter by Name or Number or Question:
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

                <th>Image Keyword</th>
                <th>Image Answer</th>
                <th>Video Keyword</th>
                <th>Video Answer</th>
                <th>Classifier Keyword</th>
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

                  <td>
                    {item.name}
                    <br></br>
                    {item.mobile_no}
                  </td>
                  <td>
                    {" "}
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        width={200}
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
                  <td>{item.image_keyword}</td>

                  <td>
                    {item.answer_image ? (
                      <img
                        src={item.answer_image}
                        width={200}
                        height="auto"
                        alt="jpg"
                      />
                    ) : (
                      ""
                    )}{" "}
                  </td>
                  <td>{item.video_keyword}</td>
                  <td>
                    {item.video_url ? (
                      <iframe
                        src={item.video_url.replace("watch?v=", "embed/")}
                        width="200" // You can adjust the width
                        height="175" // You can adjust the height
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="video"
                      />
                    ) : (
                      <p></p> // Fallback in case video_url is null or undefined
                    )}
                  </td>

                  <td>{item.classifier_keyword}</td>
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
          <button
            class="buttonFlat"
            onClick={handleNextPage}
            disabled={hasMoreData}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotMessages;
