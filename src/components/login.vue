<template>
  <div class="login">
    <el-form status-icon ref="form"  :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"  @keyup.enter.native="sure" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn" @click="sure">确定</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    <img src="../assets/1.jpg" alt="">
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入3~7个字', trigger: ['change', 'blur'] },
          { min: 3, max: 7, message: '请输入3~7个字', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入4~12位', reigger: ['change', 'blur'] },
          { min: 4, max: 12, message: '请输入4~12个字', trigger: ['change', 'blur'] }

        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async sure () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({ message: meta.msg, type: 'success', duration: 1500 })
          this.$router.push('/index')
        } else {
          this.$message({ message: meta.msg, type: 'error' })
        }
      } catch (e) {
        console.log(e)
      }

      // this.$refs.form.validate(isValidate => {
      //   if (!isValidate) return
      //   axios.post('http://localhost:8888/api/private/v1/login', this.form).then(res => {
      //     const { meta, data } = res.data
      //     if (meta.status === 200) {
      //       localStorage.setItem('token', data.token)
      //       this.$message({ message: meta.msg, type: 'success', duration: 1500 })
      //       this.$router.push('/index')
      //     } else {
      //       this.$message({ message: meta.msg, type: 'error' })
      //     }
      //   })
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background-color: #2d434c;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-form {
    background-color: #fff;
    width: 400px;
    margin: 0 auto;
    margin-top: 200px;
    border-radius: 20px;
    padding: 20px;
    padding-top: 75px;
    position: relative;
    .btn{
      margin-right:70px
    }
    img{
      width: 130px;
      height: 130px;
      position: absolute;
      left:50%;
      top:0;
      transform: translate(-50%,-50%);
      border-radius: 50%;
      border:5px solid #fff
    }
  }
}
</style>
