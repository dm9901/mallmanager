// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入axios自定义插件
import MyHttpserver from '@/plugins/http.js'

// 导入自定义面包屑组件,其实是组件选项所在的对象{template:"",data等等}
import Breadcrumb from '@/components/custom/breadcrumb.vue'

// 导入moment
import moment from 'moment'

//导入Css样式
import '@/assets/css/reset.css';

// 使用插件
//注册ElementUI，axios等
Vue.use(ElementUI);
Vue.use(MyHttpserver);

Vue.config.productionTip = false


// 配置全局过滤器，用来处理日期格式
Vue.filter('fmdate',(v)=>{
    return moment(v).format('YYYY-MM-DD')
})

// 自定义全局组件，必须在new Vue之前
// 完整的写法：
// Vue.component('my-bread',{
//     // 以下代码其实已经在导入部分的breadcrumb.vue中了
//     template:'',
//     data(){
//         return{}
//     },
//     props:[]
// })

// 所以，可以简写为以下代码
Vue.component(Breadcrumb.name,Breadcrumb)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})