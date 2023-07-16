import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import './index.css'
import axios from 'axios'
import { useSelector } from 'react-redux'
const { Sider } = Layout;

function getItem(key, label, children, icon) {
  return {
    key,
    children,
    label,
    icon
  };
}

function getList(obj) {
  const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
  const arr = []
  obj.map((element) => {
    if (rights.includes(element.key)) {
      if (element.children && element.children.length !== 0) {
        return arr.push(getItem(element.key, element.title, getList(element.children)))
      } else {
        return element.pagepermisson && arr.push(getItem(element.key, element.title))
      }
    } else {
      return null
    }   
  })
  return arr
}

export default function SideMenu() {
  const isCollapsed = useSelector((state) => state.collapsed.isCollapsed)

  const [items, setItems] = useState([]);
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      let list = getList(res.data)
      setItems(list)
    })
  }, [])

  const navigate = useNavigate()
  const onClick = (e) => {
    navigate(e.key)
  };

  const selected = [useLocation().pathname]
  const opened = ["/" + useLocation().pathname.split('/')[1]]
  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className='logo'>全球新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selected}
            defaultOpenKeys={opened}
            items={items}
            onClick={onClick}
          />
        </div>
      </div>
    </Sider>
  )
}
