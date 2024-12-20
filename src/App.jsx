import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import ButtonComponent from "./components/ButtonComponent";
import InputComponent from "./components/InputComponent";

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleClick = (e) => {
    console.log("Button clicked!", e.target);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <ButtonComponent onClick={handleClick} label="Hello World" />
      <InputComponent
        placeholder="name@example.com"
        value={inputValue}
        onChange={handleInputChange}
      />
      <ButtonComponent onClick={handleClick} label="Bye" />
    </>
  );
}

export default App;
