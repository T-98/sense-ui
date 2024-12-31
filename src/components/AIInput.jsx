// src/components/AIInput.jsx
import React from "react";
import { Input, Flex } from "antd";

const AIInput = ({ id, purpose, value, onChange, placeholder }) => (
  <Flex>
    <Input
      id={id} // Ensure the id is passed here
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </Flex>
);

export default AIInput;
