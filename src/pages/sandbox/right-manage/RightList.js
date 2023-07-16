import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import {Table, Tag, Button, Modal, Popover, Switch} from 'antd'
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'
export default function RightList() {
  const getData = useCallback( () => {
    axios.get("/rights?_embed=children").then(res => {
      const list = [...res.data]
      list.forEach(item => {
        if(item.children.length === 0) {
          item.children = ''
        }
      })
      setDataSource([...list])
    })
  }, [])
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    getData()
  }, [getData])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => <Tag color="lime">{key}</Tag>
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} style={{marginRight: "5px"}} onClick={() => confirmMethod(item)}/>
        <Popover content={(
          <div style={{textAlign: "center"}}>
          <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
          </div>)} title="配置项" trigger={item.pagepermisson === undefined?'':'click'}>
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined}/>
        </Popover>
        
        </div>
      }
    }
  ]
  const switchMethod = (item) => {
    let pagepermisson = item.pagepermisson===1?0:1
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`,{
        pagepermisson: pagepermisson
      })
    } else {
      axios.patch(`/children/${item.id}`,{
        pagepermisson: pagepermisson
      })
    }
    getData()
  }
  const {confirm} = Modal
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
    console.log(item)

    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
      // getData()
    } else {
      let list = dataSource.filter(data => data.id===item.rightId)
      list[0].children = list[0].children.filter(data => data.id!==item.id)
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
      // getData()
    }
    
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: "5"
      }}/>
    </div>
  )
}
