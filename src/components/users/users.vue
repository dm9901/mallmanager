<template>
    <el-card class="box-card">
        <!-- 二次封装的面包屑部分 -->
        <my-bread level1="用户管理"
                  level2="用户列表"></my-bread>

        <!-- 
            2 搜索 
            clearable:默认值为true，在输入框中显示“清空”的小图标
            @clear：在执行clearable时触发
            @keyup.enter.native:侦听回车事件
        -->
        <el-row class="searchRow">
            <el-col>
                <el-input clearable
                          @keyup.enter.native="searchUser()"
                          @clear="searchUser()"
                          placeholder="请输入内容"
                          v-model="query"
                          class="searchInput">
                    <el-button slot="append"
                               icon="el-icon-search"
                               @click="searchUser()"></el-button>
                </el-input>
                <el-button type="success"
                           @click="showDiaAdd()">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 3 表格 -->
        <!-- 设置表格高度 
            height="300px"
        -->
        <el-table :data="userList"
                  style="width: 100%">
            <el-table-column type="index"
                             label="#"></el-table-column>

            <!-- prop 指数均中的列名，必须要对应，否则取不到数据 -->
            <el-table-column prop="username"
                             label="姓名"></el-table-column>
            <el-table-column prop="email"
                             label="邮箱"></el-table-column>
            <el-table-column prop="mobile"
                             label="电话"></el-table-column>
            <el-table-column prop="role_name"
                             label="角色"></el-table-column>
            <el-table-column prop="mg_state"
                             label="用户状态">
                <template slot-scope="userStatus">
                    <el-switch v-model="userStatus.row.mg_state"
                               active-color="#13ce66"
                               inactive-color="#ff4949"
                               @change="modifyStatus(userStatus)"></el-switch>
                </template>
            </el-table-column>

            <!-- 常规写法：
            <el-table-column prop="create_time"
                             label="创建时间">
            </el-table-column>
            以上方法显示的结果不正确
            如果单元格内显示的内容不是字符串（文本），
            需要给被显示的内容外包裹一个telplate

            -->

            <!-- 使用过滤器后的写法：
            telplate内部要用数据，需要设置slot-scope属性
            该属性的值是要用数据create_time的数据源userlist

            slot-scope的值userlist其实就是el-table绑定的数据userlist
            userlist.row.数组中的每个对象

            slot-scope 作用：传值
            slot-scope的值会自动去上一级找最外层标签<el-table>所绑定的数据userlist
            slotscope="scope" 此时 "scope"就是userlist数组,"scope"可以是任意非关键字命名，但需要和插值表达式中的相对应！
            scope.row是数组的每个对象
            scope.row.create_time 是我们要用的数据 
            -->
            <el-table-column label="创建时间">
                <template slot-scope="userlist">{{userlist.row.create_time | fmdate}}</template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="userList">
                    <el-tooltip content="编辑"
                                placement="top"
                                effect="light">
                        <el-button size="mini"
                                   plain
                                   type="primary"
                                   icon="el-icon-edit"
                                   circle
                                   @click="showEditUserDialog(userList.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                placement="top"
                                effect="light">
                        <el-button size="mini"
                                   plain
                                   type="danger"
                                   icon="el-icon-delete"
                                   circle
                                   @click="showDeleteUserDialog(userList.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配角色"
                                placement="top"
                                effect="light">
                        <el-button size="mini"
                                   plain
                                   type="success"
                                   icon="el-icon-setting"
                                   circle
                                   @click="showEditUserRolDialog(userList.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 
            4 分页 
            @size-change：每页条数变化时 触发
            @current-change：当前页改变时 触发
            :current-page：设置当前页是第几页
            :page-sizes="[5, 10, 20, 40]"：设置每页显示多少条记录的下拉选项
            :page-size="pagesize"：设置每页显示多少条记录
            :total：总共多少条记录
        -->
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pagenum"
                       :page-sizes="[5, 10, 20, 40]"
                       :page-size="pagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"></el-pagination>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户"
                   :visible.sync="dialogFormVisibleAdd"
                   :modal="true">
            <el-form :model="form">
                <el-form-item label="用户名"
                              label-width="100px">
                    <el-input v-model="form.username"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码"
                              label-width="100px">
                    <el-input v-model="form.password"
                              :type="passw"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱"
                              label-width="100px">
                    <el-input v-model="form.email"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话"
                              label-width="100px">
                    <el-input v-model="form.mobile"
                              autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary"
                           @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户"
                   :visible.sync="dialogFormVisibleEdit"
                   :modal="true">
            <el-form :model="form">
                <el-form-item label="用户名"
                              label-width="100px">
                    <el-input v-model="form.username"
                              disabled
                              autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="邮箱"
                              label-width="100px">
                    <el-input v-model="form.email"
                              autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话"
                              label-width="100px">
                    <el-input v-model="form.mobile"
                              autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary"
                           @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 角色分配对话框 -->
        <el-dialog title="角色分配"
                   :visible.sync="dialogFormVisibleRol">
            <el-form :model="formRol">
                <el-form-item label="当前用户："
                              label-width="100px">{{formRol.username}}</el-form-item>
                <el-form-item label="当前角色："
                              label-width="100px">{{formRol.role_name}}</el-form-item>
                <el-form-item label="新的角色："
                              label-width="100px">
                    <el-select v-model="formRol.region"
                               placeholder="请选择角色"
                               @change="testA()">
                        <el-option v-for="item in options"
                                   :key="item.id"
                                   :label="item.roleName"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
                <el-button type="primary"
                           @click="editUserRol()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data () {
        return {
            query: "",
            userList: [],

            // 分页相关
            pagenum: 1, //默认从第一页开始获取
            pagesize: 10, //每页显示多少条记录
            total: -1,

            // 添加/编辑用户对话框相关
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            dialogFormVisibleRol: false,
            // userID: '',

            passw: "password", //隐藏密码
            form: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            },

            // 角色表单数据
            formRol: {
                username: "",
                role_name: "",
                region: ""
            },
            // 角色分配下拉框中的值，来自服务器端
            options: []
        };
    },
    created () {
        this.getUserList();
    },
    methods: {
        testA () {
            // alert(this.formRol.region)
        },
        // 角色分配
        // 打开角色分配对话框
        async showEditUserRolDialog (userInfo) {
            this.formRol = {};
            this.formRol = userInfo;

            // 从服务器请求下拉框中的值
            let res = await this.$http.get("roles");
            if (res.data.meta.status === 200) {
                this.options = res.data.data;
                console.log(this.options);
                // this.$message.success(res.data.meta.msg)
            } else {
                this.$message.error(res.data.meta.msg);
            }
            this.dialogFormVisibleRol = true;
        },
        // 编辑用户角色请求
        // 此处注意 rid 的传值方式！！！
        async editUserRol () {
            let res = await this.$http.put(`users/${this.formRol.id}/role`, {
                rid: this.formRol.region
            });
            if (res.data.meta.status === 200) {
                // this.$message.success(res.data.meta.msg);
                this.dialogFormVisibleRol = false;
                this.getUserList();
            } else {
                this.$message.error(res.data.meta.msg);
            }
        },

        // 修改用户状态
        async modifyStatus (userlist) {
            let res = await this.$http.put(
                `users/${userlist.row.id}/state/${userlist.row.mg_state}`
            );
            if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg);
            } else {
                this.$message.error(res.data.meta.msg);
            }
        },

        // 编辑用户部分
        // 显示编辑对话框
        showEditUserDialog (userInfo) {
            this.form = userInfo;
            this.dialogFormVisibleEdit = true;
        },
        async editUser () {
            // 发送修改请求，注意要带参数this.form
            let res = await this.$http.put(`users/${this.form.id}`, this.form);
            let {
                meta: { status, msg }
            } = res.data;
            if (status === 200) {
                this.$message.success(msg);
                this.form = {}; // 清空对话中的数据
                this.dialogFormVisibleEdit = false; // 关闭对话框
                this.getUserList(); // 更新视图
            } else {
                this.$message.error(msg);
            }
        },

        // 删除用户部分
        showDeleteUserDialog (userID) {
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    // 发送删除请求
                    let res = await this.$http.delete(`users/${userID}`);
                    if (res.data.meta.status === 200) {
                        this.$message.success(res.data.meta.msg);
                        this.pagenum = 1;
                        this.getUserList();
                    } else {
                        this.$message.error(res.data.meta.msg);
                    }
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },

        // 添加用户对话框相关
        // 显示对话框
        showDiaAdd () {
            this.form = {}; // 显示对话框之前先清空form的值
            this.dialogFormVisibleAdd = true;
        },
        // 添加用户
        async addUser () {
            let res = await this.$http.post("users", this.form);
            let {
                meta: { status, msg }
            } = res.data;
            if (status === 201) {
                this.$message.success(msg);
                this.form = {}; // 清空对话中的数据
                this.dialogFormVisibleAdd = false; // 关闭对话框
                this.getUserList(); // 更新视图
            } else {
                this.$message.error(msg);
            }
            // console.log(res)
        },

        // 分页相关函数
        // 注意：变量val是分页函数自带的！！！
        handleSizeChange (val) {
            this.pagenum = 1; // 改变每页显示的数量后，从第一页开始显示
            this.pagesize = val;
            this.getUserList();
        },
        handleCurrentChange (val) {
            this.pagenum = val;
            this.getUserList();
        },

        // 搜索用户
        searchUser () {
            this.pagenum = 1;
            this.getUserList();
        },

        async getUserList () {
            const res = await this.$http.get(
                // 特别注意：这里的引号是键盘左上角，波浪号下面的那个，而不是常用的单引号！！！
                `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
            );
            // console.log(res);
            // 根据返回数据结构，取出需要的数据
            const {
                data: { users, total, pagenum },
                meta: { msg, status }
            } = res.data;

            // 根据取出的数据，渲染至页面
            if (status === 200) {
                this.total = total;
                this.userList = users;
                this.pagenum = pagenum;
                if (total === 0) {
                    this.$message.success(
                        "执行成功！但未找到和 [" + this.query + "] 相关的数据"
                    );
                } else {
                    // this.$message.success(msg);
                }
            } else {
                this.$message.error(msg);
            }
        }
    }
};
</script>

<style>
.box-card {
    height: 100%;
    margin: -20px -20px 0px -15px;
}
.searchRow {
    margin-top: 10px;
}
.searchInput {
    width: 400px;
}
</style>