<template>
<el-card>
  <el-breadcrumb separator-class="el-icon-caret-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</el-card>

</template>

<script>
  export default{
    // 导出的是一个对象, 设置一个name属性, 表示创建的组件名
    name: 'mybread',
    /* 面包屑导航的数据不能写死, 应该在不同的二级路由中显示对应的数据
    因此可以使用父组件给子组件传参:  (组件是子组件还是父组件与全局组件还是局部组件无关, 与使用位置有关)
    rights组件是父组件, mybread组件是子组件,  传参步骤:
      <1> 父组件传:
        1. 在父组件中定义好要传给子组件的参数
        2. 在<mybread level1="" level2=""></mybread>中设置自定义属性, 属性值为父组件要传递的参数
      <2> 子组件接 :
        1. 子组件中通过 props来接收:  设置props=['level1','level2']
        2. level1 level2 内部保存的就是父组件要传递的参数
    */
    props: ['level1','level2']
  }
</script>

<style>

</style>
