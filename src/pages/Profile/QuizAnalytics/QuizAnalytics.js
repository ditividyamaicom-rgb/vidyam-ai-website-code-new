import React, { useState, useEffect } from "react";
import SidebarCom from "../../../components/Sidebar/Sidebar";
import { Pie, Line } from "react-chartjs-2";
// import { Chart } from "chart.js/auto";
import { driver } from "../../../neo4jClient";
import "./quizAnalytics.css";

const QuizAnalytics = () => {
  const [userCount, setUserCount] = useState(0);
  const [quizCompletedCount, setQuizCompletedCount] = useState(0);
  // const [totalQuizPlayed, setTotalQuizPlayed] = useState(0);
  const [userTypeQuizCount, setUserTypeQuizCount] = useState(0);
  const [userType, setUserType] = useState("Both"); // Default to Both
  const [dailyQuizData, setDailyQuizData] = useState([]);
  const [dailyUniqueUsersData, setDailyUniqueUsersData] = useState([]);
  const [classNumber, setClassNumber] = useState(6);
  const [classSubjectCompletedQuizData, setClassSubjectCompletedQuizData] = useState([]);
  const [classSubjectIncompleteQuizData, setClassSubjectIncompleteQuizData] = useState([]);
  const handleClassChange = (event) => {
    const selectedValue = event.target.value;
    const classNumber = parseInt(selectedValue, 10);
    setClassNumber(classNumber);
  };

  useEffect(() => {
    if (classNumber) {
      const fetchClassSubjectQuizData = async () => {
        const session = driver.session();
        try {
          // Fetch completed quizzes
          const completedQuizResult = await session.run(
            userType === "Both"
              ? `MATCH (q:Quiz)-[:CorrectAnswer|:WrongAnswer]->(question:Question)
                 WITH q, count(question) AS answeredQuestions
                 WHERE answeredQuestions = 5
                 MATCH (q)<-[:QuizNumQues]-(question)-[:QuesFromChapter]->(chapter)<-[:ChapterOfSubject]-(subject:Subject)
                 MATCH (person)-[:Attempt]->(q)
                 MATCH (person)-[:StudyIn|:TeachesIn]->(class:Class {ClassNumber: $classNumber})
                 WHERE person:Student OR person:Teacher
                 WITH subject.SubjectName AS subjectName, count(DISTINCT q) AS completedQuizCount
                 RETURN subjectName, completedQuizCount`
              : userType === "Student"
              ? `MATCH (q:Quiz)-[:CorrectAnswer|:WrongAnswer]->(question:Question)
                 WITH q, count(question) AS answeredQuestions
                 WHERE answeredQuestions = 5
                 MATCH (q)<-[:QuizNumQues]-(question)-[:QuesFromChapter]->(chapter)<-[:ChapterOfSubject]-(subject:Subject)
                 MATCH (student:Student)-[:Attempt]->(q)
                 MATCH (student)-[:StudyIn]->(class:Class {ClassNumber: $classNumber})
                 WITH subject.SubjectName AS subjectName, count(DISTINCT q) AS completedQuizCount
                 RETURN subjectName, completedQuizCount`
              : `MATCH (q:Quiz)-[:CorrectAnswer|:WrongAnswer]->(question:Question)
                 WITH q, count(question) AS answeredQuestions
                 WHERE answeredQuestions = 5
                 MATCH (q)<-[:QuizNumQues]-(question)-[:QuesFromChapter]->(chapter)<-[:ChapterOfSubject]-(subject:Subject)
                 MATCH (teacher:Teacher)-[:Attempt]->(q)
                 MATCH (teacher)-[:TeachesIn]->(class:Class {ClassNumber: $classNumber})
                 WITH subject.SubjectName AS subjectName, count(DISTINCT q) AS completedQuizCount
                 RETURN subjectName, completedQuizCount`,
            { classNumber }
          );
  
          // Fetch incomplete quizzes
          const incompleteQuizResult = await session.run(
            userType === "Both"
              ? `MATCH (q:Quiz)-[:CorrectAnswer|:WrongAnswer]->(question:Question)
                 WITH q, count(question) AS answeredQuestions
                 WHERE answeredQuestions < 5
                 MATCH (q)<-[:QuizNumQues]-(question)-[:QuesFromChapter]->(chapter)<-[:ChapterOfSubject]-(subject:Subject)
                 MATCH (person)-[:Attempt]->(q)
                 MATCH (person)-[:StudyIn|:TeachesIn]->(class:Class {ClassNumber: $classNumber})
                 WHERE person:Student OR person:Teacher
                 WITH subject.SubjectName AS subjectName, count(DISTINCT q) AS incompleteQuizCount
                 RETURN subjectName, incompleteQuizCount`
              : userType === "Student"
              ? `MATCH (q:Quiz)-[:CorrectAnswer|:WrongAnswer]->(question:Question)
                 WITH q, count(question) AS answeredQuestions
                 WHERE answeredQuestions < 5
                 MATCH (q)<-[:QuizNumQues]-(question)-[:QuesFromChapter]->(chapter)<-[:ChapterOfSubject]-(subject:Subject)
                 MATCH (student:Student)-[:Attempt]->(q)
                 MATCH (student)-[:StudyIn]->(class:Class {ClassNumber: $classNumber})
                 WITH subject.SubjectName AS subjectName, count(DISTINCT q) AS incompleteQuizCount
                 RETURN subjectName, incompleteQuizCount`
              : `MATCH (q:Quiz)-[:CorrectAnswer|:WrongAnswer]->(question:Question)
                 WITH q, count(question) AS answeredQuestions
                 WHERE answeredQuestions < 5
                 MATCH (q)<-[:QuizNumQues]-(question)-[:QuesFromChapter]->(chapter)<-[:ChapterOfSubject]-(subject:Subject)
                 MATCH (teacher:Teacher)-[:Attempt]->(q)
                 MATCH (teacher)-[:TeachesIn]->(class:Class {ClassNumber: $classNumber})
                 WITH subject.SubjectName AS subjectName, count(DISTINCT q) AS incompleteQuizCount
                 RETURN subjectName, incompleteQuizCount`,
            { classNumber }
          );
  
          // Process the data for completed quizzes
          const completedQuizData = completedQuizResult.records.map((record) => ({
            subject: record.get("subjectName"),
            count: record.get("completedQuizCount").toInt(),
          })).filter((item) => item.subject.includes(`Class ${classNumber}`))
          .sort((a, b) => b.count - a.count);
  
          // Process the data for incomplete quizzes
          const incompleteQuizData = incompleteQuizResult.records.map((record) => ({
            subject: record.get("subjectName"),
            count: record.get("incompleteQuizCount").toInt(),
          })).filter((item) => item.subject.includes(`Class ${classNumber}`))
          .sort((a, b) => b.count - a.count);
  
          setClassSubjectCompletedQuizData(completedQuizData);
          setClassSubjectIncompleteQuizData(incompleteQuizData);
        } catch (error) {
          console.error("Error fetching class data:", error);
        } finally {
          session.close();
        }
      };
      fetchClassSubjectQuizData();
    }
  }, [classNumber, userType]);

  useEffect(() => {
    const session = driver.session();

    const fetchUserCount = async () => {
      try {
        const result = await session.run(
          userType === "Both"
            ? `MATCH (p)-[:Attempt]->(:Quiz) WHERE p:Student OR p:Teacher RETURN COUNT(DISTINCT p) AS distinctParticipantCount`
            : `MATCH (p)-[:Attempt]->(:Quiz) WHERE p:${userType} RETURN COUNT(DISTINCT p) AS distinctParticipantCount`
        );
        const distinctParticipantCount = result.records[0]
          .get("distinctParticipantCount")
          .toInt();
        setUserCount(distinctParticipantCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    const fetchCountOfCompletedQuiz = async () => {
      try {
        const result = await session.run(
          userType === "Both"
            ? `MATCH (p)-[:Attempt]->(quiz:Quiz) OPTIONAL MATCH (quiz)-[r]->(question:Question) WHERE type(r) IN ['CorrectAnswer', 'WrongAnswer'] WITH quiz, count(r) AS TotalAnswers WHERE TotalAnswers = 5 RETURN count(quiz.QuizNum) as totalQuizCompleteCount`
            : `MATCH (p:${userType})-[:Attempt]->(quiz:Quiz) OPTIONAL MATCH (quiz)-[r]->(question:Question) WHERE type(r) IN ['CorrectAnswer', 'WrongAnswer'] WITH quiz, count(r) AS TotalAnswers WHERE TotalAnswers = 5 RETURN count(quiz.QuizNum) as totalQuizCompleteCount`
        );
        const quizCount = result.records[0]
          .get("totalQuizCompleteCount")
          .toInt();
        setQuizCompletedCount(quizCount);
      } catch (error) {
        console.error("Error fetching quiz count:", error);
      }
    };

    const fetchUserTypeQuizCount = async () => {
      try {
        const result = await session.run(
          userType === "Both"
            ? `MATCH (p)-[:Attempt]->(quiz:Quiz) WHERE p:Student OR p:Teacher RETURN COUNT(quiz) AS userTypeQuizCount`
            : `MATCH (p:${userType})-[:Attempt]->(quiz:Quiz) RETURN COUNT(quiz) AS userTypeQuizCount`
        );
        const userTypeQuizCount = result.records[0]
          .get("userTypeQuizCount")
          .toInt();
        setUserTypeQuizCount(userTypeQuizCount);
      } catch (error) {
        console.error(`Error fetching ${userType} quiz count:`, error);
      }
    };

    const fetchDailyQuizData = async () => {
      try {
        const result = await session.run(
          userType === "Both"
            ? `MATCH (p)-[:Attempt]->(q:Quiz)
OPTIONAL MATCH (q)-[r:CorrectAnswer|WrongAnswer]->(ans)
WITH q, p, 
     CASE 
         WHEN q.createdAt IS NOT NULL THEN datetime(q.createdAt)
         ELSE min(datetime(r.Attempted_On))
     END AS dateAttempted
WHERE dateAttempted IS NOT NULL
RETURN date(dateAttempted) AS quizDate, count(DISTINCT q) AS DailyQuizPlayedCount
ORDER BY quizDate`
            : `MATCH (p:${userType})-[:Attempt]->(q:Quiz)
OPTIONAL MATCH (q)-[r:CorrectAnswer|WrongAnswer]->(ans)
WITH q, p, 
     CASE 
         WHEN q.createdAt IS NOT NULL THEN datetime(q.createdAt)
         ELSE min(datetime(r.Attempted_On))
     END AS dateAttempted
WHERE dateAttempted IS NOT NULL
RETURN date(dateAttempted) AS quizDate, count(DISTINCT q) AS DailyQuizPlayedCount
ORDER BY quizDate
            `
        );
        const dailyData = result.records.map((record) => ({
          date: record.get("quizDate").toString(),
          count: record.get("DailyQuizPlayedCount").toInt(),
        }));
        setDailyQuizData(dailyData);
      } catch (error) {
        console.error("Error fetching daily quiz data:", error);
      }
    };

    const fetchDailyUniqueUsersData = async () => {
      try {
        const result = await session.run(
          userType === "Both"
            ? `MATCH (p)-[:Attempt]->(q:Quiz)
OPTIONAL MATCH (q)-[r:CorrectAnswer|WrongAnswer]->(ans)
WITH q, p, 
     CASE 
         WHEN q.createdAt IS NOT NULL THEN datetime(q.createdAt)
         ELSE min(datetime(r.Attempted_On))
     END AS dateAttempted
WHERE dateAttempted IS NOT NULL
RETURN date(dateAttempted) AS quizDate, count(DISTINCT p) AS DailyUniqueUsers
ORDER BY quizDate`
            : `MATCH (p:${userType})-[:Attempt]->(q:Quiz)
OPTIONAL MATCH (q)-[r:CorrectAnswer|WrongAnswer]->(ans)
WITH q, p, 
     CASE 
         WHEN q.createdAt IS NOT NULL THEN datetime(q.createdAt)
         ELSE min(datetime(r.Attempted_On))
     END AS dateAttempted
WHERE dateAttempted IS NOT NULL
RETURN date(dateAttempted) AS quizDate, count(DISTINCT p) AS DailyUniqueUsers
ORDER BY quizDate`
        );
        const dailyUniqueData = result.records.map((record) => ({
          date: record.get("quizDate").toString(),
          count: record.get("DailyUniqueUsers").toInt(),
        }));
        setDailyUniqueUsersData(dailyUniqueData);
      } catch (error) {
        console.error("Error fetching daily unique users data:", error);
      }
    };

    const fetchData = async () => {
      await fetchUserCount();
      await fetchCountOfCompletedQuiz();
      // await fetchTotalQuiz();
      await fetchUserTypeQuizCount();
      await fetchDailyQuizData();
      await fetchDailyUniqueUsersData();
      await session.close();
    };

    fetchData();
  }, [userType]); // Rerun the effect when userType changes

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const completedSubjectPieData = {
    labels: classSubjectCompletedQuizData.map((data) => data.subject),
    datasets: [
      {
        label: "Completed Quizzes by Subject",
        data: classSubjectCompletedQuizData.map((data) => data.count),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const IncompleteSubjectPieData = {
    labels: classSubjectIncompleteQuizData.map((data) => data.subject),
    datasets: [
      {
        label: "Completed Quizzes by Subject",
        data: classSubjectIncompleteQuizData.map((data) => data.count),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const pieData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        label: "Quiz Completion",
        data: [quizCompletedCount, userTypeQuizCount - quizCompletedCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const DailyQuizLineData = {
    labels: dailyQuizData.map((data) => data.date),
    datasets: [
      {
        label: "Daily Quiz Played",
        data: dailyQuizData.map((data) => data.count),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
    ],
  };
  const UniqueUserLineData = {
    labels: dailyUniqueUsersData.map((data) => data.date),
    datasets: [
      {
        label: "Daily Unique Users",
        data: dailyUniqueUsersData.map((data) => data.count),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
    ],
  };

  return (
    <div className="quiz-analytics">
      <SidebarCom />
      <div className="content">
        <h1>Quiz Analytics</h1>
        <br />
        <div className="dropdown">
          <select
            className="user-type-dropdown"
            value={userType}
            onChange={handleUserTypeChange}
          >
            <option value="Both">Both</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>
        <br />
        <div>
          <div className="total-quiz-count-container">
            <div>
              <p className="analytic-topic">Total Quiz Count:</p>
            </div>
            <div className="total-quiz-count">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Unique Users Played Quiz</td>
                    <td>{userCount}</td>
                  </tr>
                  <tr>
                    <td>Total Quiz Played</td>
                    <td>{userTypeQuizCount}</td>
                  </tr>
                  <tr>
                    <td>Quiz Completed</td>
                    <td>{quizCompletedCount}</td>
                  </tr>
                  <tr>
                    <td>Incomplete Quiz</td>
                    <td>{userTypeQuizCount - quizCompletedCount}</td>
                  </tr>
                </tbody>
              </table>
              <br />
              <div className="total-quiz-pie-container">
                <Pie data={pieData} />
              </div>
            </div>
          </div>

          <div className="daily-quiz-count-container">
            <div className="daily-quiz-count-heading">
              <p className="analytic-topic">Daily Quiz Count:</p>
            </div>
            <div className="daily-quiz-line-container">
              <Line
                data={DailyQuizLineData}
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
          </div>

          <div className="daily-unique-users-container">
            <div className="daily-unique-users-heading">
              <p className="analytic-topic">Daily Unique Users:</p>
            </div>
            <div className="daily-unique-users-bar-container">
              <Line
                data={UniqueUserLineData}
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
          </div>
          <div className="Subject-class-quiz-analytics">
            <p className="analytic-topic">Subject Class Quiz Analytics</p>
            <div className="class-dropdown">
              <select
                className="class-number-dropdown"
                value={classNumber}
                onChange={handleClassChange}
              >
                <option value="">Select Class</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                {/* Add more classes as needed */}
              </select>
            </div>
            <div className="Subject-class-quiz-analytics-container" >
              <h4>1. Subject List Of Completed Quiz</h4>
            {classSubjectCompletedQuizData.length > 0 && (
              <div className="pie-chart-container">
                <div className="chart-and-list">
                  <div className="subject-list">
                    <h5>Subject Breakdown</h5>
                    <table>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Completed Quizzes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classSubjectCompletedQuizData.map((data, index) => (
                          <tr key={index}>
                            <td>{data.subject}</td>
                            <td>{data.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="pie-chart">
                    <Pie data={completedSubjectPieData} />
                  </div>
                </div>
              </div>
            )}
            </div>
            <div className="Subject-class-quiz-analytics-container">
            <h4>2. Subject List Of Incomplete Quiz</h4>
            {classSubjectIncompleteQuizData.length > 0 && (
              <div className="pie-chart-container">
                <div className="chart-and-list">
                  <div className="subject-list">
                    <h5>Subject Breakdown</h5>
                    <table>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Incomplete Quizzes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classSubjectIncompleteQuizData.map((data, index) => (
                          <tr key={index}>
                            <td>{data.subject}</td>
                            <td>{data.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="pie-chart">
                    <Pie data={IncompleteSubjectPieData} />
                  </div>
                </div>
              </div>
            )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
