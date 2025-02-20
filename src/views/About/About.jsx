import "./About.css";

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Who We Are & What We Do</h1>
        <p>Empowering users with engaging content and meaningful discussions.</p>
      </header>

      <section className="about-mission">
        <h2>🚀 Our Mission</h2>
        <p>
          Our mission is to create a vibrant and engaging platform where users
          can share ideas, discuss topics, and connect with like-minded individuals.
        </p>
      </section>

      <section className="about-features">
        <h2>🔥 Why Choose Us?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>💬 Active Community</h3>
            <p>Join thousands of users who actively engage in discussions.</p>
          </div>
          <div className="feature-item">
            <h3>🔒 Secure & Safe</h3>
            <p>We prioritize security and ensure a safe space for conversations.</p>
          </div>
          <div className="feature-item">
            <h3>🚀 Constantly Improving</h3>
            <p>Our platform is always evolving with new features and updates.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>👨‍💻 Meet Our Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src="/src/assets/images/dimitar.png" alt="Team Member" />
            <h3>Dimitar Srabski</h3>
          </div>
          <div className="team-member">
            <img src="/src/assets/images/plamen.png" alt="Team Member" />
            <h3>Plamen Yordanov</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
