import React, { useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
const UserForm = (props) => {
  const { roleId,region } = JSON.parse(localStorage.getItem('token'))
  const [isDisabled, setIsDisabled] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
    if (props.isUpdate) {// 如果是更新列表，用户权限和地区选择都要根据roleId进行变换，不能改
      const newRoleList = []
      const newRegionList = []
      if (roleId !== 1) {
        props.roleList.forEach(element => {
          element['disabled'] = true
          newRoleList.push(element)
        })
        props.regionList.forEach(element => {
          if (element['title']!== region) {
            element['disabled'] = true
          }
          newRegionList.push(element)
        })
        setRoleList(newRoleList)
        setRegionList(newRegionList)
      } else {
        setRoleList(props.roleList)
        setRegionList(props.regionList)
      }
    } else {// 如果是创建列表
      const newRoleList = []
      const newRegionList = []
      if (roleId !== 1) {
        props.roleList.forEach(element => {
          if (element['roleType'] > roleId) {
            element['disabled'] = false
          }else {
            element['disabled'] = true
          }
          newRoleList.push(element)
        })
        props.regionList.forEach(element => {
          if (element['title']!== region) {
            element['disabled'] = true
          }
          newRegionList.push(element)
        })
        setRoleList(newRoleList)
        setRegionList(newRegionList)
      } else {
        setRoleList(props.roleList)
        setRegionList(props.regionList)
      }
    }
  }, [props.isUpdate, props.isUpdateDisabled, props.regionList, props.roleList, props.times, region, roleId]) // 接收进来的时间戳进行更新，确保每次点击禁用的正确的
  // 之前会有一个bug：更新列表中，切换到全球管理员时（列表内禁用了）点击取消，再次打开更新列表（状态还认为没更新），此时地区是禁用的。

  return (
    <>
      <Form
        layout="vertical"
        name={props.name}
        initialValues={{
          modifier: 'public',
        }}
        form={props.form}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: '请填写用户名!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请填写密码!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={[
            {
              required: !isDisabled,
              message: '请选择区域!',
            },
          ]}
        >
          <Select
            style={{
              width: 120,
            }}
            options={regionList}
            fieldNames={{ label: 'title', value: 'value' }}
            disabled={isDisabled}
          />
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: '请选择角色!',
            },
          ]}
        >
          <Select
            style={{
              width: 120,
            }}
            onChange={(value) => {
              setIsDisabled(value === 1 ? true : false)
              props.form.setFieldsValue(value === 1 ? {
                region: ""
              } : {})
            }}
            options={roleList}
            fieldNames={{ label: 'roleName', value: 'roleType', disabled: 'disabled' }}
          // disabled={checkRegionDisabled()}
          />
        </Form.Item>
      </Form>
    </>
  )
}

export default UserForm
