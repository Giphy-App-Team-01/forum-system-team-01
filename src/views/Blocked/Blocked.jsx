import "./Blocked.css";

const Blocked = () => {
  return (
    <div className="blocked-container">
      <div className="blocked-card">
        <h1>🚫 Access Denied</h1>
        <p>Your account has been blocked by an administrator.</p>
        <p>If you believe this is a mistake, please contact support.</p>
      </div>
    </div>
  );
};

export default Blocked;

