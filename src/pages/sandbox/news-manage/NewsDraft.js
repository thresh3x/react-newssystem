import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Table, Button, Modal, notification} from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons'
import { NavLink, useNavigate } from 'react-router-dom'
export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))

  const getData = useCallback(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])

  useEffect(() => {
    getData()
  }, [getData])

  const navigate = useNavigate()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: "操作",
      render: (item) => {
        return <>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />

          <Button shape="circle" icon={<EditOutlined />} style={{ margin: "0 5px" }}
            onClick={() => {
              navigate(`/news-manage/update/${item.id}`)
            }} />

          <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />

        </>
      }
    }
  ]

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(() => {
      navigate('/audit-manage/list')
      notification.info({
        message: "通知",
        description:
          `您可以到审核列表中查看您的新闻`,
        placement: "bottomRight"
      })
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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{
        pageSize: "5"
      }} />
    </div>
  )
}
