import React, { Component } from 'react'
import { Card, Table, Form, Input, Select, Button, Modal, notification } from 'antd'
import JSONPretty from 'react-json-pretty'
import { getUID } from '../../utils'

const FormItem = Form.Item
const { TextArea } = Input
const confirm = Modal.confirm
const Option = Select.Option

let dataSource = []

const columns = component => [{
  title: 'Method',
  dataIndex: 'method',
  key: 'method',
}, {
  title: 'URL',
  dataIndex: 'url',
  key: 'url',
}, {
  title: '描述',
  dataIndex: 'description',
  key: 'description',
}, {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
  render: (value, record, index) => (
    <Button.Group>
      <Button
        onClick={component.showModal('interfaceVisible', record)}
      >
        修改
      </Button>
      <Button
        onClick={component.showConfirm(record.key)}
      >
        删除
      </Button>
    </Button.Group>
  )
}]

const CreateInterfaceModal = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, onShowPretty, record } = props
    const { getFieldDecorator } = form
    return (
      <Modal
        title="接口"
        width="80%"
        visible={visible}
        onOk={onCreate(props, record)}
        onCancel={onCancel}
      >
        <Form
          layout="vertical"
        >
          <FormItem label="Method">
            {
              getFieldDecorator('method', {
                rules: [{
                  required: true,
                  message: "请选择method"
                }],
                initialValue: record ? record.method : "get"
              })(
                <Select>
                  <Option value="get">Get</Option>
                  <Option value="post">Post</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem label="URL">
            {
              getFieldDecorator('url', {
                rules: [{
                  required: true,
                  message: "请输入url"
                }],
                initialValue: record ? record.url : ''
              })(
                <Input addonBefore={<p>/</p>} />
              )
            }
          </FormItem>
          <FormItem label="描述">
            {
              getFieldDecorator('description', {
                initialValue: record ? record.description : ''
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem label="数据">
            <Button
              style={{ marginBottom: 10 }}
              onClick={onShowPretty(props)}
            >预览数据格式化</Button>
            <br />
            {
              getFieldDecorator('data', {
                rules: [{
                  required: true,
                  message: "请输入要返回的数据"
                }],
                initialValue: record ? JSON.stringify(record.data) : ''
              })(
                <TextArea
                  autosize={{ minRows:10 }}
                />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
)

function openNotification (type, message, description) {
  notification[type]({
    message,
    description
  })
}

class Workbench extends Component {
  constructor (props) {
    super(props)

    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.showPretty = this.showPretty.bind(this)
    this.saveFormRef = this.saveFormRef.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
    this.getPrettyData = this.getPrettyData.bind(this)
    this.handleInterface = this.handleInterface.bind(this)

    this.state = {
      interfaceVisible: false,
      prettyVisible: false,
      confirmVisible: false,
      modalRecord: null,
      dataPretty: {},
      projectName: '',
      projectDescription: '',
      projectKey: '',
      project: [],
      form: null
    }
  }

  componentWillMount () {
    const { location: { search } } = this.props
    let key = search.substring(search.indexOf('=')+1)

    fetch('http://127.0.0.1:8050/getinterface', {
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
          openNotification('error', '错误', res.msg)
        } else {
          let mockProject = res.data.mock
          dataSource = mockProject.map(item => {
            item.operation = []
            return item
          })
          this.setState({
            projectName: res.data.name,
            projectDescription: res.data.description,
            projectKey: res.data.key,
            project: dataSource
          })
        }
      })
      .catch(err => {
        console.log(err)
        openNotification('error', "错误", "数据获取失败")
      })
  }

  componentDidMount () {

  }

  showModal = (modal, record) => {
    const { form } = this.state
    let state = {
      [modal]: true,
      modalRecord: record
    }
    return () => {
      console.log(form)
      if (form) {
        const { setFieldsValue } = form
        setFieldsValue({
          method: record ? record.method : "get",
          url: record ? record.url : '',
          description: record ? record.description : '',
          data: record ? JSON.stringify(record.data) : ''
        })
      }
      this.setState(state)
    }
  }

  handleOk = modal => {
    let state = {
      [modal]: false
    }
    return () => {
      this.setState(state)
    }
  }

  handleCancel = modal => {
    let state = {
      [modal]: false
    }
    return () => {
      this.setState(state)
    }
  }

  showPretty = (props) => () => {
    this.setState({
      dataPretty: this.getPrettyData(props),
      prettyVisible: true
    })
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  showConfirm = (key) => {
    const { project, projectKey } = this.state
    const _this = this
    return () => {
      confirm({
        title: '您确定删除嘛?',
        content: '删除后将不可恢复',
        onOk() {
          fetch('http://127.0.0.1:8050/deleteinterface', {
            method: 'POST',
            header: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({key: projectKey, mockKey: key})
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
                project: project.filter(value => value.key !== key)
              })
            }
          })
          .catch(err => {
            console.error(err)
            openNotification('error', '错误', '请求失败')
          })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    }
  }

  getPrettyData = (props) => {
    const { getFieldValue } = props.form
    return getFieldValue('data') || {}
  }

  handleInterface = (props, record) => () => {
    const { project, projectKey } = this.state
    const { validateFields } = props.form
    validateFields((err, value) => {
      if (!err) {
        let currentInterface
        let newProject
        if (!record) {
          value.key = getUID()
          value.data = JSON.parse(value.data)
          currentInterface = value
          newProject = [...project, currentInterface]

          // http post
          fetch('http://127.0.0.1:8050/createinterface', {
            method: 'POST',
            header: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({key: projectKey, value: currentInterface})
          })
          .then(res => res.json())
          .then(res => {
            if (res.error) {
              openNotification('error', '错误', res.msg)
            } else {
              this.setState({
                project: newProject,
                form: props.form
              })
              this.handleOk('interfaceVisible')()
            }
          }).catch(err => {
            console.error(err)
            openNotification('error', '错误', '请求错误')
          })
        } else {
          value.key = record.key
          value.data = JSON.parse(value.data)
          currentInterface = {...record, ...value}
          newProject = project.map(item => item.key === currentInterface.key ? currentInterface : item)
        
          // http post
          fetch('http://127.0.0.1:8050/modifyinterface', {
            method: 'POST',
            header: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({key: projectKey, value: currentInterface})
          })
          .then(res => res.json())
          .then(res => {
            if (res.error) {
              openNotification('error', '错误', res.msg)
            } else {
              this.setState({
                project: newProject,
                form: props.form
              })
              this.handleOk('interfaceVisible')()
            }
          }).catch(err => {
            console.error(err)
            openNotification('error', '错误', '请求错误')
          })
        }
      }
    })
  }

  render() {
    console.log(this.props)
    const { project, projectName, projectDescription, interfaceVisible, prettyVisible, dataPretty, modalRecord } = this.state
    return (
      <div>
        <Card style={{ width: '100%', marginBottom: 20, borderRadius: 5 }}>
          <h1 style={{ marginBottom: 10 }}>{projectName}</h1>
          <p>{projectDescription}</p>
        </Card>
        <Button type="primary" size="large" style={{ width: "100%", marginBottom: 20 }} onClick={this.showModal('interfaceVisible')}>创建接口</Button>
        <Table
          style={{ backgroundColor: 'white', borderRadius: 10 }}
          dataSource={project}
          columns={columns(this)}
          pagination={false}
          bordered
        />
        <CreateInterfaceModal
          ref={this.saveFormRef}
          visible={interfaceVisible}
          onCancel={this.handleCancel('interfaceVisible')}
          onCreate={this.handleInterface}
          onShowPretty={this.showPretty}
          record={modalRecord}
        />
        <Modal
          title="数据格式化"
          visible={prettyVisible}
          onOk={this.handleOk('prettyVisible')}
          onCancel={this.handleCancel('prettyVisible')}
        >
          <JSONPretty id="json-pretty" json={dataPretty}></JSONPretty>
        </Modal>
      </div>
    )
  }
}

export default Workbench;
