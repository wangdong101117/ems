<template>
  <!-- 面包屑导航:
     先使用element-ui提供的 一个卡片容器: <el-card>  -->
  <el-col :span="24">
    <mybread level1="用户管理" level2="用户列表"></mybread>
    <!--  搜索区域:
       使用element-ui input输入框 组件
    -->
    <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <!-- 使用button 组件  -->
    <el-button type="success" plain @click="showAdd = true">添加用户</el-button>

    <!--  表格区域:  使用 表格组件  -->
    <el-table ref="singleTable" :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="username" label="姓名" width="120"></el-table-column>
      <el-table-column property="email" label="邮箱" width="120"></el-table-column>
      <el-table-column property="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 使用switch开关组件
          如果仅仅使用 <el-switch>标签, 无法实现效果
          要添加一个父容器: <template slot-scope="scope"></template>
         -->
        <template slot-scope="scope">
          <!-- 注意switch开关的使用
           scope.row.mg_state :  用户的当前转态
           -->
          <!--{{scope.row.mg_state}}-->
          <el-switch @change="switchChange(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column property="" label="操作">
        <!-- 表格区域-操作部分: 使用 button 组件 -->
        <template slot-scope="scope">
          <!-- scope.row 是当前行的数据源, 内部保存了当前行的所有数据 -->
          <!--{{scope.row}}-->
          <el-button type="success" icon="el-icon-edit" plain size="small" @click="edit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delUser(scope.row.id)"></el-button>
          <el-button type="info" icon="el-icon-check" plain size="small" @click="setRole(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页区域: Pagination 分页组件
      @size-change="handleSizeChange"   - 绑定的修改每页数据选择的事件
      @current-page="handleCurrentChange"  - 绑定的跳转页号 事件
      :current-page="currentPage4"  - 当前显示的是第几页
      :page-sizes  - 每页数据条数选项
      :page-size  -  每页的数据条数
      layout=""  // 用于控制分页结构 每个部分的显示
      :total: 数据总条数
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager , next, jumper"
      :total="total">
    </el-pagination>
    <!-- 新增面板: 点击添加用户, 弹出form表单
        - 使用一个dialog弹出框组件
            - title  弹出框标题
            - :visible.sync  控制弹出框显示隐藏
            - before-close
         - 在弹出框组件中嵌套form表单组件
     -->
    <el-dialog title="添加" :visible.sync="showAdd">
      <el-form :model="form">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除对话框: 使用messageBox弹框的确认消息框组件 -->

    <!-- 编辑界面结构: 点击编辑按钮, 弹出diolag对话框组件  里面嵌套form表单
          :visible.sync="editShow"   用来控制对话框显示隐藏
          :model="editForm"   绑定的数据 :  对象结构
     -->
    <el-dialog title="修改用户" :visible.sync="editShow">
      <el-form :model="editForm">
        <el-form-item disabled label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!--  分配角色面板结构 使用dialog对话框组件
      点击 分配按钮, 弹出dialog对话框 , 并将当前用户的角色渲染到对话框中 -->
    <el-dialog title="分配角色" :visible.sync="roleShow">
      <el-form :model="roleForm">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <el-input disabled v-model="roleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择角色" :label-width="formLabelWidth">
          <el-select v-model="roleForm.rid" placeholder="请选择角色">
            <!--  使用v-model给下拉菜单绑定数据:
              整个角色分配面板绑定了一个 roleForm, 下拉菜单绑定了一个roleForm.rid
              roleForm.rid : 是每个用户的角色id
             -->
            <!--{{roleForm.rid}}-->
            <!--  每一个角色都对应一个id, 就是item.id内保存的id值
              label 对应的是下拉选项的文本内容  也就是 角色名称
              value 对应的是下拉选项中的值  角色对应的id
            -->
            <!--  item是一个对象结构: children: (...),
              id: 30,  // 是角色 对应的 id值
              roleDesc: "技术负责人", roleName: "主管"
              -->
            <el-option v-for="item in data" :key="item.value" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleShow = false">取 消</el-button>
        <el-button type="primary" @click="postRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>
