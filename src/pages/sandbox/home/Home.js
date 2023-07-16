import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined, UnorderedListOutlined } from '@ant-design/icons'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card
export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [allList, setallList] = useState([])
  const [open, setOpen] = useState(false)
  const [pieChart, setpieChart] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()
  useEffect(() => {
    axios.get('http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setViewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setStarList(res.data)
    })
  }, [])

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios('http://localhost:5000/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })

    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = (obj) => {
    // 数据处理
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)

    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    var myChart;
    // 多次点击，判断是否已经存在
    if (!pieChart) {
      myChart = echarts.init(pieRef.current)
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card title={<div>用户最常浏览<UnorderedListOutlined style={{marginLeft: '5px'}} /></div>} bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => <List.Item><NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<div>用户点赞最多<UnorderedListOutlined style={{marginLeft: '5px'}} /></div>} bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item><NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />
            }
            bordered={true}
            actions={[
              <PieChartOutlined key="PieChart" onClick={() => {
                setTimeout(() => {
                  renderPieView()
                }, 0)
                setOpen(true)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />
            ]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png " />}
              title={username}
              description={
                <div>
                  <b style={{ paddingRight: 30 }}>{region ? region : "全球"}</b>
                  {roleName}
                </div>
              }
            />
          </Card>
        </Col>
      </Row >
      <Drawer title="个人新闻分类" placement="right" onClose={() => {
        setOpen(false)
      }} open={open} width='500px'>
        <div ref={pieRef} style={{
          height: '400px',
          width: '100%',
          marginTop: '30px'
        }}></div>
      </Drawer>

      <div ref={barRef} style={{
        height: '400px',
        width: '100%',
        marginTop: '30px'
      }}></div>
    </>
  )
}
