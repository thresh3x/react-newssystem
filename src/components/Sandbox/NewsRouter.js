import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../../pages/sandbox/home/Home'
import UserList from '../../pages/sandbox/user-manage/UserList'
import RightList from '../../pages/sandbox/right-manage/RightList'
import RoleList from '../../pages/sandbox/right-manage/RoleList'
import Nopermission from '../../pages/sandbox/nopermission/Nopermission'
import NewsAdd from '../../pages/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../pages/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../pages/sandbox/news-manage/NewsDraft'
import Audit from '../../pages/sandbox/audit-manage/Audit'
import AuditList from '../../pages/sandbox/audit-manage/AuditList'
import Unpublished from '../../pages/sandbox/publish-manage/Unpublished'
import Published from '../../pages/sandbox/publish-manage/Published'
import Sunset from '../../pages/sandbox/publish-manage/Sunset'
import NewsPreview from '../../pages/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../pages/sandbox/news-manage/NewsUpdate'
import axios from 'axios'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'

const LocalRouterMap = {
    '/home': <Home></Home>,
    '/user-manage/list': <UserList></UserList>,
    '/right-manage/right/list': <RightList></RightList>,
    '/right-manage/role/list': <RoleList></RoleList>,
    '/news-manage/add': <NewsAdd></NewsAdd>,
    '/news-manage/draft': <NewsDraft></NewsDraft>,
    '/news-manage/category': <NewsCategory></NewsCategory>,
    '/news-manage/preview/:id': <NewsPreview></NewsPreview>,
    '/news-manage/update/:id': <NewsUpdate></NewsUpdate>,
    '/audit-manage/audit': <Audit></Audit>,
    '/audit-manage/list': <AuditList></AuditList>,
    '/publish-manage/unpublished': <Unpublished></Unpublished>,
    '/publish-manage/published': <Published></Published>,
    '/publish-manage/sunset': <Sunset></Sunset>,

}

export default function NewsRouter() {
    const isLoading = useSelector((state) => state.loading.isLoading)
    const [BackRouteList, setBackRouteList] = useState([])
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (
        <>
            <Spin size="large" spinning={isLoading}>
                <Routes>
                    {
                        BackRouteList.map(item => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]}></Route>
                            }
                            return null
                        }
                        )
                    }
                    <Route path='/' element={<Navigate replace to='/home'></Navigate>}></Route>
                    <Route path='*' element={<Nopermission />}></Route>
                </Routes>
            </Spin>
        </>
    )
}
