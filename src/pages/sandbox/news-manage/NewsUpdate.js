import React, { useEffect, useState } from 'react'
import { Steps, Button, message, Form, Input, Select, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons'

const { Option } = Select;
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

export default function NewsUpdate() {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")

    const steps = [
        {
            title: '基本信息',
            description: '新闻标题，新闻分类',
        },
        {
            title: '新闻内容',
            description: '新闻主题内容',
        },
        {
            title: '新闻提交',
            description: '保存草稿或提交审核',
        },
    ]

    const next = () => {
        if (current === 0) {
            form.validateFields().then(res => {
                // console.log(res);
                setFormInfo(res)
                setCurrent(current + 1);
            }).catch(err => {
                // console.log(err);
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
            } else {
                // console.log(formInfo, content);
                setCurrent(current + 1);
            }
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const [form] = Form.useForm();
    const onGenderChange = (value) => {
        switch (value) {
            case 'male':
                form.setFieldsValue({
                    note: 'Hi, man!',
                });
                break;
            case 'female':
                form.setFieldsValue({
                    note: 'Hi, lady!',
                });
                break;
            case 'other':
                form.setFieldsValue({
                    note: 'Hi there!',
                });
                break;
            default:
        }
    };
    const onFinish = (values) => {
        // console.log(values);
    };

    useEffect(() => {
        axios.get('categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])

    const params = useParams()
    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            let {title, categoryId, content} = res.data
            form.setFieldsValue({
                title,
                categoryId
            })
            setContent(content)
        })
    }, [params.id, form])

    const handleSave = (auditState) => {
        axios.patch(`/news/${params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(() => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.info({
                message: "通知",
                description:
                    `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看您的新闻`,
                placement: "bottomRight"
            })
        })
    }

    return (
        <>
            <ArrowLeftOutlined style={{ marginRight: "30px", marginBottom: "40px",fontSize: "25px" }}
                onClick={() => navigate(-1)}
            />
            <span style={{ fontSize: '24px', fontWeight: 'bold'}}>更新新闻</span>
            <Steps
                current={current}
                items={steps}
                style={{ marginBottom: '50px' }}
            />

            <div className={current === 0 ? '' : style.active}>
                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="title"
                        label="新闻标题"
                        rules={[
                            {
                                required: true,
                                message: '请填写新闻标题'
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="categoryId"
                        label="新闻分类"
                        rules={[
                            {
                                required: true,
                                message: '请选择新闻分类'
                            },
                        ]}
                    >
                        <Select
                            placeholder="请您选择一个新闻分类"
                            onChange={onGenderChange}
                            allowClear
                        >
                            {
                                categoryList.map(item =>
                                    <Option value={item.id} key={item.id}>{item.title}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('gender') === 'other' ? (
                                <Form.Item
                                    name="customizeGender"
                                    label="Customize Gender"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                </Form>
            </div>

            <div className={current === 1 ? '' : style.active}>
                <NewsEditor getContent={(value) => {
                    // console.log(value);
                    setContent(value)
                }} content={content}></NewsEditor>
            </div>

            <div className={current === 2 ? '' : style.active}>

            </div>

            <div style={{ marginTop: '50px' }}>
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <>
                        <Button type="primary" style={{ marginRight: '5px' }} onClick={() => {
                            handleSave(0)
                        }}>
                            保存草稿箱
                        </Button>
                        <Button danger onClick={() => {
                            handleSave(1)
                        }}>
                            提交审核
                        </Button>
                    </>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </>
    )
}
