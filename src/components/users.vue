<template>
  <div class="users">
    <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />
    <br />
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select search">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button class="btn" plain type="success" @click="searchUser">搜索</el-button>
    <template>
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
          <template v-slot:default="obj">
            <!-- {{obj.row}} -->
            <el-switch
              @change="changeState(obj.row.id,obj.mg_state)"
              v-model="obj.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="obj">
            <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              plain
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="del(obj.row.id)"
            ></el-button>
            <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      :page-sizes="[1,2,3,6]"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  created () {
    this.render()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 3,
      list: [],
      total: 0
    }
  },
  methods: {
    async render () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(data, meta)
      if (meta.status === 200) {
        // console.log(data)
        this.total = data.total
        this.list = data.users
      } else {
        this.$message.error(meta.msg)
      }
    },

    sizeChange (val) {
      // console.log(val)
      this.pagesize = val
      this.render()
    },

    currentChange (val) {
      // console.log(val)
      this.pagenum = val
      this.render()
    },

    searchUser () {
      this.pagenum = 1
      this.render()
    },

    async changeState (id, type) {
      const { meta } = await this.$axios.put(`users/${id}/state/${type}`)
      // console.log(res)

      if (meta.status === 200) {
        this.$message({ message: meta.msg, type: 'success' })
      } else {
        this.$message({ message: meta.msg, type: 'error' })
      }
      // console.log(66)
    },

    async del (id) {
      try {
        await this.$confirm('亲。你确定要删除吗?', 'hi，man!', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        // console.log(res)
        if (meta.status === 200) {
          this.$message(meta.msg)
          if (this.list.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.render()
        } else {
          this.$message(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .bread {
    line-height: 30px;
  }
  .search {
    width: 300px;
    margin-bottom: 10px;
  }
  .btn {
    margin-left: 10px;
  }
}
</style>
