<template>
    <el-card class="box-card">
        <my-bread level1="权限管理"
                  level2="角色列表"></my-bread>

        <el-row class="addRoleRow">
            <el-col>
                <el-button type="primary"
                           @click="addRole()">添加角色</el-button>
            </el-col>
        </el-row>
        <el-table :data="rolelist"
                  style="width: 100%"
                  border
                  class="tabClass">
            <!-- 表格的第一列设置展开功能，通过嵌套for循环的方式展现层级关系
                  这里是将第一列分为一行二列，再行内的第二列分为一行两列 -->
            <el-table-column label
                             type="expand">
                <template slot-scope="scope">
                    <el-row v-for="(item1,i) in scope.row.children"
                            :key="i"
                            class="rowClass">

                        <!-- 第一层级 -->
                        <el-col :span="3">
                            <el-tag type
                                    @close="showDeleteRoleDialog(scope.row,item1.id)"
                                    :closable="true">{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                            <!--样式调整，添加向右的图标-->
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="(item2,i) in item1.children"
                                    :key="i"
                                    class="rowClass">

                                <!-- 第二层级 -->
                                <el-col :span="3">
                                    <el-tag type="success"
                                            @close="showDeleteRoleDialog(scope.row,item2.id)"
                                            :closable="true">{{item2.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>

                                <!-- 第三层级 -->
                                <el-col :span="2.5"
                                        v-for="(item3,i) in item2.children"
                                        :key="i">
                                    <el-tag type="warning"
                                            :closable="true"
                                            @close="showDeleteRoleDialog(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- 角色为空时的提示信息 
                    注意判断位置是在第一层级的末尾处
                    -->
                    <span v-if="scope.row.children.length===0">该角色未分配权限</span>
                </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>

            <el-table-column prop="roleName"
                             label="名称"></el-table-column>
            <el-table-column prop="roleDesc"
                             label="描述"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="编辑"
                                placement="top"
                                effect="light">
                        <el-button size="mini"
                                   plain
                                   type="primary"
                                   icon="el-icon-edit"
                                   circle
                                   @click="showEditRoleDialog(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                placement="top"
                                effect="light">
                        <el-button size="mini"
                                   plain
                                   type="danger"
                                   icon="el-icon-delete"
                                   circle
                                   @click="showDeleteUserDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配权限"
                                placement="top"
                                effect="light">
                        <el-button size="mini"
                                   plain
                                   type="success"
                                   icon="el-icon-setting"
                                   circle
                                   @click="showEditUserRolDialog(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑角色信息"
                   :visible.sync="dialogFormVisibleEdit"
                   :modal="true">
            <el-form :model="form">
                <el-form-item label="角色名称"
                              label-width="100px">
                    <el-input v-model="form.roleName"
                              disabled
                              autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="角色描述"
                              label-width="100px">
                    <el-input v-model="form.roleDesc"
                              autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary"
                           @click="editRole()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data () {
        return {
            rolelist: [],

            dialogFormVisibleEdit: false,

            form: {
                roleName: "",
                roleDesc: ""
            }
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
        this.getRoleList();
    },
    methods: {
        addRole () { },
        async getRoleList () {
            let res = await this.$http.get("roles");
            // console.log(res)
            if (res.data.meta.status === 200) {
                this.rolelist = res.data.data;
                // this.$message.success(res.data.meta.msg);
            } else {
                this.$message.error(res.data.meta.msg);
            }
        },

        // 显示编辑角色对话框
        showEditRoleDialog (roleInfo) {
            this.dialogFormVisibleEdit = true;
            this.form = roleInfo;
        },

        // 提交角色描述修改请求
        async editRole () {
            let res = await this.$http.put(`roles/${this.form.id}`, this.form);
            console.log(res);
            if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg);
                this.form = {}; // 清空对话中的数据
                this.dialogFormVisibleEdit = false; // 关闭对话框
                this.getRoleList(); // 更新视图
            } else {
                this.$message.error(res.data.meta.msg);
            }
        },

        // 点击tag标签的关闭按钮时触发
        // 根据接口文档，需要提供2个参数：
        // 角色ID（roleID）	和 权限ID(rightId)
        showDeleteRoleDialog (role, rightId) {
            this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    let res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                    if (res.data.meta.status === 200) {
                        role.children = res.data.data   // 更新视图，刷新展开的局部数据
                    } else {
                        this.$message.error(res.data.meta.msg);
                    }
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                })
        }
    }
};
</script>

<style>
.addRoleRow {
    margin-top: 10px;
}
.rowClass {
    margin-bottom: 5px;
}
</style>