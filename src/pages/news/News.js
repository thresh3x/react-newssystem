import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List } from 'antd'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'

export default function New() {
  const [list, setlist] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
    })

  }, [])

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <div style={{ margin: 30 }}>
        <span style={{ marginRight: "30px", fontSize: "30px" }}>全球大新闻</span>
        <span style={{ fontSize: "18px", color: 'rgba(0, 0, 0, .6)' }}>查看新闻</span>
      </div>
      <Row gutter={[16, 16]}>
        {
          list.map(item =>
            <Col span={8} key={item[0]}>
              <Card title={item[0]} bordered={true} hoverable={true}>
                <List
                  size="small"
                  dataSource={item[1]}
                  pagination={{
                    pageSize: 3
                  }}
                  renderItem={(data) => <List.Item><NavLink to={`/detail/${data.id}`}>{data.title}</NavLink></List.Item>}
                />
              </Card>
            </Col>
          )
        }
      </Row>
    </div>
  )
}
