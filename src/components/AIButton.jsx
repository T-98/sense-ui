// src/components/AIButton.jsx
import React from "react";
import { Button, Flex } from "antd";

const AIButton = ({ id, purpose, onClick, label }) => {
  const handleClick = (e) => {
    console.log(`AIButton with id "${id}" was clicked.`);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Flex>
      <Button id={id} type="primary" onClick={handleClick}>
        {label}
      </Button>
    </Flex>
  );
};

export default AIButton;
