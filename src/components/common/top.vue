<template>
  <!-- 头部组件 -->
  <!-- 使用了一个 Layout布局组件 :
   1. 通过基础的 24 分栏，迅速简便地创建布局
   2. 通过 row 和 col 组件，并通过 col 组件的 span 属性我们就可以自由地组合布局。
   -->
  <el-row>
  <el-col :span="3"><div class="grid-content bg-purple">左边</div></el-col>
  <el-col :span="19"><div class="grid-content center bg-purple-light">电商后端管理系统</div></el-col>
  <el-col :span="2">
    <div class="grid-content bg-purple">
      <a href="#" @click.prevent="logout">退出</a>
    </div>
  </el-col>
  </el-row>
</template>
<script>
    export default {
      methods: {
        logout () {
          // 使用element-ui中的 MessageBox 弹框组件中的 确认消息弹框:
          // 调用$confirm方法即可打开消息提示，它模拟了系统的 confirm
            // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            //   confirmButtonText: '确定',  // 确认按钮的文本内容
            //   cancelButtonText: '取消',   // 取消按钮的文本内容
            //   type: 'warning'   // 文字前面会有一个警告 图标
            // }).then(() => {
            //   this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            //   });
            // })
          this.$confirm('是否退出', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '退出成功!'
            });
            // 清除 token:
            window.localStorage.removeItem('token');
            // 并跳转到登录页面:
            this.$router.push('/login');
        }).catch(() => {
            this.$message({
              type: 'danger',
              message: '取消退出'
            })
          })
        }
      }
    }
</script>

<style>
 .center{
   font-size: 24px;
   color: #ccc;
 }
 .bg-purple{
   text-align: right;
 }
  .bg-purple a{
    color: blueviolet;
  }
</style>
