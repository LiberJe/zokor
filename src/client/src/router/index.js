import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { Layout } from 'antd';

import HeadBar from '../component/headBar'
import Home from '../modules/home'
import Workbench from '../modules/workbench'
import Addproject from '../modules/addproject'

const { Header, Content } = Layout;

const RootRouter = () => (
  <Router>
    <Layout className="layout">
      <Header style={{ backgroundColor: '#f3f3f3' }}>
        <HeadBar />
      </Header>
      <Content style={{ height: '100%', padding: '20px 50px' }}>
        <Route exact path="/" component={Home} />
        {/* <Route path="/star" component={Home} /> */}
        <Route path="/addproject" component={Addproject} />
        <Route path="/workbench" component={Workbench} />
      </Content>
    </Layout>
  </Router>
)

export default RootRouter;
