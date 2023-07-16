import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import axios from 'axios'
export default function RoleList() {
  
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRight, setCurrentRight] = useState([])
  const [currentId, setCurrentId] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)

  const getData = () => {
    axios.get("/roles").then(res => {
      setDataSource(res.data)
    })
  }
  useEffect(() => {
    getData()
    axios.get('/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} style={{ marginRight: "5px" }} onClick={() => confirmMethod(item)} />

          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
            setModalOpen(true)
            setCurrentRight(item.rights)
            setCurrentId(item.id)
          }} />

        </div>
      }
    }
  ]

  const { confirm } = Modal
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }

  const handleOk = () => {
    setModalOpen(false)
    setDataSource(dataSource.map(item => {
      if (item.id===currentId) {
        return {
          ...item,
          rights: currentRight
        }
      }
      return item
    }))

    axios.patch(`/roles/${currentId}`, {
      rights: currentRight
    })
  }

  const handleCancel = () => {
    setModalOpen(false)
  }

  const onCheck = (checkKeys) => {
    setCurrentRight(checkKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly={true}
          checkedKeys={currentRight}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
