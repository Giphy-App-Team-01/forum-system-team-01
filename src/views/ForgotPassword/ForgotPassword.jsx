import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/auth-service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";
import Button from "../../components/Button/Button"; // Импортиране на Button компонента

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("⚠️ Please enter your email!");
      return;
    }

    console.log("Sending reset email to:", email);
    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success("✅ Password reset email sent! Check your inbox.");
      setEmail("");
    } catch (error) {
      toast.error(`❌ Error: ${error.message}`);
      console.error("Password reset error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="forgot-password-card">
        <h2>Forgot Password?</h2>
        <p>Enter your email and we&apos;ll send you a reset link.</p>
        <input
          type="email"
          className="forgot-password-input"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <div className="forgot-password-buttons">
          <Button
            className="reset-btn"
            onClickHandler={handleResetPassword}
            type="button"
          >
            {loading ? "Sending..." : "Reset Password"}
          </Button>
          <Button
            className="back-btn"
            onClickHandler={() => navigate("/login")}
            type="button"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
