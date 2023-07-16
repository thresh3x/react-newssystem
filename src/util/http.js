import axios from "axios"
import {store} from '../redux/store'
import { changeLoading } from "../redux/reducers/LoadingSlice";

axios.defaults.baseURL = "http://localhost:5000"
// 添加请求拦截器
axios.interceptors.request.use(config => {
    store.dispatch(changeLoading(true))
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
    store.dispatch(changeLoading(false))
    return response
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});