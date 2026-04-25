import React, { useEffect, useState } from "react";
import SidebarCom from "../../../components/Sidebar/Sidebar";
import "./userDataExpose.css";
import "./../../../style.css";
import { supabase } from "../../../supabaseClinet";
import { fetchData } from "../../../components/DownloadExcel/DownloadExcel";
import { exportToExcel } from "../../../components/DownloadExcel/DownloadExcel";

const UserDataExpose = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState("");

  const [hasMoreData, setHasMoreData] = useState(true);
  const itemsPerPage = 10;

  const handleExport = async () => {
    const tableName = "user_data";
    const data = await fetchData(tableName);
    exportToExcel(data);
  };

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value); // Update filterName state
    setCurrentPage(1); // Reset to first page when filter changes
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        let query = supabase
          .from('user_data')
          .select('*')
          .order('id', { ascending: true })
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

        // Apply filter if provided
        if (filterName && filterName.trim() !== '') {
          query = query.or(`name.ilike.%${filterName}%,mobile_no.ilike.%${filterName}%,address.ilike.%${filterName}%`);
        }

        const { data, error } = await query;

        if (error) {
          // Fallback to RPC if direct query fails
          try {
            const { data: rpcData, error: rpcError } = await supabase.rpc('filter_user_data', {
          name_filter: filterName ? filterName : null,
          limit_count: itemsPerPage,
          offset_count: (currentPage - 1) * itemsPerPage
        });

            if (rpcError) throw rpcError;

            if (rpcData != null) {
              setUserData(rpcData);
              setHasMoreData(rpcData.length < itemsPerPage);
            }
          } catch (rpcError) {
            console.error('RPC Error:', rpcError);
            alert(rpcError.message || 'Failed to fetch user data');
          }
          return;
        }

        if (data != null) {
          setUserData(data);
          // If we got a full page of results, there might be more data
          setHasMoreData(data.length === itemsPerPage);
        } else {
          setUserData([]);
          setHasMoreData(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert(error.message || 'Failed to fetch user data');
      }
    };

    getUserData();
  }, [currentPage, filterName]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // console.log(userData);

  return (
    <div className="user-data-expose">
      <SidebarCom />
      <div className="content">
        <div className="header">
          <h2>User Data</h2>
          <button className="buttonFlat" onClick={handleExport}>
            Export to Excel
          </button>
        </div>
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
                <th>Time Stamp</th>
                <th>Mobile No.</th>
                <th>Role</th>
                <th>Language</th>
                <th>Name</th>
                <th>Age</th>
                <th>School</th>
                <th>Grade</th>
                <th>Address</th>
                <th>Disclaimer</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {userData && userData.length > 0 ? (
                userData.map((item, key) => (
                  <tr key={item.id || key}>
                  <td>
                      {item.created_at 
                        ? new Date(item.created_at).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                          })
                        : "N/A"}
                    </td>
                    <td>{item.mobile_no || "N/A"}</td>
                    <td>{item.role || "N/A"}</td>
                    <td>{item.language || "N/A"}</td>
                    <td>{item.name || "N/A"}</td>
                    <td>{item.age || "N/A"}</td>
                    <td>{item.school || "N/A"}</td>
                    <td>{item.grade || "N/A"}</td>
                    <td>{item.address || "N/A"}</td>
                    <td>{item.disclaimer || "N/A"}</td>
                    <td>{item.verified !== undefined && item.verified !== null ? (item.verified ? "Yes" : "No") : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "20px" }}>
                    No user data available
                  </td>
                </tr>
              )}
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
          <button
            className="buttonFlat"
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

export default UserDataExpose;
