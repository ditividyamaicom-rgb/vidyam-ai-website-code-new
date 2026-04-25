import React, { useEffect, useState } from "react";
import './quizData.css'
import './../../../style.css'
import {supabase} from '../../../supabaseClinet'
import SidebarCom from "../../../components/Sidebar/Sidebar";
const QuizData = () => {
    const [quizData, setQuizData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterName, setFilterName] = useState("");
    const [hasMoreData, setHasMoreData] = useState(true);

    const itemsPerPage = 10;

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value); // Update filterName state
        setCurrentPage(1); // Reset to first page when filter changes
      };

      useEffect(() => {
        const getQuizData = async () => {
          try {
            const { data, error } = await supabase.rpc('student_quiz_data', {
              name_filter: filterName ? filterName : null,
              limit_count: itemsPerPage,
              offset_count: (currentPage - 1) * itemsPerPage
    
            });
    
            if (error) throw error;
    
            if (data != null) {
                setQuizData(data);
              console.log(data.length);
              setHasMoreData(data.length < 10); // If less than 10, there is no more data
            }
          } catch (error) {
            alert(error.message);
          }
        };
    
        getQuizData();
      }, [currentPage,filterName]);

      const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      // console.log(quizData)
    
      return (
        <div className="user-data-expose">
          <SidebarCom />
          <div className="content">
          <div class="header">
          <h2> Student Quiz Data</h2>
          
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
                    <th>Mobile No.</th>
                    <th>Name</th>
                    <th>Quiz Data</th>
                  </tr>
                </thead>
                <tbody>
                  {quizData?.map((item, key) => (
                    <tr key={key}>
                      <td>
                        {new Date(item.created_at).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>{item.mobile_no}</td>
                     
                      <td>{item.name}</td>
                      <td>{item.quiz_data.map((ele, key)=><React.Fragment key={key}>
      {ele}
      <hr />
    </React.Fragment>)}</td>
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

export default QuizData