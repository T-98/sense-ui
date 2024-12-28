import { useState, useEffect } from "react";
import AIButton from "./components/AIButton";
import AIInput from "./components/AIInput";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNavClick = (e, uid) => {
    console.log("Navigation Button clicked!", uid, e.target);
  };

  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNameInputChange = (e) => {
    setName(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with email:", email);
  };

  const handleAction = (e, uid) => {
    console.log("Action Button clicked!", uid, e.target);
  };

  const handleSupport = (e, uid) => {
    console.log("Support Button clicked!", uid, e.target);
  };

  return (
    <>
      <AIButton id="random-btn-001" purpose="random">
        Hello
      </AIButton>
      <nav>
        <AIButton
          id="nav-btn-001"
          purpose="navigateHome"
          label="Home"
          onClick={(e) => handleNavClick(e, "nav-btn-001")}
        />
        <AIButton
          id="nav-btn-002"
          purpose="navigateAbout"
          label="About"
          onClick={(e) => handleNavClick(e, "nav-btn-002")}
        />
      </nav>
      <main>
        <form>
          <AIInput
            id="input-001"
            purpose="collectUserEmail"
            placeholder="name@example.com"
            value={email}
            onChange={handleEmailInputChange}
          />
          <AIInput
            id="input-002"
            purpose="collectUserName"
            placeholder="Firstname Lastname"
            value={name}
            onChange={handleNameInputChange}
          />
          <AIButton
            id="btn-001"
            purpose="submitForm"
            label="Submit"
            onClick={(e) => handleFormSubmit(e)}
          />
        </form>
        <section>
          <AIButton
            id="section-btn-001"
            purpose="performAction"
            label="Action"
            onClick={(e) => handleAction(e, "section-btn-001")}
          />
        </section>
      </main>
      <footer>
        <AIButton
          id="footer-btn-001"
          purpose="contactSupport"
          label="Support"
          onClick={(e) => handleSupport(e, "footer-btn-001")}
        />
      </footer>
    </>
  );
}

export default App;
