import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Switch, } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
import { useForm } from 'antd/es/form/Form'

export default function UserList() {
  const [form] = useForm()
  const [updateForm] = useForm()
  // const addForm = useRef(null)
  const {roleId, region} = JSON.parse(localStorage.getItem('token'))
  const getData = useCallback(() => {
    axios.get("/users?_expand=role").then(res => {
      const list = [...res.data]
      setDataSource(list)
    })
  }, [])
  const [dataSource, setDataSource] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [current, setCurrent] = useState(null)
  useEffect(() => {
    getData()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    axios.get("/roles").then(res => {
      const list = [...res.data]
      setRoleList(list)
    })
  }, [])
  useEffect(() => {
    axios.get("/regions").then(res => {
      const list = [...res.data]
      setRegionList(list)
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      },
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: ''
        }
      ],
      onFilter: (value, item)=>item.region===value
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={()=> handleChange(item)}></Switch>
      }
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} style={{ marginRight: "5px" }} onClick={() => confirmMethod(item)} disabled={item.default} />

          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)}/>

        </div>
      }
    }
  ]

  const handleUpdate = (item) => {
    setIsUpdate(true)
    setIsUpdateDisabled(item.roleId===1?true:false)
    updateForm.setFieldsValue(item)
    setCurrent(item)
  }

  const handleChange = (item) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const { confirm } = Modal
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
      },
    });
  }

  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/users/${item.id}`)
  }

  const addFormOK = () => {
    form.validateFields().then(res => {
      console.log(res)
      setIsOpen(false)
      form.resetFields() //重置表单数据
      // post 到后端，生成Id，再设置dataSource, 方便后续删除，更新
      axios.post(`/users`, {
        ...res,
        "roleState": true,
        "default": false
      }).then(returnRes => {
        console.log(returnRes.data)
        setDataSource([...dataSource, {
          ...returnRes.data,
          // 这时候没有链表的role，会报错，需要自己设置
          role: roleList.filter(item=> item.id===res.roleId)[0]
        }])
      })

    }).catch(err => {
      console.log(err)
    })
  }

  const updateFormOK = ()=> {
    updateForm.validateFields().then(value => {
      setIsUpdate(false)
      setDataSource(dataSource.map(item=> {
        if (item.id===current.id){
          return {
            ...item,
            ...value,
            role: roleList.filter(data=>data.id===value.roleId)[0]
          }
        }
        return item
      }))
      axios.patch(`/users/${current.id}`,value)
    }).catch(err => {
      console.log(err)
    })
  }

  const times = new Date().getTime()

  return (
    <div>
      <Button type='primary' onClick={() => {
        setIsOpen(true)
      }}>添加用户</Button>
      {/* dataSource根据人权限过滤 */}
      <Table dataSource={dataSource?.filter(item => roleId===1?item:(item.roleId>=roleId && item.region===region))} columns={columns} pagination={{
        pageSize: "5"
      }} rowKey={item => item.id} />

      <Modal
        open={isOpen}
        title="添加用户"
        getContainer={false}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsOpen(false)
        }}
        onOk={() => addFormOK()}
      >
        <UserForm regionList={regionList} roleList={roleList} form={form} name='addUserForm'></UserForm>
      </Modal>
      <Modal
        open={isUpdate}
        title="更新用户"
        getContainer={false}
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdate(false)
        }}
        onOk={() => updateFormOK()}
      >
        <UserForm regionList={regionList} roleList={roleList} form={updateForm} name='updateUserForm' isUpdateDisabled={isUpdateDisabled} times={times} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
