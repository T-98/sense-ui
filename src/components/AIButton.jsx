import React from "react";
import { Button, Flex } from "antd";

const AIButton = ({ id, purpose, onClick, label }) => (
  <Flex>
    <Button id={id} type="primary" onClick={onClick}>
      {label}
    </Button>
  </Flex>
);

export default AIButton;