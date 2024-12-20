import React from "react";

const InputComponent = ({ value, placeholder, onChange }) => (
  <input
    type="email"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default InputComponent;
