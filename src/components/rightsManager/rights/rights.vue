<template>
    <el-card class="box-card">
        <!-- 二次封装的面包屑部分 -->
        <my-bread level1="权限管理"
                  level2="权限列表"></my-bread>

        <el-table :data="rightlist"
                  style="width: 100%"
                  border
                  class="tabClass">
            <el-table-column type="index"
                             label="#"></el-table-column>

            <el-table-column prop="authName"
                             label="名称"></el-table-column>
            <el-table-column prop="path"
                             label="路径"></el-table-column>
            <el-table-column prop="level"
                             label="权限等级">
                <template slot-scope="scope">
                    <!-- scope.row.level  0 1 2 -->
                    <span v-if="scope.row.level==='0'">一级</span>
                    <span v-if="scope.row.level==='1'">二级</span>
                    <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data () {
        return {
            rightlist: []
        };
    },
    // beforeCreate表示在组件（home）实例化之前执行
    beforeCreate () {
        const token = localStorage.getItem("token");
        // console.log(token)
        if (!token) {
            this.$router.push({ name: "login" });
        }
    },
    created () {
        this.getRights();
    },
    methods: {
        async getRights () {
            let res = await this.$http.get("rights/list");
            if (res.data.meta.status === 200) {
                this.rightlist = res.data.data;
                // this.$message.success(res.data.meta.msg);
            } else {
                this.$message.error(res.data.meta.msg);
            }
        }
    }
};
</script>

<style>
.tabClass {
    margin-top: 10px;
    /* height: 520px; */
}
</style>