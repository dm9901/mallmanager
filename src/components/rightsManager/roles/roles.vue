<template>
    <el-card class="box-card">
        <my-bread level1="权限管理"
                  level2="角色列表"></my-bread>

        <el-row class="addRoleRow">
            <el-col>
                <el-button type="primary"
                           @click="showAddAddRoleDialog()">添加角色</el-button>
            </el-col>
        </el-row>
        <el-table :data="rolelist"
                  style="width: 100%"
                  border
                  class="tabClass">
            <!-- 表格的第一列设置展开功能，通过嵌套for循环的方式展现层级关系
            这里是将第一列分为一行二列，再行内的第二列分为一行两列-->
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
                                   @click="deleteRole(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配权限"
                                placement="top"
                                effect="light">
                        <el-button size="mini"
                                   plain
                                   type="success"
                                   icon="el-icon-setting"
                                   circle
                                   @click="showSetUserRoleDia(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色信息"
                   :visible.sync="dialogFormVisibleAdd"
                   :modal="true">
            <el-form :model="form">
                <el-form-item label="角色名称"
                              label-width="100px">
                    <el-input v-model="form.roleName"
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
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary"
                           @click="addRole()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑角色对话框 -->
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

        <!-- 角色权限分配对话框 -->
        <el-dialog title="角色权限分配"
                   :visible.sync="dialogFormVisibleRight"
                   :modal="true">
            <!-- 
                data 数据源
                show-checkbox 选择框
                node-key 每个节点的唯一标识，通常是data数据源中key名id
                default-expanded-keys 默认展开[要展开的节点的id]
                default-checked-keys [已经选中的节点的id]
                props 配置项{label,children}
                label 节点的文字标题和children节点的子节点
                值都来源于data绑定数据源中的该数据的key名“label”

                :default-expanded-keys="[2, 3]" 此方法将有：default-expand-all 代替
                :default-checked-keys="[5]"
            -->

            <!--设置ref属性值 -->
            <el-tree ref="tree"
                     :data="treelist"
                     show-checkbox
                     node-key="id"
                     default-expand-all
                     :default-checked-keys="arrcheck"
                     :props="defaultProps"></el-tree>
            <div slot="footer"
                 class="dialog-footer">
                <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
                <el-button type="primary"
                           @click="setRoleRight()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data () {
        return {
            rolelist: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            dialogFormVisibleRight: false,

            // 添加角色和修改角色共用form
            form: {
                roleName: "",
                roleDesc: ""
            },

            // 树形结构中的信息
            treelist: [],
            defaultProps: {
                label: "authName",
                children: "children"
            },
            arrtemp1: [],
            arrcheck: [], //已经被选中的角色的id
            currRoleId: -1 //当前角色的Id，用在提交修改中
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
        // 显示添加角色对话框
        showAddAddRoleDialog () {
            this.dialogFormVisibleAdd = true
        },
        // 添加角色
        async addRole () {
            let res = await this.$http.post(`roles`, this.form);
            console.log(res);
            if (res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg);
                this.form = {}; // 清空对话中的数据
                this.dialogFormVisibleAdd = false; // 关闭对话框
                this.getRoleList(); // 更新视图
            } else {
                this.$message.error(res.data.meta.msg);
            }
        },
        async getRoleList () {
            let res = await this.$http.get("roles");
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
            // console.log(res);
            if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg);
                this.form = {}; // 清空对话中的数据
                this.dialogFormVisibleEdit = false; // 关闭对话框
                this.getRoleList(); // 更新视图
            } else {
                this.$message.error(res.data.meta.msg);
            }
        },

        // 删除角色对应权限（角色保留）
        // 点击tag标签的关闭按钮时触发
        // 根据接口文档，需要提供2个参数：
        // 角色ID（roleID）	和 权限ID(rightId)
        showDeleteRoleDialog (role, rightId) {
            this.$confirm("此操作将永久删除该角色的权限, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    let res = await this.$http.delete(
                        `roles/${role.id}/rights/${rightId}`
                    );
                    if (res.data.meta.status === 200) {
                        role.children = res.data.data; // 更新视图，刷新展开的局部数据
                    } else {
                        this.$message.error(res.data.meta.msg);
                    }
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },

        // 删除角色及旗下所有权限,roles/:id
        async deleteRole (roleId) {
            this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    let res = await this.$http.delete(`roles/${roleId}`)
                    if (res.data.meta.status === 200) {
                        this.$message.success(res.data.meta.msg);
                        this.getRoleList() // 更新视图，刷新展开的局部数据
                    } else {
                        this.$message.error(res.data.meta.msg);
                    }
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        // 显示角色已有的权限
        async showSetUserRoleDia (roles) {
            // 给currRoleId赋值，后面会使用到
            this.currRoleId = roles.id

            // 获取树形权限的数据
            let res = await this.$http.get(`rights/tree`);
            if (res.data.meta.status === 200) {
                this.treelist = res.data.data;
            } else {
                this.$message.error(res.data.meta.msg);
            }

            // 方法一：遍历data数据源，将id放入数组中，然后在赋值给：default-expanded - keys
            // var arrtemp1 = []
            // this.treelist.forEach(item1 => {
            //     arrtemp1.push(item1.id)
            //     item1.children.forEach(item2 => {
            //         arrtemp1.push(item2.id)
            //         item2.children.forEach(item3 => {
            //             arrtemp1.push(item1.id)
            //         })
            //     })
            // })
            // 方法二：以上代码可以由一行代码替代：在el-tree属性中指定:
            // :default-expand-all="true" 也可以写成：default-expand-all
            // this.arrtemp1 = arrtemp1
            // console.log(arrtemp1);

            // 注意：1、2级权限不能添加到数组中，否则不会出现半选的结果！！
            var arrtemp1 = []
            roles.children.forEach(item1 => {
                // arrtemp1.push(item1.id)
                item1.children.forEach(item2 => {
                    // arrtemp1.push(item2.id)
                    item2.children.forEach(item3 => {
                        arrtemp1.push(item3.id)
                    })
                })
            })
            this.arrcheck = arrtemp1
            this.dialogFormVisibleRight = true;
        },

        // 修改权限  发送请求
        // roles/:roleId/rights
        // roleId 当前要修改的角色的id
        // rids 树形节点中，所有全选和半选的lable的id，是一个数组

        // 获取全选的id的数组arr1 getCheckedKeys（）
        // 获取半选的id的数据arr2 getHalfCheckedKeys（）
        // 由于以上两个方法是el-tree标签的js方法，所以，在调用时是需要像操作DOM元素一样调用
        // 例如： 
        // var div = document.getElementById('div')
        // div.innerText;
        // 所以，步骤：
        // 1. 给要操作的dom元素设置ref属性值，如：input ref=“txt”
        // 2. this.$refs.ref属性值.js方法名() ,如：this.$refs.txt.foucs()
        async setRoleRight () {
            let arr1 = this.$refs.tree.getCheckedKeys()
            let arr2 = this.$refs.tree.getHalfCheckedKeys()

            // ES6 中的 展开 运算符，方法：...数组或者对象
            // 如：arr1=[1,2,3],arr2=[4,5,6]
            // [...arr1,...arr2]的结果是：[1,2,3,4,5,6]

            // 由于接口文档中明确要求：rids	权限 ID 列表	以 , 分割的权限 ID 列表，所以：rids: arr.join(',')
            let arr = [...arr1, ...arr2]
            let res = await this.$http.post(`roles/${this.currRoleId}/rights`, { rids: arr.join(',') })
            // console.log(res)
            if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg);
                // 更新视图
                this.getRoleList()
                this.dialogFormVisibleRight = false
            } else {
                this.$message.error(res.data.meta.msg);
            }

        }
    }
}
</script>

<style>
.addRoleRow {
    margin-top: 10px;
}
.rowClass {
    margin-bottom: 5px;
}
</style>