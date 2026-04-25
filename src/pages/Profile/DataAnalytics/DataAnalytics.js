import React, { useEffect, useState } from "react";
import "./dataAnalytics.css";
import SidebarCom from "../../../components/Sidebar/Sidebar";
import { supabase } from "../../../supabaseClinet";
import { Chart } from "chart.js/auto";
import { Bar, Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

const DataAnalytics = () => {
  const [totalMessageCount, setTotalMessageCount] = useState(null);
  const [dailyMessageCounts, setDailyMessageCounts] = useState([]);
  const [dailyActiveUser, setDailyActiveUser] = useState([]);
  const [formCompletion, setFromCompletion] = useState([]);

  const backgroundColors = [
    "rgba(43, 63, 229, 0.8)",
    "rgba(250, 192, 19, 0.8)",
    "rgba(253, 135, 135, 0.8)",
    "rgba(201, 203, 207, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(104, 234, 185, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(255, 99, 132, 0.8)",
  ];

  const fetchTotalCount = async () => {
    try {
      let { count, error } = await supabase
        .from("chat_history")
        .select("id", { count: "exact" });

      if (error) {
        console.log(error);
      } else {
        setTotalMessageCount(count);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDailyMessageCounts = async () => {
    const { data, error } = await supabase.rpc("daily_chats");

    if (error) {
      console.error("Error fetching daily message counts:", error);
    } else {
      setDailyMessageCounts(data);
    }
  };

  const fetchDailyActiveUsers = async () => {
    const { data, error } = await supabase.rpc("daily_active_users");

    if (error) {
      console.error("Error fetching daily message counts:", error);
    } else {
      setDailyActiveUser(data);
    }
  };

  const fetchFormCompletionCounts = async () => {
    const { data, error } = await supabase.rpc("form_completion");

    if (error) {
      console.error("Error fetching daily message counts:", error);
    } else {
      setFromCompletion(data);
    }
  };

  useEffect(() => {
    fetchTotalCount();
    fetchDailyActiveUsers();
    fetchDailyMessageCounts();
    fetchFormCompletionCounts();
  }, []);

  const totalFormCount = formCompletion.reduce(
    (sum, data) => sum + data.count,
    0
  );

  return (
    <div className="data-analytics">
      <SidebarCom />
      <div className="content">
        <h1>Data Insights </h1>
        <div className="data-container">
          <div className="message-count">
            <h3>
              <b>Total Message Count: </b> {totalMessageCount}
            </h3>
          </div>
          <div style={{ maxHeight: "600px" }} className="daily-active-user">
            <h3 style={{ textAlign: "start" }}>Daily Active User</h3>
            <Bar
              data={{
                labels: dailyActiveUser.map((data) => data?.message_date),
                datasets: [
                  {
                    label: "Active Users",
                    data: dailyActiveUser.map((data) => data?.active_users),
                  },
                ],
              }}
              options={{
                plugins: {
                  datalabels: {
                    anchor: "end",
                    align: "top",
                    formatter: (value) => value,
                    font: {
                      weight: "bold",
                    },
                  },
                },
              }}
            />
          </div>
          <div
            className="daily-message-count"
            style={{ maxHeight: "600px", marginTop: "100px" }}
          >
            <h3 style={{ textAlign: "start" }}>Daily Chats</h3>
            <Line
              data={{
                labels: dailyMessageCounts.map((data) => data?.message_date),
                datasets: [
                  {
                    label: "Daily Chats",
                    data: dailyMessageCounts.map((data) => data?.message_count),
                    backgroundColor: "#064FF0",
                    borderColor: "#064FF0",
                  },
                ],
              }}
              options={{
                plugins: {
                  datalabels: {
                    anchor: "end",
                    align: "top",
                    formatter: (value) => value,
                    font: {
                      weight: "bold",
                    },
                  },
                },
              }}
            />
          </div>

          <div className="registration-count-container">
            <h3 style={{ textAlign: "start" }}>Registration Analysis</h3>
            <div className="pie-container">
              <Pie
                data={{
                  labels: formCompletion.map((data) => data?.step),
                  datasets: [
                    {
                      label: "Count",
                      data: formCompletion.map((data) => data?.count),
                      backgroundColor: [
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 19, 0.8)",
                        "rgba(253, 135, 135, 0.8)",
                        "rgba(201, 203, 207, 0.8)",
                        "rgba(153, 102, 255, 0.8)",
                        "rgba(255, 159, 64, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(104, 234, 185, 0.8)",

                        "rgba(75, 192, 192, 0.8)",
                        "rgba(255, 99, 132, 0.8)",
                      ],
                      borderColor: [
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 19, 0.8)",
                        "rgba(253, 135, 135, 0.8)",
                        "rgba(201, 203, 207, 0.8)",
                        "rgba(153, 102, 255, 0.8)",
                        "rgba(255, 159, 64, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(104, 234, 185, 0.8)",

                        "rgba(75, 192, 192, 0.8)",
                        "rgba(255, 99, 132, 0.8)",
                      ],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    datalabels: {
                      display: false,
                    },
                    tooltip: {
                      enabled: false,
                    },
                  },
                }}
              />
              <div className="total-pie-count">
                <h4>Total Registration: {totalFormCount}</h4>
              </div>
              <div className="registration-details">
                <ul>
                  {formCompletion.map((data, index) => (
                    <li
                      key={data.step}
                      style={{ color: backgroundColors[index] }}
                    >
                      <span className="field-name">{data.step}:</span>
                      <span className="field-value">{data.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;
