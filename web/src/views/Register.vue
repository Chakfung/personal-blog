<template>
  <div>
    <el-container>
      <el-header>
        <el-header>
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple"></div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light">
                这个是开发者注册页面
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <router-link to="/login">
                  <el-button type="primary" round
                    >已经有账户了,去登陆</el-button
                  >
                </router-link>
              </div>
            </el-col>
          </el-row>
        </el-header>
      </el-header>
      <el-main>
        <div class="user_logon_develop_ym">
          <div style="font-size: 35px">需求方用户注册</div>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
          >
            <el-form-item label=" 用 户 名 : " prop="username">
              <el-input
                type="text"
                v-model="ruleForm.username"
                placeholder="请输入用户名:"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label=" 邮 箱 : " prop="useremail">
              <el-input
                type="text"
                v-model="ruleForm.useremail"
                placeholder="请输入邮箱:"
              ></el-input>
            </el-form-item>
            <el-form-item label=" 密 码 : " prop="pass">
              <el-input
                type="password"
                v-model="ruleForm.pass"
                placeholder="请输入密码:"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label=" 确认密码 : " prop="checkPass">
              <el-input
                type="password"
                v-model="ruleForm.checkPass"
                placeholder="请再输入一遍密码:"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label=" 手 机 号 : " prop="userPhone">
              <el-input
                type="text"
                v-model.number="ruleForm.userPhone"
                placeholder="请输入手机号:"
              ></el-input>
            </el-form-item>
            <el-form-item label=" 手机验证码 : ">
              <el-input
                type="text"
                placeholder="请输入验证码:"
                style="width: 230px"
              ></el-input>
              <el-button type="text">发送验证码</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即注册</el-button
              >
              <el-button @click="resetForm('ruleForm')"> 重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <router-link to="/logon">返回选择用户身份</router-link>
        </div>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空!"));
      }
    };
    var userEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };

    return {
      ruleForm: {
        username: "",
        useremail: "",
        pass: "",
        checkPass: "",
        userPhone: "",
      },
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        useremail: [{ validator: userEmail, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        userPhone: [{ validator: checkPhone, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.user_logon_develop_ym {
  width: 500px;
  margin: auto;
}
</style>