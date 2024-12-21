import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import AIButton from "./components/AIButton";
import InputComponent from "./components/InputComponent";

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleClick = (e, uid) => {
    console.log("Button clicked!", uid, e.target);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <AIButton
        uid="btn-001"
        purpose="submitForm"
        onClick={(e) => handleClick(e, "btn-001")}
        label="Submit"
      />
      <InputComponent
        placeholder="name@example.com"
        value={inputValue}
        onChange={handleInputChange}
      />
      <AIButton
        uid="btn-002"
        purpose="cancel"
        onClick={(e) => handleClick(e, "btn-002")}
        label="Cancel"
      />
    </>
  );
}

export default App;
