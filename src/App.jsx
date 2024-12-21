import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import AIButton from "./components/AIButton";
import AIInput from "./components/AIInput";

function App() {
  const [firstnameValue, setFirstnameValue] = useState("");
  const [lastnameValue, setLastnameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      // Send form data to server
      console.log("Form submitted!", {
        firstname: firstnameValue,
        lastname: lastnameValue,
        email: emailValue,
      });
    }
  }, [isSubmitted, setIsSubmitted]);

  const handleFormAction = (e, isSubmitted) => {
    setIsSubmitted(isSubmitted);
    return;
  };

  const handleInputChange = (e, uid) => {
    switch (uid) {
      case "input-002":
        setFirstnameValue(e.target.value);
        break;
      case "input-003":
        setLastnameValue(e.target.value);
        break;
      case "input-001":
        setEmailValue(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AIInput
        uid="input-004"
        purpose="readonly"
        placeholder="GarbaGE"
        type="readonly"
      />
      <AIInput
        uid="input-002"
        purpose="CollectUserFirstName"
        placeholder="Firstname"
        value={firstnameValue}
        onChange={(e) => handleInputChange(e, "input-002")}
      />
      <AIInput
        uid="input-003"
        purpose="collectUserLastName"
        placeholder="Lastname"
        value={lastnameValue}
        onChange={(e) => handleInputChange(e, "input-003")}
      />
      <AIInput
        uid="input-001"
        purpose="collectUserEmail"
        placeholder="name@example.com"
        value={emailValue}
        onChange={(e) => handleInputChange(e, "input-001")}
      />
      <AIButton
        uid="btn-001"
        purpose="submitForm"
        onClick={(e) => handleFormAction(e, true)}
        label="Submit"
      />
      <AIButton
        uid="btn-002"
        purpose="cancel"
        onClick={(e) => handleFormAction(e, false)}
        label="Cancel"
      />
    </>
  );
}

export default App;
