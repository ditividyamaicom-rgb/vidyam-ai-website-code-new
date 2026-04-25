import React, { useEffect, useState } from "react";
import './quizHistory.css'
import './../../../style.css'
import {supabase} from '../../../supabaseClinet'
import SidebarCom from "../../../components/Sidebar/Sidebar";

const QuizHistory = () => {
    const [quizHistory, setQuizHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterName, setFilterName] = useState("");
    const [hasMoreData, setHasMoreData] = useState(true);

    const itemsPerPage = 10;

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value); // Update filterName state
        setCurrentPage(1); // Reset to first page when filter changes
      };

      useEffect(() => {
        const getQuizHistory = async () => { //We use async because we want to use await to pause execution until the Supabase call finishes.
          try {
            const { data, error } = await supabase.rpc('get_quiz_history', {
              name_filter: filterName ? filterName : null,
              limit_count: itemsPerPage,
              offset_count: (currentPage - 1) * itemsPerPage
    
            });
    
            if (error) throw error;
    
            if (data != null) {
              setQuizHistory(data);
              console.log(data.length);
              setHasMoreData(data.length < 10); // If less than 10, there is no more data
            }
          } catch (error) {
            alert(error.message);
          }
        };
    
        getQuizHistory();
      }, [currentPage,filterName]);//Because we only want to run this when currentPage or filterName changes, not on every render.

      const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      console.log(quizHistory)
    
      return (
        <div className="user-data-expose">
          <SidebarCom />
          <div className="content">
          <div class="header">
          <h2> Quiz History</h2>
          
        </div>
            
            <div className="filters">
              <h3>Filters:</h3>
              <div className="filter-options">
                <label>
                  Filter by Name or Number:
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
                  <th>Time Stamp</th>
                    <th>Mobile No. and Name</th>
                    <th>Subject</th>
                    <th>Chapter</th>
                    <th>Raw Question</th>
                    <th>Modified Question</th>
                    <th>Correct Answer</th>
                    <th>User Answer</th>
                    <th>Raw Explanation</th>
                    <th>Modified Explanation</th>
                    <th>Summary Prompt</th>
                    <th>Performance Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory?.map((item, key) => (
                    <tr key={key}>
                      <td>
                        {new Date(item.created_at).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>{item.mobile_no}
                        <br></br>
                        {item.name} 
                      </td>
                      <td>{item.subject_name}</td>
                      <td>{item.chapter_name}</td>
                      <td>{item.raw_question}</td>
                      <td>{item.modified_question}</td>
                      <td>{item.correct_answer}</td>
                      <td>{item.user_answer}</td>
                      <td>{item.raw_explanation}</td>
                      <td>{item.modified_explanation}</td>
                      <td>{item.summary_prompt}</td>
                      <td>{item.performance_summary}</td>
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

export default QuizHistory