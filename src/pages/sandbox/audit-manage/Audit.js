import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Table, Button, notification} from 'antd'
import { NavLink } from 'react-router-dom'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
export default function Audit() {
  const {roleId, region} = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setDataSource(list)
    })
  }, [])
  const columns = [
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
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => <div>{category.title}</div>
    },
    {
      title: "操作",
      render: (item) => {
        return <>
            <Button type='primary' shape='circle' icon={<CheckOutlined />} style={{marginRight: 5}} onClick={() => handleAudit(item, 2, 1)}></Button>
            <Button type='primary' shape='circle' icon={<CloseOutlined />} onClick={() => handleAudit(item, 3, 0)}></Button>
        </>
      }
    }
  ]
  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id!==item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(() => {
      notification.info({
        message: "通知",
        description:
          `您可以到[审核列表/审核管理]中查看您的新闻`,
        placement: "bottomRight"
      })
    })
  }
  return (
    <>
      <Table dataSource={dataSource?.filter(item => roleId===1?item:(item.roleId>=roleId && item.region===region))} columns={columns} pagination={{
        pageSize: "5"
      }} rowKey={item => item.id}/>
    </>
  )
}
