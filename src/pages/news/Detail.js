import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import { ArrowLeftOutlined, HeartTwoTone } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
export default function Detail() {
    const params = useParams()
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`/news/${params.id}?_expand=category&_expand=role`, {
                view: res.view + 1
            })
        })
    }, [params.id])

    const handleStar = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })

        axios.patch(`/news/${params.id}?_expand=category&_expand=role`, {
            star: newsInfo.star + 1
        })
    }

    return (
        <div style={{margin: '30px 30px'}}>
            {
                newsInfo && <div>
                    <Descriptions title={
                        <div style={{ fontSize: "30px" }}>
                            <ArrowLeftOutlined style={{ marginRight: "30px", fontSize: "25px" }}
                                onClick={() => window.history.back()}
                            />
                            <span style={{ marginRight: "30px", fontSize: "30px" }}>{newsInfo.title}</span>
                            <span style={{ fontSize: "18px", color: 'rgba(0, 0, 0, .6)', marginRight: 10}}>{newsInfo.category.title}</span>
                            <HeartTwoTone twoToneColor="#eb2f96" style={{fontSize: 18}} onClick={() => handleStar()}/>
                        </div>
                    }>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{
                            newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-"
                        }</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
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
        </div>
    )
}
