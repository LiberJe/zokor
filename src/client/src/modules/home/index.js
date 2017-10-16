import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Col, Row, Card, Icon, Switch, Modal, notification } from 'antd';

const confirm = Modal.confirm

const cardExtra = (component, value) => (
  <div>
    {/* {
      value.isStar ?
        <Icon onClick={component.star} className="star" type="star" style={{ fontSize: 16, color: "#f5a623", marginRight: 10 }} />
        : <Icon onClick={component.star} className="star" type="star" style={{ fontSize: 16, marginRight: 10 }} />
    } */}
    <Icon onClick={component.showConfirm(value.key)} className="delete" type="delete" style={{ fontSize: 17 }} />
  </div>
)

class Home extends Component {
  constructor (props) {
    super(props)

    this.handleSwitch = this.handleSwitch.bind(this)
    this.showConfirm = this.showConfirm.bind(this)

    this.state = {
      projects: [],
      activeProject: null
    }
  }

  async componentWillMount () {
    const { match: { path } } = this.props
    let projects = await this.getProjects(path.substring(1))
    let activeProject = await this.getActiveProject()
    this.setState({
      projects,
      activeProject
    })
  }

  componentDidMount () {

  }

  getProjects (data) {
    return new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8050/getprojectlist')
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            notification.error({
              message: '错误',
              description: res.msg
            })
          } else {
            resolve(res.data)
          }
        })
        .catch(err => {
          console.error(err)
          notification.error({
            message: '错误',
            description: '请求失败'
          })
        })
    })
  }

  getActiveProject () {
    return new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8050/getactiveprojectkey')
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          notification.error({
            message: '错误',
            description: res.msg
          })
        } else {
          resolve(res.data)
        }
      })
      .catch(err => {
        console.error(err)
        notification.error({
          message: '错误',
          description: '请求失败'
        })
      })
    })
  }

  star () {

  }

  handleSwitch (key) {
    const { activeProject } = this.state
    let activePro = key === activeProject ? null : key
    return () => {
      fetch('http://127.0.0.1:8050/activeprojectkey', {
        method: 'POST',
        header: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: activePro })
      })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          notification.error({
            message: '错误',
            description: res.msg
          })
        } else {
          this.setState({
            activeProject: activePro
          })
        }
      })
      .catch(err => {
        console.error(err)
        notification.error({
          message: '错误',
          description: '请求失败'
        })
      })
    }
  }

  showConfirm (key) {
    const { projects } = this.state
    const _this = this
    return () => {
      confirm({
        title: '您确定删除嘛?',
        content: '删除后将不可恢复',
        onOk() {
          fetch('http://127.0.0.1:8050/deleteproject', {
            method: 'POST',
            header: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({key})
          })
          .then(res => res.json())
          .then(res => {
            if (res.error) {
              notification.error({
                message: '错误',
                description: res.msg
              })
            } else {
              _this.setState({
                projects: projects.filter(value => value.key !== key)
              })
              console.log('OK')
            }
          })
          .catch(err => {
            console.error(err)
            notification.error({
              message: '错误',
              description: '请求失败'
            })
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    }
  }

  render() {
    const { projects, activeProject } = this.state
    return (
      <div>
        <Row gutter={16}>
          {
            projects.map((value, index) => (
              <Col span={8}>
                <Card title={value.name} style={{ width: 300, marginBottom: 20 }} extra={cardExtra(this, value)}>
                  <Link to={`/workbench?key=${value.key}`} style={{ color: '#2a2a2a' }}>
                    <div style={{ width: '70%', float: 'left', wordBreak: 'break-all', wordWrap: 'break-word' }}>{value.description}</div>
                  </Link>
                  <div style={{ width: '30%', float: 'left' }}>
                    <Switch
                      style={{ float: 'right' }}
                      checkedChildren="启动"
                      unCheckedChildren="关闭"
                      checked={activeProject === value.key}
                      onChange={this.handleSwitch(value.key)}
                    />
                  </div>
                </Card>
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }
}

export default Home;
