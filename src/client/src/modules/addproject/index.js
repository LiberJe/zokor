import React, { Component } from 'react'
import { Card, Form, Input, Button, notification } from 'antd'
import { getUID } from '../../utils'

const FormItem = Form.Item

class Addproject extends Component {
  constructor (props) {
    super(props)

    this.handleCreate = this.handleCreate.bind(this)

    this.state = {
      project: {}
    }
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  handleCreate () {
    const { form } = this.props
    form.validateFields((err, value) => {
      if (err) {
        return
      }

      Object.assign(value, { key: getUID() })
      console.log('prepare to create a new project', value)
      fetch('http://127.0.0.1:8050/addproject', {
        method: 'POST',
        header: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
      }).then(res => res.json())
      .then(res => {
        if (res.error) {
          notification.error({
            message: '错误',
            description: res.msg
          })
        } else {
          form.resetFields()
          this.setState({
            project: value
          })
          notification.success ({
            message: 'success',
            description: '添加成功'
          })
          // history.replace("")
        }
      }).catch(err => {
        notification.error({
          message: '错误',
          description: '请求错误'
        })
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <Form layout="vertical" style={{ width: "50%", margin: "0 auto" }}>
            <FormItem
              label="项目名称"
            >
              {
                getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请填写项目名称'
                    }
                  ]
                })(
                  <Input placeholder="请输入项目名称" />
                )
              }
            </FormItem>
            <FormItem
              label="项目描述"
            >
              {
                getFieldDecorator('description', {
                  rules: [
                    {
                      required: true,
                      message: '请填写项目描述'
                    }
                  ]
                })(
                  <Input placeholder="请输入项目描述" />
                )
              }
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={this.handleCreate}
              >创建</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Form.create()(Addproject)
