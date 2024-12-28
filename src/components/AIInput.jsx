// src/components/AIInput.jsx
import React from "react";
import { Input, Flex } from "antd";

const AIInput = ({ id, purpose, value, onChange, placeholder }) => (
  <Flex>
    <Input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </Flex>
);

export default AIInput;
