// src/components/AIInput.jsx
import React from "react";
import { Input, Flex } from "antd";

const AIInput = ({ uid, purpose, value, onChange, placeholder }) => (
  <Flex>
    <Input
      uid={uid}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </Flex>
);

export default AIInput;
