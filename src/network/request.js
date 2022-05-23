import axios from "axios";

export function request(config) {
  const instance = axios.create({
    baseURL: 'https://api.shop.eduwork.cn',
    timeout: 5000
  })

  // 请求拦截
  instance.interceptors.request.use(config => {
    // 如果有一些接口需要认证才可以访问，就在这里统一设置 --token……


    // 直接放行
    return config;
  }, err => {
    // 基本不做things
  })

  // 响应拦截
  instance.interceptors.response.use(res => {
    // 正确数据--可以直接不做处理
    return res.data ? res.data : res;
  }, error => {
    // 如果有需要授权才可以访问的接口， 统一去授权地址。。

    // 如果有错误，这里面会去处理，显示错误信息
  })

  return instance(config);
}