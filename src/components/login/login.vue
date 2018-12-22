<template>
    <!-- 使用了element-ui中的 from表单组件  -->
  <div id="form">
    <!--通过设置 label-position 属性可以改变表单域标签的位置，可选值为 top、left，当设为 top 时标签会置于表单域的顶部-->
    <el-form :model="formObj" status-icon  ref="ruleForm2" label-width="100px" class="el-form" label-position="top">
      <h2>请登录</h2>
      <el-form-item label="用户名" prop="pass" label-position="top">
        <el-input type="text" v-model="formObj.username" autocomplete="off" name="uaername"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="checkPass">
        <el-input type="password" v-model="formObj.password" autocomplete="off" name="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary submit" round  @click.prevent="getBtn" class="btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import axios from 'axios'
  export default {
    data () {
      return {
        formObj: {
          username: 'admin',
          password: '123456'
        }
      }
    },
    methods:{
      async getBtn () {
          // 需求: 将异步代码改为同步代码来书写, 可以让代码看起来更简洁
          // 解决方案: 使用 async 和 awite
          // 解决步骤:
              // 1. 使用await 来修改异步代码
                 // var res = await axios.get(url);
                 //  注意点:
                    // 1. await必须用来修改异步方法
                    // 2. 被修改的异步方法在执行完成后, 会向同步方法一样返回它得到的数据
                    // 3. 不用在回调函数中使用这个返回值
              // 2. 如果使用了 await 来修改异步方法, 那么这段代码所在的函数比用使用 async来修饰

              var res = await this.$http.post('login', this.formObj)
              var {data, meta: {msg, status}} = res.data;
              // 保存token值:
              window.localStorage.setItem('token', data.token);
              if(status === 200){
                this.$message({
                  message: msg,
                  type: 'success'
                })
                this.$router.push('/home')
              }else{
                this.$message.error(msg)
              }
        // this.$http.post('login', this.formObj)
        //   .then( res => {
        //      console.log(res);
        //      var {data, meta: {msg, status}} = res.data;
        //      if(status === 200){
        //        this.$message({
        //          message: msg,
        //          type:'success'
        //        })
        //       this.$router.push('/home')
        //     } else{
        //       this.$message.error(msg)
        //     }
        //   })
      }
    }
  }
</script>

<style>
 #form{
   background-color: #324152;
   height: 100%;
   position: relative;
 }
  .el-form{
    position: absolute;
    width: 500px;
    padding: 30px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }
  .btn{
    width: 100%;
  }
  h2{
    text-align:center;
  }
</style>
