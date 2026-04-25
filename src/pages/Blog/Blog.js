import React from "react";
import "./blog.css";
import data from "./table-data.json";
import tokenData from "./token-data.json";
import { useState } from "react";
import FooterComp from "../../components/Footer/Footer";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [tokenCurrentPage, setTokenCurrentPage] = useState(0);
  const [expandedCells, setExpandedCells] = useState({});
  const rowsPerPage = 1;
  const totalPages = Math.ceil(data.data.length / rowsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const tokenNextPage = () => {
    if (tokenCurrentPage < totalPages - 1) {
      setTokenCurrentPage(tokenCurrentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const tokenPrevPage = () => {
    if (tokenCurrentPage > 0) {
      setTokenCurrentPage(tokenCurrentPage - 1);
    }
  };

  const truncateText = (text) => {
    if (text?.length > 300) {
      return (
        <span>
          {text.substring(0, 300)}...
          <span className="tooltip">{text}</span>
        </span>
      );
    }
    return text;
  };

  const toggleReadMore = (rowIndex, key) => {
    setExpandedCells((prev) => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [key]: !prev[rowIndex]?.[key],
      },
    }));
  };

  const truncateTextAtFullStop = (text, maxLength) => {
    if (text.length <= maxLength) {
      return { truncated: text, isTruncated: false };
    }

    const fullStopIndex = text.lastIndexOf(".", maxLength);
    if (fullStopIndex === -1) {
      return { truncated: text, isTruncated: false };
    }

    return {
      truncated: text.substring(0, fullStopIndex + 1),
      isTruncated: true,
    };
  };

  const renderCellContent = (rowIndex, key, text, maxLength = 300) => {
    const { truncated, isTruncated } = truncateTextAtFullStop(text, maxLength);
    return (
      <div>
        {expandedCells[rowIndex]?.[key] || !isTruncated ? text : truncated}
        {isTruncated && (
          <button
            onClick={() => toggleReadMore(rowIndex, key)}
            className="read-more-btn"
          >
            {expandedCells[rowIndex]?.[key] ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  const getCellStyle = (row, pageIndex, column) => {
    if (
      (pageIndex === 0 && column === "Mistral Remark") ||
      (pageIndex === 1 && column === "Mistral Remark") ||
      (pageIndex === 2 && column === "Mistral Remark") ||
      (pageIndex === 0 && column === "ChatGPT Remark")
    ) {
      return { color: "yellow" };
    }
    return {};
  };

  const currentData = data.data.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const tokenCurrentData = tokenData.tokenData.slice(
    tokenCurrentPage * rowsPerPage,
    (tokenCurrentPage + 1) * rowsPerPage
  );

  return (
    <>
      <div className="blog-container">
        <div className="blog-head">
          <h1>Introducing Vidyam LLM: Tailored Learning for NCERT Syllabus</h1>
          <p>July 26, 2024</p>
        </div>

        <div className="blog-head-bottom"></div>
        <div className="blog-content">
          <p>
            We are excited to announce the launch of Vidyam LLM, our series of
            proprietary large language models (LLMs) specifically designed to
            enhance student learning by aligning with the NCERT syllabus.
            Educational disparities globally create unequal learning
            opportunities, and in India, the gap between urban and rural regions
            is even more pronounced. Vidyam AI is a purpose-driven deep tech
            start-up dedicated to transforming education through cutting-edge
            AI-first technologies designed to solve lifelong educational
            challenges. These models are fine-tuned to provide accurate,
            grade-specific responses that match students' textbooks and
            curriculum requirements.
          </p>
          <br></br>
          <img src="/images/blog_img.jpg" alt="blog_image"></img>
          <br></br>
          <br></br>
          <h3>The Challenge with General-Purpose LLMs</h3>
          <p>
            General-purpose LLMs like ChatGPT, Mistral, LLAMA, or Gemini, while
            comprehensive, often fall short in delivering precise educational
            content tailored to specific curricula. These models can provide
            responses that are either too verbose or off-target for the specific
            needs of students. For instance, a class 6 student inquiring about
            "gravity" might receive an overly complex explanation, leading to
            confusion rather than clarity. Vidyam LLM addresses this gap by
            generating responses that are directly aligned with the students'
            textbooks and syllabus..
          </p>
          <br></br>
          <p>
            Take a look at how it works for the NCERT Class 6 science subject.
            In the table below, we have selected a few questions from the
            exercises of different chapters. We also use answers from a solved
            book as our baseline. The table illustrates how Vidyam LLM's answers
            are aligned and precise according to the grade level and the NCERT
            book and syllabus. In contrast, other general-purpose models provide
            answers that are either incorrect, vague, or overly complex, and do
            not align with the 6th-grade student understanding level or the
            NCERT book and syllabus.
          </p>
          <div className="table-top">
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 0}>
                Prev
              </button>
              <span>
                {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
          <div className="desktop-table table">
            <table>
              <thead>
                <tr>
                  <td>Question</td>
                  <td>NCERT Answer</td>
                  <td>Vidyam LLM</td>
                  <td>Llama 2 13b</td>
                  <td>Mistral 7b</td>
                  <td>ChatGPT</td>
                  <td>Gemini</td>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td title={row.Question}>
                        {renderCellContent(index, "Question", row.Question)}
                      </td>
                      <td title={row.Answer}>
                        {renderCellContent(index, "Answer", row.Answer)}
                      </td>
                      <td title={row["Vidyam LLM"]}>
                        {renderCellContent(
                          index,
                          "Vidyam LLM",
                          row["Vidyam LLM"]
                        )}
                      </td>
                      <td title={row["Llama 2 13b"]}>
                        {renderCellContent(
                          index,
                          "Llama 2 13b",
                          row["Llama 2 13b"]
                        )}
                      </td>
                      <td title={row["Mistral 7b"]}>
                        {renderCellContent(
                          index,
                          "Mistral 7b",
                          row["Mistral 7b"]
                        )}
                      </td>
                      <td title={row["ChatGPT"]}>
                        {renderCellContent(index, "ChatGPT", row["ChatGPT"])}
                      </td>
                      <td title={row["Gemini"]}>
                        {renderCellContent(index, "Gemini", row["Gemini"])}
                      </td>
                    </tr>
                    <tr className="remarks-row">
                      <td
                        style={{ background: "#2c5437" }}
                        title={row.Remarks.Question}
                      >
                        <b>
                          {renderCellContent(
                            index,
                            "Remarks.Question",
                            row.Remarks.Question
                          )}
                        </b>
                      </td>
                      <td title={row.Remarks.Answer}>
                        {renderCellContent(
                          index,
                          "Remarks.Answer",
                          row.Remarks.Answer
                        )}
                      </td>
                      <td title={row.Remarks["Vidyam LLM"]}>
                        {renderCellContent(
                          index,
                          "Remarks.Vidyam LLM",
                          row.Remarks["Vidyam LLM"]
                        )}
                      </td>
                      <td title={row.Remarks["Llama 2 13b"]}>
                        {renderCellContent(
                          index,
                          "Remarks.Llama 2 13b",
                          row.Remarks["Llama 2 13b"]
                        )}
                      </td>
                      <td title={row.Remarks["Mistral 7b"]} style={getCellStyle(row, currentPage, "Mistral Remark")}>
                        {renderCellContent(
                          index,
                          "Remarks.Mistral 7b",
                          row.Remarks["Mistral 7b"]
                        )}
                      </td>
                      <td title={row.Remarks["ChatGPT"]} style={getCellStyle(row, currentPage, "ChatGPT Remark")}>
                        {renderCellContent(
                          index,
                          "Remarks.ChatGPT",
                          row.Remarks["ChatGPT"]
                        )}
                      </td>
                      <td title={row.Remarks["Gemini"]}>
                        {renderCellContent(
                          index,
                          "Remarks.Gemini",
                          row.Remarks["Gemini"]
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="mobile-table table">
            {currentData.map((row, index) => (
              <React.Fragment key={index}>
                <table>
                  {/* <thead>
                    <tr>
                      <td>Details</td>
                      <td>Info</td>
                      <td>Remark</td>
                    </tr>
                  </thead> */}
                  <tbody>
                    <tr>
                      <td>Question</td>
                      <td colSpan="1" title={row.Question}>
                        {renderCellContent(index, "Question", row.Question)}
                      </td>
                      <td style={{background:'#2c5437'}}>Remark</td>
                    </tr>
                    <tr>
                      <td>NCERT Answer</td>
                      <td title={row.Answer}>
                        {renderCellContent(index, "Answer", row.Answer)}
                      </td>
                      <td title={row.Remarks.Answer}>
                        {renderCellContent(
                          index,
                          "Remarks.Answer",
                          row.Remarks.Answer
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Vidyam LLM</td>
                      <td title={row["Vidyam LLM"]}>
                        {renderCellContent(
                          index,
                          "Vidyam LLM",
                          row["Vidyam LLM"]
                        )}
                      </td>
                      <td title={row.Remarks["Vidyam LLM"]}>
                        {renderCellContent(
                          index,
                          "Remarks.Vidyam LLM",
                          row.Remarks["Vidyam LLM"]
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Llama 2 13b</td>
                      <td title={row["Llama 2 13b"]}>
                        {renderCellContent(
                          index,
                          "Llama 2 13b",
                          row["Llama 2 13b"]
                        )}
                      </td>
                      <td title={row.Remarks["Llama 2 13b"]}>
                        {renderCellContent(
                          index,
                          "Remarks.Llama 2 13b",
                          row.Remarks["Llama 2 13b"]
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Mistral 7b</td>
                      <td title={row["Mistral 7b"]} >
                        {renderCellContent(
                          index,
                          "Mistral 7b",
                          row["Mistral 7b"]
                        )}
                      </td>
                      <td title={row.Remarks["Mistral 7b"]} style={getCellStyle(row, currentPage, "Mistral Remark")}>
                        {renderCellContent(
                          index,
                          "Remarks.Mistral 7b",
                          row.Remarks["Mistral 7b"]
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>ChatGPT</td>
                      <td title={row["ChatGPT"]}>
                        {renderCellContent(index, "ChatGPT", row["ChatGPT"])}
                      </td>
                      <td title={row.Remarks["ChatGPT"]} style={getCellStyle(row, currentPage, "ChatGPT Remark")}>
                        {renderCellContent(
                          index,
                          "Remarks.ChatGPT",
                          row.Remarks["ChatGPT"]
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Gemini</td>
                      <td title={row["Gemini"]}>
                        {renderCellContent(index, "Gemini", row["Gemini"])}
                      </td>
                      <td title={row.Remarks["Gemini"]}>
                        {renderCellContent(
                          index,
                          "Remarks.Gemini",
                          row.Remarks["Gemini"]
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ))}
          </div>
          <br></br>
          <h3>Cost and Time Efficiency</h3>
          <p>
            Vidyam LLM is optimized for cost and time efficiency, benefiting
            both B2B customers and students. General-purpose LLMs often consume
            more tokens and take longer to generate responses because they are
            not tuned for the student persona or specific syllabus guidelines.
            This leads to generic, verbose answers that are not always helpful.
            In contrast, Vidyam LLMs are designed to provide concise, accurate
            responses that consume fewer tokens and are generated quickly. This
            optimization reduces costs and improves the user experience, making
            our models both economical and efficient.
          </p>
          <br></br>
          <div className="table-top">
            <div className="pagination">
              <button onClick={tokenPrevPage} disabled={tokenCurrentPage === 0}>
                Prev
              </button>
              <span>{tokenCurrentPage + 1} of 5</span>
              <button
                onClick={tokenNextPage}
                disabled={tokenCurrentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
          <div className="desktop-table table">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Vidyam LLM</th>
              <th>Llama 2 13b</th>
              <th>Mistral 7b</th>
              <th>ChatGPT</th>
              <th>Gemini</th>
            </tr>
          </thead>
          <tbody>
            {tokenCurrentData.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td title={row.Question}>
                    {truncateText(row.Question)}
                  </td>
                  <td title={row["Vidyam LLM"]}>
                    {truncateText(row["Vidyam LLM"])}
                  </td>
                  <td title={row["Llama 2 13b"]}>
                    {truncateText(row["Llama 2 13b"])}
                  </td>
                  <td title={row["Mistral 7b"]}>
                    {truncateText(row["Mistral 7b"])}
                  </td>
                  <td title={row["ChatGPT"]}>
                    {truncateText(row["ChatGPT"])}
                  </td>
                  <td title={row["Gemini"]}>
                    {truncateText(row["Gemini"])}
                  </td>
                </tr>
                <tr className="remarks-row">
                  <td style={{ background: "#2c5437" }} title={row.Remarks.Question}>
                    <b>{truncateText(row.Remarks.Question)}</b>
                  </td>
                  <td title={row.Remarks["Vidyam LLM"]}>
                    {truncateText(row.Remarks["Vidyam LLM"])}
                  </td>
                  <td title={row.Remarks["Llama 2 13b"]}>
                    {truncateText(row.Remarks["Llama 2 13b"])}
                  </td>
                  <td title={row.Remarks["Mistral 7b"]}>
                    {truncateText(row.Remarks["Mistral 7b"])}
                  </td>
                  <td title={row.Remarks["ChatGPT"]}>
                    {truncateText(row.Remarks["ChatGPT"])}
                  </td>
                  <td title={row.Remarks["Gemini"]}>
                    {truncateText(row.Remarks["Gemini"])}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="mobile-table table">
        {tokenCurrentData.map((row, index) => (
          <React.Fragment key={index}>
            <table>
              {/* <thead>
                <tr>
                  <th>Details</th>
                  <th>Info</th>
                  <th>Remark</th>
                </tr>
              </thead> */}
              <tbody>
                <tr>
                  <td>Question</td>
                  <td colSpan="1" title={row.Question}>
                    {truncateText(row.Question)}
                  </td>
                  <td style={{background:'#2c5437'}}>Remark</td>
                </tr>
                {/* <tr>
                  <td>NCERT Answer</td>
                  <td title={row.Answer}>
                    {truncateText(row.Answer)}
                  </td>
                  <td title={row.Remarks.Answer}>
                    {truncateText(row.Remarks.Answer)}
                  </td>
                </tr> */}
                <tr>
                  <td>Vidyam LLM</td>
                  <td title={row["Vidyam LLM"]}>
                    {truncateText(row["Vidyam LLM"])}
                  </td>
                  <td title={row.Remarks["Vidyam LLM"]}>
                    {truncateText(row.Remarks["Vidyam LLM"])}
                  </td>
                </tr>
                <tr>
                  <td>Llama 2 13b</td>
                  <td title={row["Llama 2 13b"]}>
                    {truncateText(row["Llama 2 13b"])}
                  </td>
                  <td title={row.Remarks["Llama 2 13b"]}>
                    {truncateText(row.Remarks["Llama 2 13b"])}
                  </td>
                </tr>
                <tr>
                  <td>Mistral 7b</td>
                  <td title={row["Mistral 7b"]}>
                    {truncateText(row["Mistral 7b"])}
                  </td>
                  <td title={row.Remarks["Mistral 7b"]}>
                    {truncateText(row.Remarks["Mistral 7b"])}
                  </td>
                </tr>
                <tr>
                  <td>ChatGPT</td>
                  <td title={row["ChatGPT"]}>
                    {truncateText(row["ChatGPT"])}
                  </td>
                  <td title={row.Remarks["ChatGPT"]}>
                    {truncateText(row.Remarks["ChatGPT"])}
                  </td>
                </tr>
                <tr>
                  <td>Gemini</td>
                  <td title={row["Gemini"]}>
                    {truncateText(row["Gemini"])}
                  </td>
                  <td title={row.Remarks["Gemini"]}>
                    {truncateText(row.Remarks["Gemini"])}
                  </td>
                </tr>
              </tbody>
            </table>
          </React.Fragment>
        ))}
      </div>
          <br></br>
          <h3>Key Differentiators</h3>
          <section className="key-Differentiators">
            <ol>
              <li>
                <b>Curriculum-Specific Models:</b> Vidyam LLM is fine-tuned for
                the NCERT syllabus, ensuring relevance and accuracy.
              </li>
              <li>
                <b>Grade-Appropriate Responses:</b> The models provide
                explanations and examples tailored to the students' age and
                grade level.
              </li>
              <li>
                <b>Subject-Focused:</b> Initially focused on Science for classes
                6-12, with future plans to expand to other subjects.
              </li>
              <li>
                <b>Multilingual Support:</b> While currently available in
                English, we aim to support multiple Indian languages soon.
              </li>
            </ol>
          </section>
          <br></br>

          <h3>Our Flagship Products</h3>
          <p>
            Our flagship products, the{" "}
            <b>GenAI-based Student Copilot Platform (Saarthi)</b> and the{" "}
            <b>School's AI Copilot</b>, backed by our proprietary technologies
            and Vidyam LLM, tackle these challenges with hyper-personalized,
            AI-driven learning experiences. Already trusted by over a thousand
            students, Saarthi is transforming education and proving that
            high-quality, equitable learning is achievable. This is just the
            beginning. We're proud to build dedicated deep tech solutions for an
            often-overlooked education sector.
          </p>
          <br></br>
          <h3>Teacher Brain Technology</h3>
          <p>
            Vidyam AI is also developing Teacher Brain Technology, which aims to
            hyper-personalize every student's educational journey and study
            content. This technology will help students achieve their academic
            goals and prepare for competitive exams. Vidyam LLM serves as the
            backbone of this technology, harnessing the potential of
            educational-exclusive LLMs to provide tailored support for students.
          </p>
          <br></br>
          <h3>Technical Details of Vidyam LLM Fine-Tuning</h3>
          <p>
            We conducted supervised fine-tuning on the Mistral Model 7B to
            enable our LLM to emulate the communication style of an NCERT
            teacher. This fine-tuning approach aligns with our vision of
            delivering hyper-personalized content to all Vidyam AI students. By
            leveraging this technique, our models are able to comprehend student
            queries with remarkable accuracy. Once a query is received, it is
            routed to the most appropriate fine-tuned model based on the
            student's class and subject, ensuring an initial level of
            personalized responses that are highly relevant to the student's
            academic needs.
          </p>
          <p>
            Our fine-tuned model significantly outperformed all other available
            models in terms of both accuracy and syllabus alignment with the
            NCERT pattern. Initially, the Mistral 7B model had a correctness
            rate of 60%. However, after we applied our fine-tuning techniques,
            this rate increased dramatically to 94%. Additionally, the alignment
            with the NCERT syllabus saw substantial improvement, with 96% of the
            answers now being accurately aligned. This enhancement in
            performance highlights the effectiveness of our fine-tuning process
            in adapting the model to better meet the educational standards and
            requirements of the NCERT curriculum. Through these improvements, we
            have been able to provide students with more accurate and relevant
            educational content, ensuring a higher quality learning experience.
          </p>
          <p>
            Currently, we have successfully created a fine-tuned model for
            Science, which is already demonstrating significant improvements in
            student engagement and comprehension. The fine-tuning process for
            other subjects is actively ongoing, and we are committed to
            expanding our model library to cover the entire NCERT curriculum
            comprehensively.
          </p>
          <br></br>
          <h3>Future Plans</h3>
          <p>
            In addition to the above efforts, we have amassed a substantial
            dataset of over 30,000 real-time K-12 student questions, which is so
            far asked by students on our Saarthi Platform. These questions are
            also in the pipeline for fine-tuning, which will further enhance the
            responsiveness and accuracy of our models.
          </p>
          <p>
            Our goal is to create a dynamic and adaptive learning environment
            where each student receives support tailored to their unique
            learning needs. By continually refining our models with real student
            data, we aim to provide an unparalleled educational experience that
            fosters deeper understanding and academic excellence.
          </p>
          <br></br>
          <h3>Real-World Applications</h3>
          <p>
            Vidyam AI's technology offers substantial benefits for educational
            institutions, enabling personalized learning experiences. We invite
            B2B collaborations with schools, institutes, and online education
            platforms to extend the reach and impact of our technology, ensuring
            high-quality education is accessible to students across diverse
            regions.
          </p>
          <br></br>
          <h3>Our Vision</h3>
          <p>
            At Vidyam AI, we believe that fundamental educational challenges can
            be addressed through advanced AI technologies. Our goal is to go
            beyond mere digitization and create AI-driven solutions that
            hyper-personalize the learning experience, making education more
            engaging and effective.
          </p>
          <p>
            For more information or to explore collaboration opportunities,
            please contact us. Join us in revolutionizing education with
            cutting-edge AI.
          </p>
        </div>
      </div>
      {/* <Footer /> */}
      <FooterComp />
    </>
  );
};

export default Blog;
