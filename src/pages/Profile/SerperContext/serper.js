import React, { useEffect, useState } from "react";
import './serper.css'
import './../../../style.css'
import {supabase} from '../../../supabaseClinet'
import SidebarCom from "../../../components/Sidebar/Sidebar";

const Serper = () => {
    const [serper, setSerper] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterName, setFilterName] = useState("");
    const [hasMoreData, setHasMoreData] = useState(true);

    const itemsPerPage = 10;

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value); // Update filterName state
        setCurrentPage(1); // Reset to first page when filter changes
      };

      useEffect(() => {
        const getSerper = async () => { //We use async because we want to use await to pause execution until the Supabase call finishes.
          try {
            const { data, error } = await supabase.rpc('get_serper_context', {
              name_filter: filterName ? filterName : null,
              limit_count: itemsPerPage,
              offset_count: (currentPage - 1) * itemsPerPage
    
            });
    
            if (error) throw error;
    
            if (data != null) {
              setSerper(data);
              console.log(data.length);
              setHasMoreData(data.length < 10); // If less than 10, there is no more data
            }
          } catch (error) {
            alert(error.message);
          }
        };
    
        getSerper();
      }, [currentPage,filterName]);//Because we only want to run this when currentPage or filterName changes, not on every render.

      const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      console.log(serper)
    
      return (
        <div className="user-data-expose">
          <SidebarCom />
          <div className="content">
          <div class="header">
          <h2> Real Time Questions</h2>
          
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
                  <th className="wrap">Time Stamp</th>
                    <th className="wrap">Mobile No. and Name</th>
                    <th className="unwrap">SerperContext</th>
                    <th className="wrap">Question</th>
                    <th className="wrap">Website</th>
                    <th className="wrap">All_links</th>
                    <th className="wrap">Snipet</th>
                    <th className="wrap">Google search keyword</th>
                  </tr>
                </thead>
                <tbody>
                  {serper?.map((item, key) => (
                    <tr key={key}>
                      <td className="wrap">
                        {new Date(item.create_at).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="wrap">{item.mobile_no}
                        <br></br>
                        {item.name} 
                      </td>
                      <td className="unwrap">{item.serper_context}</td>
                      <td className="wrap">{item.question}</td>
                      <td className="wrap">{item.website_by_custom_google}</td>
                      <td className="wrap">{item.all_links}</td>
                      <td className="wrap">{item.snipet}</td>
                      <td className="wrap">{item.google_search_keyword || "—"}</td>

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

export default Serper
