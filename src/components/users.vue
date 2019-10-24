<template>
  <div class="users">
    <template>
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column  label="用户状态">
          <template v-slot:default="obj">
            <!-- {{obj.row}} -->
            <el-switch
              v-model="obj.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="small" type="danger" icon="el-icon-delete"></el-button>
          <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
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
      >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  created () {
    this.render()
  },
  data () {
    return {
      pagenum: 1,
      pagesize: 3,
      list: [],
      total: 10
    }
  },
  methods: {

    render () {
      axios.get('http://localhost:8888/api/private/v1/users', { params: {
        query: '',
        pagenum: this.pagenum,
        pagesize: this.pagesize
      },
      headers: { Authorization: localStorage.getItem('token') } }).then(res => {
        // console.log(res)
        const { data, meta } = res.data
        if (res.status === 200) {
          console.log(data)
          this.total = data.total
          this.list = data.users
        } else {
          this.$message.error(meta.msg)
        }
      }
      )
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
    }

  }
}
</script>

<style>
</style>
