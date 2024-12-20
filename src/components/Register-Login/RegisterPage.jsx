import React, { useState } from "react";
import "./Registration-Login-Style.css";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authAPI";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    userType: "",
    category: "",
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const categories = [
    "Agriculture and Food Products",
    "Pharmaceuticals and Medical Supplies",
    "Chemicals and Metals",
    "Fast-Moving Consumer Goods (FMCG)",
    "Electronics and Electrical Equipment",
    "Textiles and Apparel",
    "Renewable Energy and Advanced Technology",
    "Construction and Building Materials",
    "Automotive and Transportation Equipment",
    "Paper and Packaging Products",
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name !== "full_name" &&
      name !== "category" &&
      !/^[A-Za-z0-9!@#$%^&*(),?":{}|<>.]*$/.test(value)
    ) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("be at least 8 characters long");
    }
    if (!/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/.test(password)) {
      errors.push("contain only English letters, numbers, or allowed symbols");
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push("contain at least one letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("contain at least one symbol");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      full_name,
      email,
      phone_number,
      password,
      confirm_password,
      userType,
      category,
    } = formData;

    if (!/^\d{10}$/.test(phone_number)) {
      setErrors([
        "Phone number must be exactly 10 digits and contain only numbers.",
      ]);
      return;
    }

    if (password !== confirm_password) {
      setErrors(["Password does not match."]);
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      const combinedPasswordError = `Password must ${passwordErrors.join(
        ", "
      )}.`;
      setErrors([combinedPasswordError]);
      return;
    }

    if (!userType) {
      setErrors(["Please select a user type."]);
      return;
    }

    if (
      ["manufacturer", "supplier", "distributor"].includes(userType) &&
      !category
    ) {
      setErrors(["Please select a category for this user type."]);
      return;
    }

    try {
      const responseData = await registerUser(
        full_name,
        email,
        phone_number,
        password,
        confirm_password,
        userType,
        category
      );

      setSuccessMessage(responseData.message);
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
        userType: "",
        category: "",
      });

      setErrors([]);
      navigate("/login");
    } catch (error) {
      setErrors([error.message || "Error registering user."]);
    }
  };

  return (
    <div className="main-container">
      <div className="containerRegisterLogin">
        <div className="form register">
          <span className="title">Registration</span>

          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                type="text"
                name="full_name"
                placeholder="Full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <i className="uil uil-user"></i>
            </div>

            <div className="input-field">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="uil uil-envelope icon"></i>
            </div>

            <div className="input-field">
              <input
                type="text"
                name="phone_number"
                placeholder="Phone number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
              <i className="uil uil-phone"></i>
            </div>

            <div className="input-field">
              <input
                type={showPassword ? "text" : "password"} // Toggle password field
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="uil uil-lock icon"></i>
              <i
                className={`uil ${
                  showPassword ? "uil-eye" : "uil-eye-slash"
                } showHidePw`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            <div className="input-field">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle confirm password field
                name="confirm_password"
                placeholder="Confirm password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
              <i className="uil uil-lock icon"></i>
              <i
                className={`uil ${
                  showConfirmPassword ? "uil-eye" : "uil-eye-slash"
                } showHidePw`}
                onClick={toggleConfirmPasswordVisibility}
              ></i>
            </div>

            <div className="select-field">
              <select
                name="userType"
                className="stakeholders"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="">Select user type</option>
                <option value="transporter">Transporter</option>
                <option value="supplier">Supplier</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="retailer">Retailer</option>
              </select>
              <i className="uil uil-users-alt"></i>
            </div>
            {/* Display the classification category only if userType is appropriate */}
            {["manufacturer", "supplier", "distributor"].includes(
              formData.userType
            ) && (
              <div className="select-field">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <i className="uil uil-list-ul"></i>
              </div>
            )}

            <div className="input-field button">
              <input type="submit" value="Register" />
            </div>

            <div className="Registration-signin">
              <span className="text">
                Already have an account?{" "}
                <Link to="/login" className="text signin-text">
                  Sign In
                </Link>
              </span>
            </div>
          </form>

          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <div key={index} className="error">
                  {error}
                </div>
              ))}
            </div>
          )}

          {successMessage && <div className="success">{successMessage}</div>}
        </div>

        <footer>
          <h5>
            &copy; 2024 Smart Contract for Supply Chain Management and
            Optimization. All rights reserved.
          </h5>
        </footer>
      </div>
    </div>
  );
}

export default RegisterPage;
