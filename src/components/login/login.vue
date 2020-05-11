<template>
    <div class="login-wrap">
        <el-form class="login-form"
                 label-position="top"
                 label-width="80px"
                 :model="formdata">
            <h2>用户登录</h2>
            <el-form-item label="用户名">
                <el-input @keyup.enter.native="handleLogin()"
                          v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input :type="passw"
                          @keyup.enter.native="handleLogin()"
                          v-model="formdata.password"></el-input>
            </el-form-item>
            <el-button class="login-btn"
                       @click="handleLogin()"
                       type="primary">登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            passw: "password", //隐藏密码
            formdata: {
                username: "admin",
                password: "123456"
            }
        };
    },
    methods: {
        async handleLogin () {
            // 之前的异步写法：
            // this.$http.post('login', this.formdata).then(res => { })

            // 使用ES7里面的 async  和  await 关键字的写法：
            // 性能无优化，只是提高代码的可读性！！！
            const res = await this.$http.post("login", this.formdata);

            //console.log(res)
            // 对象结构赋值：
            // 将等号右边的res.data赋值给左边的标识，这些标识来源于返回的数据结构中
            // meta:{} 表示：到res.data中取meta对应的数据表示的值
            const {
                data,
                meta: { msg, status }
            } = res.data;

            // 登录成功
            // 0 保存token
            // 1 跳转到home
            // 2 提示成功
            if (status === 200) {
                localStorage.setItem("token", data.token);
                this.$router.push({ name: "home" });
                // this.$message.success(msg);
            } else {
                // 不成功
                // 1. 错误提示信息
                this.$message.error(msg);
            }
        }
    }
};
</script>

<style>
.login-wrap {
    height: 100%;
    background-color: #324152;

    /* 弹性盒布局 
     申明flex布局
  */
    display: flex;
    justify-content: center; /*----水平居中对齐*/
    align-items: center; /*-------垂直居中对齐*/
}

.login-wrap .login-form {
    width: 400px;
    background-color: #ffffff;
    border-radius: 5px; /*给元素添加圆角的边框*/
    padding: 30px;
}

.login-wrap .login-btn {
    width: 100%;
}
</style>