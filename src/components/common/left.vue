<template>
  <!-- NavMenu导航菜单:
      <el-menu>: 导航菜单的容器
      <el-submenu>: 每一个导航元素
      unique-opened: 只展开一个子元素
      :router :  当值为true时, 会进入vue-router 形式, 会将 el-menu-item解析为 router-link, 将index解析为to属性
  -->
  <el-menu :router="true" :unique-opened="true" class="el-menu-vertical-demo">
    <el-submenu index="1">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span>用户管理</span>
    </template>
    <el-menu-item-group>
      <!-- 设置用户列表的路由: users -->
      <el-menu-item index="/users"><i class="el-icon-menu"></i>用户列表</el-menu-item>
    </el-menu-item-group>
  </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>权限管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/roles"><i class="el-icon-menu"></i>角色列表</el-menu-item>
        <el-menu-item index="/rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>商品管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="3-1"><i class="el-icon-menu"></i>商品列表</el-menu-item>
        <el-menu-item index="3-2"><i class="el-icon-menu"></i>分类参数</el-menu-item>
        <el-menu-item index="3-2"><i class="el-icon-menu"></i>商品分类</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>订单管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="4-1"><i class="el-icon-menu"></i>订单列表</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>数据统计</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="5-1"><i class="el-icon-menu"></i>数据报表</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {

  }
</script>

<style>
  .el-menu-vertical-demo {
    height: 100%;
  }
</style>
