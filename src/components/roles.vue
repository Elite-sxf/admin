<template>
  <div class="roles">
    <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <hr>
    <el-button plain type="success" class="add" @click="addVisible = true"> 添加角色</el-button>
    <template>
      <el-table :data="list">
        <el-table-column type="expand">
          <template v-slot:default="{ row }">
          <p v-show="row.children.length === 0">暂无权限</p>
            <el-row class="row" v-for="l1 in row.children" :key="l1.id">
              <el-col :span="4">
                <el-tag closable @close="del(row,l1.id)">{{ l1.authName }}</el-tag>
                <i class="el-icon-smoking"></i>
              </el-col>
              <el-col :span="20">
                <el-row class="two" v-for="l2 in l1.children" :key="l2.id">
                  <el-col :span="4">
                    <el-tag type="success" closable @close="del(row,l2.id)">{{ l2.authName }}</el-tag>
                    <i class="el-icon-smoking"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag class="three" type="warning" closable v-for="l3 in l2.children" :key="l3.id" @close="del(row,l3.id)">{{ l3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="obj">
            <el-button plain size="small" type="primary" icon="el-icon-edit" @click="showEdit(obj.row)"></el-button>
            <el-button plain size="small" type="danger" icon="el-icon-delete" @click="delCharacter(obj.row.id)"></el-button>
            <el-button plain size="small" type="success" icon="el-icon-check" @click="showAllot(obj.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 添加角色弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addVisible"
      width="40%"
      @close="clear"
      >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCharacter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editVisible"
      width="40%"
      >
        <el-form ref="editform" :model="editform" :rules="editrules" label-width="80px" >
          <el-form-item label="角色名称" prop="roleName">
            <el-input placeholder="请输入角色名" v-model="editform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input placeholder="请输入角色描述" v-model="editform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCharacter(editform.id)">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="allotVisible" width="40%" default-expand-all show-checkbox>
      <el-tree ref="tree"  node-key="id" :data="data" :props="defaultProps"  default-expand-all show-checkbox></el-tree>

      <span slot="footer" class="dialog-footer">
          <el-button @click="allotVisible = false">取 消</el-button>
          <el-button type="primary" @click="allot">确 定</el-button>
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
      list: [],
      addVisible: false,
      editVisible: false,
      allotVisible: false,
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: { required: true, message: '请输入角色名称', trigger: ['change', 'bllur'] },
        roleDesc: { required: true, message: '请输入角色描述', trigger: ['change', 'bllur'] }
      },
      editform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      editrules: {
        roleName: { required: true, message: '请输入角色名称', trigger: ['change', 'bllur'] },
        roleDesc: { required: true, message: '请输入角色描述', trigger: ['change', 'bllur'] }
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  methods: {
    async render () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.list = data
      }
    },
    async del (row, id) {
      console.log(1)

      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${id}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加角色
    async addCharacter () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('roles', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.render()
          this.addVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    clear () {
      this.$refs.form.resetFields()
    },
    showEdit (row) {
      this.editVisible = true
      this.editform.id = row.id
      this.editform.roleName = row.roleName
      this.editform.roleDesc = row.roleDesc
    },
    async editCharacter (id) {
      try {
        this.$refs.editform.validate()
        const { meta } = await this.$axios.put(`roles/${id}`, this.editform)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.render()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async delCharacter (id) {
      try {
        await this.$confirm('是否要确认删除', '提示', { type: 'warning' })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.render()
        } else {
          this.$message.erroe(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAllot (row) {
      this.roleId = row.id
      this.allotVisible = true
      const { data, meta } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async allot () {
      const ids = this.$refs.tree.getCheckedKeys()
      const half = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...half].join(',')
      // console.log(rids)
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.allotVisible = false
        this.render()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bread {
  line-height: 30px;
}
.add{
  margin:14px 0;
}
.row{
  padding:10px 0;
  border-bottom:1px dotted #ccc
}
.two{
  margin-bottom:6px
}
.three{
  margin-right: 6px;
  margin-bottom:8px
}
</style>
