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
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button class="btn" plain type="success" @click="dialogVisible = true">添加用户</el-button>
    <template>
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
          <template v-slot:default="obj">
            <!-- {{obj.row}} -->
            <el-switch
              @change="changeState(obj.row.id,obj.row.mg_state)"
              v-model="obj.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="obj">
            <el-button plain size="small" type="primary" icon="el-icon-edit" @click="showEdit(obj.row)"></el-button>
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
  <!-- 添加 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="clear">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改信息 -->
    <el-dialog title="添加用户" :visible.sync="editVisible" width="30%">
      <el-form ref="editform" :model="editform" :rules="editrules" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editform.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit(editform.id)">确 定</el-button>
      </span>
    </el-dialog>
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
      total: 0,
      dialogVisible: false,
      editVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入3-7个字', trigger: ['change', 'blur'] },
          { min: 3, max: 7, message: '请输入3-7个字', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入4-12个字', trigger: ['change', 'blur'] },
          { min: 4, max: 12, message: '请输入4-12个字', trigger: ['change', 'blur'] }
        ],
        email: { type: 'email', message: '请输入正确的邮箱', trigger: ['change', 'blur'] },
        mobile: { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的邮箱', trigger: ['change', 'blur'] }
      },
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editrules: {
        email: { type: 'email', message: '请输入正确的邮箱', trigger: ['change', 'blur'] },
        mobile: { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的邮箱', trigger: ['change', 'blur'] }
      }
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
      // console.log(data, meta)
      if (meta.status === 200) {
        // console.log(data)
        this.list = data.users
        this.total = data.total
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
      console.log(meta)

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
    },

    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        // console.log(res)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.render()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 清空表单
    clear () {
      this.$refs.form.resetFields()
    },

    showEdit (row) {
      this.editVisible = true
      this.editform.username = row.username
      this.editform.id = row.id
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    async edit (id) {
      try {
        await this.$refs.editform.validate()
        const { email, mobile } = this.editform
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        // console.log(res)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
        } else {
          this.$message.error(meta.msg)
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
