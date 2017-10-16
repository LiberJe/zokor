import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const HeadBar = () => (
  <div>
    <div className="logo"><b><i>Zokor Mock</i></b></div>
    <Menu
      mode="horizontal"
      style={{ lineHeight: '62px', backgroundColor: '#f3f3f3' }}
    >
      <Menu.Item key="1"><Link to="/">所有项目</Link></Menu.Item>
      {/* <Menu.Item key="2"><Link to="/star">工作台</Link></Menu.Item> */}
      <Menu.Item key="3"><Link to="/addproject">添加项目</Link></Menu.Item>
      {/* <Menu.Item key="4"><Link to="/workbench">workbench</Link></Menu.Item> */}
    </Menu>
  </div>
)

export default HeadBar;
