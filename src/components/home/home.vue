<template>
    <el-container class="container">
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <img src="../../assets/logo.png" />
                    </div>
                </el-col>
                <el-col :span="18"
                        class="middle">
                    <h3>电商后台管理系统</h3>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple">
                        <a href="#"
                           class="logout"
                           @click="handleLogout()">退出</a>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside class="aside"
                      width="200px">
                <!-- 侧边栏导航 -->
                <!-- :unique-opened='true'  只允许一个菜单处于展开模式 -->
                <!-- :router="tru"   开启路由模式 -->
                <el-menu :unique-opened="true"
                         :router="true">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item index="users">
                            <i class="el-icon-menu"></i>
                            <span>用户列表</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-key"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="roles">
                            <i class="el-icon-menu"></i>
                            <span>角色列表</span>
                        </el-menu-item>
                        <el-menu-item index="rights">
                            <i class="el-icon-menu"></i>
                            <span>权限列表</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-shopping-bag-1"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item index="3-1">
                            <i class="el-icon-location"></i>
                            <span>商品列表</span>
                        </el-menu-item>
                        <el-menu-item index="3-2">
                            <i class="el-icon-location"></i>
                            <span>分类参数</span>
                        </el-menu-item>
                        <el-menu-item index="3-3">
                            <i class="el-icon-location"></i>
                            <span>商品分类</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-shopping-cart-2"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item index="4-1">
                            <i class="el-icon-location"></i>
                            <span>订单列表</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-pie-chart"></i>
                            <span>数据统计</span>
                        </template>
                        <el-menu-item index="5-1">
                            <i class="el-icon-location"></i>
                            <span>数据报表</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!-- 右侧主窗口 -->
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    // 如果没有登录，返回登录页面
    // beforeCreate表示在组件（home）实例化之前执行
    beforeCreate () {
        const token = localStorage.getItem("token");
        // console.log(token)
        if (!token) {
            this.$router.push({ name: "login" });
        }
    },
    methods: {
        handleLogout () {
            // 1 清除token
            localStorage.clear();
            // 2 消息提示
            this.$message.success("成功退出系统");
            // 3 重定向到登录页面
            this.$router.push({ name: "login" });
        }
    }
};
</script>

<style>
.container {
    height: 100%;
}
.header {
    background-color: #b3c0d1;
}
.aside {
    background-color: #d3dce6;
}
.main {
    background-color: #e9eef3;
    height: 100%;
}
.middle {
    text-align: center;
}
.logout {
    line-height: 60px;
    text-decoration: none;
}

.box-card {
    height: 100%;
    margin: -20px -20px 0px -15px;
}
</style>