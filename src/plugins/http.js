// 1 导入axios
import axios from 'axios'

// 2 定义一个对象
const MyHttpServer = {}

// 3 增加对象成员
MyHttpServer.install = (Vue) => {
  // 在原型成员之前设置baseURL属性的默认值
  axios.defaults.baseURL = 'http://api.xiaomadagege.cn:8800/api/private/v1/'

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 可以先输出config看看里面的结构
    //   console.log(config)

    // 在发送请求之前做些什么
    // 判断是否为登录请求，如果不是则添加头部信息(这里是加入token)
    if (config.url !== 'login') {
      let AUTH_TOKEN = localStorage.getItem("token");
      config.headers["Authorization"] = AUTH_TOKEN;
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });


  // 给原型属性增加成员
  Vue.prototype.$http = axios
}

// 4 导出对象
export default MyHttpServer

// 5 在需要使用的地方导入即可使用
