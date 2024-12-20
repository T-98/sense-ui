import React from "react";
import {Button, Flex} from 'antd';
const ButtonComponent = ({ onClick, label }) => (
  <Flex><Button type="primary" onClick={onClick}>{label}</Button></Flex>
);

export default ButtonComponent;
