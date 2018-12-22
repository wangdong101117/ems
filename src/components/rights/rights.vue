<template>
  <!-- 注意: 需要在template中先设置一个根元素 div, 否则表格组件等一些组件直接放在template标签中会报错  -->
  <div>
    <!-- 面包屑导航:  使用封装的全局自定义面包屑组件: mybread -->
      <mybread level1="权限管理" level2="权限列表"></mybread>

    <!--  表格区域: 使用表格组件
     :data="tableData"   - 表格绑定的数据源
     highlight-current-row   - 鼠标悬停时高亮显示
     label  - 就是表格的文本内容
     property   - 依赖的数据源中的哪个数据
     -->

    <el-table border :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限名称"></el-table-column>
      <el-table-column property="path" label="路径"></el-table-column>
      <el-table-column property="level" label="层级">
        <!-- 因为从从服务端得到的层级数据中 是 字符串的 0 1 2
           并不是我们想要的 一级 二级 三级 这样的层级标识
           可以在里面嵌套三个span标签, 使用v-if 当 level 为 '0' 时  文本内容为一级的span显示,
           为'1'时, 文本内容为二级的span显示, 为'2'时, 文本内容为三级的span标签显示
       注意: 应该使用一个template标签包裹span标签, template标签中设置 slot-scope="scope"的属性
             scope为表格的数据源, scope.row为当前行的数据源,
             scope.row.level就是当前行的权限的层级, 所以在v-if中使用 scope.row.level进行判断
         -->
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
      data(){
        return{
          tableData: [

          ]
        }
      },
      methods:{
        async getAllRights () {
          var res = await this.$http.get('rights/list')
          var {data, meta:{msg, status}} = res.data
          if(status === 200){
            this.tableData = data
            // console.log(this.tableData);
          }
        }
      },
      created(){
        this.getAllRights()
      }
    }
</script>

<style>

</style>
