import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
export default function NewsPreview() {
    const params = useParams()
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo(res.data)
        })
    }, [params.id])

    const auditList = ["未审核", "审核中", "已通过", "未通过"]
    const publishList = ["未发布", "待发布", "已上线", "已下线"]
    const colorList = ["black", "orange", "green", "red"]
    return (
        <>
            {
                newsInfo && <div>
                    <Descriptions title={
                        <div style={{ fontSize: "30px" }}>
                            <ArrowLeftOutlined style={{ marginRight: "30px", fontSize: "25px" }}
                                onClick={() => window.history.back()}
                            />
                            <span style={{ marginRight: "30px", fontSize: "30px" }}>{newsInfo.title}</span>
                            <span style={{ fontSize: "18px", color: 'rgba(0, 0, 0, .6)' }}>{newsInfo.category.title}</span>
                        </div>
                    }>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{
                            newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-"
                        }</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态" contentStyle={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</Descriptions.Item>
                        <Descriptions.Item label="发布状态" contentStyle={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</Descriptions.Item>
                        <Descriptions.Item label="访问数量" contentStyle={{ color: 'green' }}>{newsInfo.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量" contentStyle={{ color: 'green' }}>{newsInfo.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量" contentStyle={{ color: 'green' }}>0</Descriptions.Item>
                    </Descriptions>
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{ 
                        border: '1px solid gray', 
                        borderRadius: '10px', 
                        padding: '10px',}}>
                    </div>

                </div>
            }
        </>
    )
}
