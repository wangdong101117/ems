<template>
  <div class="home">
      <el-container>
        <el-header>
          <Top />
        </el-header>
        <el-container>
          <el-aside width="200px">
            <Left />
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
  </div>
</template>
<script>
  import Top from '@/components/common/top.vue'
  import Left from '@/components/common/left.vue'
  export default {
     data () {
       return {
         // msg: 'message'
       }
     },
     components: {
       Top,
       Left
     },
    // 完成登录验证操作: 在 home.vue 中的 beforeCreate钩子函数中进行验证
    beforeCreate(){
       var token = window.localStorage.getItem('token');
       // console.log(token);
       if(!token){
         this.$router.push('/login')
       }
    }
  }
</script>

<style>
  .home, .el-container{
    height: 100%;
  }
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    height: 100%;
    /*text-align: center;*/
    line-height: 160px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 100%;
    /*text-align: center;*/
    /*line-height: 160px;*/
    padding: 0 20px;
  }
  body > .el-container {
    /*margin-bottom: 40px;*/
  }
</style>
