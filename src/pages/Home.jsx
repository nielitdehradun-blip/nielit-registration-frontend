import { useNavigate } from "react-router-dom";
import "../style/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="card">
        <h1>Student Enquiry Portal</h1>

        <div className="buttons">
          <button
            className="btn register-btn"
            onClick={() => navigate("/register")}
          >
            Registration
          </button>

          <button
            className="btn students-btn"
            onClick={() => navigate("/students")}
          >
            Check Registered Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;