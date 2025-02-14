import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth-service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await loginUser(formData.email, formData.password);
      navigate("/")
    } catch (err) {
      handleAuthError(err.code);
    } finally {
      setLoading(false);
    }
  };
  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential":
        toast.error("❌ Invalid email or password. Please try again.", { position: "top-right", autoClose: 4000 });
        break;
      case "auth/too-many-requests":
        toast.error("⚠️ Too many failed attempts. Try again later.", { position: "top-right", autoClose: 5000 });
        break;
      default:
        toast.error("⚠️ Something went wrong. Please try again.", { position: "top-right", autoClose: 5000 });
        break;
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="forgot-password">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>

      <div className="register-link">
        <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
