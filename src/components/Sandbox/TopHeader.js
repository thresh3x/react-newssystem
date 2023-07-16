import React from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  SmileOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Button, Layout, theme, Dropdown, Space, Avatar } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { changeCollapsed } from '../../redux/reducers/CollapseSlice';

const { Header } = Layout;
function TopHeader() {
  const isCollapsed = useSelector((state) => state.collapsed.isCollapsed)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const {role:{roleName}, username} = JSON.parse(localStorage.getItem('token'))
  const items = [
    {
      key: '1',
      label: (
        roleName
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '2',
      danger: true,
      label: (
        <div onClick={() => {
          localStorage.removeItem('token')
          navigate('/login')
        }}>退出</div>
        ),
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer
      }}
    >
      <Button
        type="text"
        icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(changeCollapsed())}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />

      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color: '#1890ff'}}>{username}</span>回来</span>
        <Dropdown
          menu={{
            items,
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

export default TopHeader