<script>
  export default {
    data() {
      return {
        pagenum: 1,
        pagesize: 4,
        pagesizes: [2, 4, 6, 8],
        total: 20,
        search: '',
        tableData: [],
        showAdd: false,
        editShow: false,
        roleShow: false,
        form: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        editForm: {
          id: '',
          username: '',
          email: '',
          mobile: ''
        },
        data: [],
        roleForm: {
          id: '',
          rid: '',
          username: ''
        },
        formLabelWidth: '80px'
      }
    },
    methods: {
      // 获取所有的数据
      async getAllData() {
        var res = await this.$http.get(`users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        // console.log(res)
        var {data, meta: {msg, status}} = res.data;
        if (status === 200) {
          this.tableData = data.users
          this.total = data.total
        }
      },
      // 获取所有的用户
      async addUser() {
        var res = await this.$http.post('users', this.form)
        // console.log(res);
        var {data, meta: {msg, status}} = res.data
        if (status === 201) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.getAllData()
        } else {
          this.$message.error(msg)
        }
        // 清除表单中的默认数据, 调用clearForm方法
        this.clearform()
        // 关闭弹框:
        this.showAdd = false
      },
      clearform() {
        for (var key in this.form) {
          this.form[key] = ''
        }
      },
      cancel() {
      },
      // 根据关键字查询用户
      searchUser() {
        this.getAllData()
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        // 参数val就是当前的 pagesize 每页的条数
        this.pagesize = val
        this.getAllData()
      },
      handleCurrentChange(val) {
        // 参数val 就是 当前的pagenum 当前的页号
        this.pagenum = val
        this.getAllData()
      },
      // 删除用户
      delUser(id) {
        this.$confirm('是否删除该用户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var res = await this.$http.delete(`users/${id}`)
          var {msg, status} = res.data.meta
          if (status === 200) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.getAllData()
          } else {
            this.$message.error(msg)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /* 修改用户界面 填充表单元素内容
        *  给修改按钮绑定一个点击事件, 并传入当前行的所有数据
        *  当点击事件触发后, 设置editShow = true; 显示form表单组件, 并将当前行的数据填入到form表单中
        *  因为将当前行的所有数据作为参数进行了传入并使用row进行接收, 将row赋值给editForm即可 */
      edit(row) {
        this.editShow = true;
        this.editForm = row;
      },
      // 发送修改请求
      async editUser() {
        // 双向绑定了editForm
        var res = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        var {data, meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.editShow = false
          this.getAllData()
        } else {
          this.$message.error(msg)
        }
      },
      // 开关切换  发送put请求
      async switchChange(row) {
        console.log(row.mg_state)
        var res = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
        console.log(res)
        var {msg, status} = res.data.meta
        if (status === 200) {
          this.$message({
            message: msg,
            type: 'success'
          })
          this.getAllData()
        } else {
          this.$message.error(msg)
        }
      },
      // 分配角色功能 对话框显示
      async setRole(row) {
        this.roleShow = true;
        this.roleForm.username = row.username;
        this.roleForm.id = row.id
        console.log(row);
        // 根据id值获取用户信息, 得到rid
        var res = await this.$http.get(`users/${row.id}`)
        console.log(res)
        // data: {id: 502, rid: 39, username: "linken", mobile: "120", email: "123@qq.com"}
        var {data, meta: {res, status}} = res.data
        this.roleForm.rid = data.rid
        // console.log(this.roleForm)
      },
      // 获取到所有角色的数据
      async getAllRole() {
        var res = await this.$http.get('roles')
        // console.log(res)
        var {data, meta: {msg, status}} = res.data
        if (status === 200) {
          this.data = data
          console.log(this.data)
          // data中含有一个id  是角色对应的id值
        }
      },
      // 发送修改 分配角色功能 请求
      async postRole() {
        var res = await this.$http.put(`users/${this.roleForm.id}/role`,{rid: `${this.roleForm.rid}`})
        // console.log(res);
        var {data, meta:{msg, status}} = res.data
        if(status === 200){
          this.$message({
            message: msg,
            type: 'success'
          })
          this.roleShow = false
        }else{
          this.$message.error(msg)
        }

      },

    },
    created() {
      this.getAllData()
      this.getAllRole()

    }
  }
</script>

<style>
  .input-with-select {
    width: 400px;
  }
</style>
