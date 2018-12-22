<template>
    <div>
      <!-- 面包屑导航: 使用全局自定义组件 : mybread -->
      <mybread level1="权限管理" level2="用户列表"></mybread>
      <!-- 添加按钮区域: 使用button组件 -->
      <el-button type="primary" plain @click="addRolesShow = true">添加角色</el-button>
      <!-- 添加用户界面区域: 使用dialog对话框组件 -->
      <el-dialog title="添加角色" :visible.sync="addRolesShow">
        <el-form :model="roleForm">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRolesShow = false">取 消</el-button>
          <el-button type="primary" @click="postAddRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 表格区域: 使用table组件
       当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能。
       通过设置 type="expand" 和 Scoped slot 可以开启展开行功能，el-table-column 的模板会被渲染成为展开行的内容，
       展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。
       在表格组件内的最前面位置 添加结构:
       <el-table-column type="expand">
          <template slot-scope="props">
            {{roleData}}
          </template>
        </el-table-column>
       -->
      <el-table ref="singleTable" :data="roleData" border highlight-current-row style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!--  展开行的内部结构:  使用一个 tag标签组件 tag标签要想实现可以关闭, 在tag标签内加入: closable属性
                  <el-tag closable></el-tag>
                  ---- tag标签有一个close事件: 当关闭tag标签时触发, 所以需要给所有的tag标签进行绑定,
                       当close事件触发后, 发送请求, 移除掉 该权限
                        - 请求方式: delete
                        - 参数: 角色id: roleId  /  权限id:  rightId

            结构的布局: 需要使用layout布局(默认将一行分为 24 份，通过使用 :span=""  进行迅速简便地创建布局。)
            先将页面划分为左右两列: 一级权限占一列, 二三级权限占一列
            然后将二三级权限的那一列在进行划分, 二级权限占一列, 三级权限占一列
            -->
            <!--{{scope.row}}-->
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
                <el-col :span="4">
                  <el-tag closable type="success" @close="removeRigths(scope.row.id, item1.id, scope.row)">
                    {{item1.authName}}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <el-row v-for="item2 in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="info" closable @close="removeRigths(scope.row.id, item2.id, scope.row)">
                        {{ item2.authName }}
                      </el-tag>
                    </el-col>
                    <el-col :span="18">
                        <el-tag type="danger" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRights(scope.row.id, item3.id, scope.row)">
                          {{item3.authName}}
                        </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            <el-row v-if="scope.row.children.length === 0">没有任何权限</el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column property="roleName" label="角色名称"></el-table-column>
        <el-table-column property="roleDesc" label="角色描述"></el-table-column>
        <el-table-column  label="操作">
          <!-- 表格区域-操作部分: 使用 button 组件 -->
          <template slot-scope="scope">
            <!-- scope.row 是当前行的数据源, 内部保存了当前行的所有数据 -->
            <!--{{scope.row}}-->
            <el-button type="success" icon="el-icon-edit" plain size="small"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
            <el-button type="info" icon="el-icon-check" plain size="small" @click="setRights(scope.row)"></el-button>
            <!-- 完成一个角色权限分配功能:
                给权限分配按钮绑定一个点击事件, 当事件触发后, 显示权限分配面板: dialog对话框组件
                  @click = "setRight"
             -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限面板  使用dialog对话框 -->
      <el-dialog title="权限分配" :visible.sync="rightsShow">
          <!-- 内部结构: 使用tree树型控件
                data： 数据源
                     :props="defaultProps"  设置当前 tree 组件的相关属性：
                        defaultProps:{
                          children: 当前这个节点下面子节点的属性
                           label: 当前节点显示的内容
                        }
                    default-expanded-all：   设置默认展开
                    default-checked-keys："defaulChecked"   设置默认选中项
                    node-key：设置当前元素上的标识
           -- 方法
                    getHalfCheckedKeys	  返回目前半选中的节点的 key 所组成的数组
                    getCheckedKeys	      则返回目前被 全选中的节点的 key 所组成的数组
                    -->
        <el-tree show-checkbox node-key="id" ref="mytree"
                   default-expand-all :default-checked-keys="defaulChecked"
                   :data="rightsData" :props="defaultProps">
          </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="rightsShow = false">取 消</el-button>
          <el-button type="primary" @click="updateRight">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
          return {
            rightsData: [], // 权限
            defaultProps: {
              label: 'authName',
              children: 'children'
            },
            roleId: '', // 角色id
            addRolesShow : false,
            roleForm:{
              roleName:'',
              roleDesc:''
            },
            roleData:[], // 角色
            rightsShow : false,
            defaulChecked:[], // 默认选中的
            formLabelWidth: '80px'
          }
        },
        methods:{
          // 获取所有的角色信息
          async getAllRoles(){
            var res = await this.$http.get('roles')
            var {data, meta:{msg, status}} = res.data
            if(status === 200){
              this.roleData = data
            }
          },
          // 发送添加用户请求
          async postAddRoles () {
            var res = await this.$http.post('roles',{roleName: this.roleForm.roleName, roleDesc: this.roleForm.roleDesc})
            var {data, meta:{msg, status}} = res.data
            console.log(res)
            if(status === 201){
              this.$message({
                message: msg,
                type: 'success'
              })
              this.getAllRoles()
            }else{
              this.$message.error(msg)
            }
            this.addRolesShow = false
          },
          // 获取所有的权限信息
          async getAllRights () {
            var res = await this.$http.get('rights/tree')
            var {data, meta:{msg, status}} = res.data
            if(status === 200){
              this.rightsData = data
            }
          },
          // 删除用户权限
          async removeRights (roleId, rightsId, row) {
            var res = await this.$http.delete(`roles/${roleId}/rights/${rightsId}`)
            var {data, meta:{msg, status}} = res.data
            if(status === 200){
              this.$message({
                message: msg,
                type: 'success'
              })
              // this.roleData = data
              // this.getAllRoles()   如果重新获取全部数据, 用户体验不好, 可以只更新当前行的数据
              // console.log(data)
              // data内保存了当前操作角色的所有权限信息, 所以可以将data赋值给当前行的数据源
              row.children = data
            }else{
              this.$message.error(msg)
            }
          },
          // 显示分配权限面板
          async setRights (row) {
            this.roleId = row.id
            console.log(row.id)
            this.defaulChecked = []
            this.rightsShow = true
            // 还需要发送请求, 获取到所有的权限数据
            this.getAllRights()
            row.children.forEach(item1 => {
                this.defaulChecked.push(item1.id)
                item1.children.forEach(item2 => {
                  this.defaulChecked.push(item2.id)
                  item2.children.forEach(item3 => {
                    this.defaulChecked.push(item3.id)
                  })
                })
            })
          },
          // 更新选中的 权限 id
          async updateRight() {
            var arr1 = this.$refs.mytree.getCheckedKeys();
            var arr2 = this.$refs.mytree.getHalfCheckedKeys()
            console.log(arr1,arr2, this.roleId)
            var arr = arr1.concat(arr2)
            // 也可以使用 arr = [...arr1, ...arr2]
            var str = arr.join();
            // console.log(str)
            // 发送请求
            var res = await this.$http.post(`roles/${this.roleId}/rights`, {rids: str})
            var {msg, status} = res.data.meta
            if(status === 200){
              this.$message({
                message: msg ,
                type: 'success'
              })
              this.getAllRoles()
            }else{
              this.$message.error(msg)
            }
            this.rightsShow = false
          },
        },
        created(){
         this.getAllRoles()
        }
    }
</script>

<style scoped>
  .el-tag{
    margin: 5px;
  }
</style>
