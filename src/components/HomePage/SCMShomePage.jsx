import image from "../images/SCMS-removebg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersCog,
  faWarehouse,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./SCMShomePage.css";

function SCMShomePage() {
  return (
    <div className="HomePage">
      <nav>
        <div className="menu"></div>
      </nav>
      <section id="home">
        <div className="img"></div>
        <div className="center">
          <img src={image} alt="SCMS Logo" width="300" />
          <div id="title">Supply Chain Management System</div>
          <div className="btns">
            <Link to="/register">
              <button>Register</button>
            </Link>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        </div>
      </section>
      <section id="services">
        <div className="content">
          <h2>Our Services</h2>
          <div className="service-card">
            <i
              style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "rotate(360deg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "rotate(0deg)")
              }
            >
              <FontAwesomeIcon icon={faUsersCog} />
            </i>
            <h3>Facilitate Communication</h3>
            <p>
              Our services facilitate communication and collaboration between
              all supply chain stakeholders.
            </p>
          </div>
          <div className="service-card">
            <i
              style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "rotate(360deg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "rotate(0deg)")
              }
            >
              <FontAwesomeIcon icon={faWarehouse} />
            </i>
            <h3>Inventory Management</h3>
            <p>Efficiently managing and optimizing inventory.</p>
          </div>
          <div className="service-card">
            <i
              style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "rotate(360deg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "rotate(0deg)")
              }
            >
              <FontAwesomeIcon icon={faHandshake} />
            </i>
            <h3>Enhanced Collaboration</h3>
            <p>
              Our platform unifies all supply chain stakeholders, fostering
              seamless cooperation.
            </p>
          </div>
        </div>
      </section>
      <footer>
        <h5>
          &copy; 2024 Supply Chain Management System. All rights reserved.
        </h5>
      </footer>
    </div>
  );
}

export default SCMShomePage;
