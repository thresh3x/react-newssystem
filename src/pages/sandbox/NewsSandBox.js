import React, { useEffect } from 'react'

import './NewsSandBox.css'
import SideMenu from '../../components/Sandbox/SideMenu'
import TopHeader from '../../components/Sandbox/TopHeader'
import NewsRouter from '../../components/Sandbox/NewsRouter'
import { Layout, theme } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useParams } from 'react-router-dom'

export default function NewsSandBox() {
  const params = useParams()
  NProgress.start()
  useEffect(()=>{
    NProgress.done()
  },[params])
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflowX: 'scroll'
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
