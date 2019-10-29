<template>
  <div class="rights">
    <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />
    <template>
      <el-table  :data="list" class="table">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="层级">
          <template v-slot:default="{row}">
            <span v-if="row.level === '0'">一级</span>
            <span v-if="row.level === '1'">二级</span>
            <span v-if="row.level === '2'">三级</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
export default {
  created () {
    this.render()
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    async render () {
      const { data, meta } = await this.$axios.get('rights/list')
      // console.log(res)
      if (meta.status === 200) {
        this.list = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bread {
  line-height: 30px;
}
.table {
  margin-top: 10px;
}
</style>
