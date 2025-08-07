<script setup>
import {
  userRegisterService,
  userLoginService,
  SendVerificationCode,
} from "@/api/user.js";
import { User, Lock, Message, EditPen } from "@element-plus/icons-vue";
import { ref, watch, onMounted } from "vue";
import { useUserStore } from "@/stores";
import { useRouter } from "vue-router";
import {
  encrypt,
  rsaEncrypt,
  getPublicKey,
  clearPublicKey,
} from "@/utils/util";

const isRegister = ref(false);
const form = ref();

// 在组件挂载时获取公钥
onMounted(async () => {
  try {
    await getPublicKey();
    console.log("公钥已获取并存储");
  } catch (error) {
    console.error("初始化获取公钥失败:", error);
    ElMessage.error("初始化失败，请刷新页面重试");
  }
});

//登录提交
const userStore = useUserStore();
const router = useRouter();

const login = async () => {
  try {
    await form.value.validate();
    // 登录前确保有公钥
    let publicKey;
    try {
      publicKey = await getPublicKey();
    } catch (error) {
      ElMessage.error("获取加密密钥失败，请重试");
      return;
    }
    console.log(await rsaEncrypt(formModel.value.username));
    const res = await userLoginService({
      username: await rsaEncrypt(formModel.value.username),
      password: await rsaEncrypt(formModel.value.password),
      publicKey: publicKey,
    });
    console.log(res);
    userStore.setToken(res.data.data);
    ElMessage.success("登录成功");
    // 登录成功后清除公钥
    clearPublicKey();
    router.push("/");
  } catch (error) {
    console.error("登录失败:", error);
    // 登录失败也清除公钥，并获取新的
    clearPublicKey();
    await getPublicKey();
    ElMessage.error(error.response?.data?.message || "登录失败");
  }
};
const forgetThePassword = async () => {
  await ElMessageBox.confirm("我也不知道你密码，再好好想想吧！", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  });
};
//TODO发送验证码
const sendAuthCode = async () => {
  if (formModel.value.email === null) {
    ElMessage.warning("请先输入邮箱！");
    return;
  }
  const res = await SendVerificationCode(encrypt(formModel.value.email));

  console.log(res.data.code);
  ElMessage.success(res.data.data);
};
//注册提交
const register = async () => {
  //注册成功之前，先进行校验
  await form.value.validate();
  console.log("开始注册");
  await userRegisterService({
    username: formModel.value.username,
    password: encrypt(formModel.value.password),
    repassword: encrypt(formModel.value.repassword),
    email: encrypt(formModel.value.email),
    authcode: formModel.value.authcode,
  });
  ElMessage.success("注册成功");
  isRegister.value = false;
};
//用于提交的from数据对象
const formModel = ref({
  authcode: "",
  email: "",
  username: "",
  password: "",
  repassword: "",
});
//表单校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "用户名必须是3-10位的字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^\S{6,15}$/,
      message: "密码必须是6-15位的非空字符",
      trigger: "blur",
    },
  ],
  repassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      pattern: /^\S{6,15}$/,
      message: "密码必须是6-15的非空字符",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  authcode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
//切换的时候，重置表单内容
watch(isRegister, () => {
  formModel.value = {
    authcode: "",
    email: "",
    username: "",
    password: "",
    repassword: "",
  };
});
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <h1 style="color: rgb(81, 146, 220)">乐思赋能平台</h1>
      <h3 style="color: rgb(169, 169, 169); margin-left: 20%">————乐思&宇梦</h3>
      <!-- 注册表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <div class="input-with-button">
            <el-input
              v-model="formModel.email"
              :prefix-icon="Message"
              placeholder="请输入您的邮箱地址"
            ></el-input>
            <el-button @click="sendAuthCode" type="success"
              >发送验证码</el-button
            >
          </div>
        </el-form-item>

        <el-form-item prop="authcode">
          <el-input
            v-model="formModel.authcode"
            :prefix-icon="EditPen"
            type="password"
            placeholder="请输入邮箱收到的验证码！"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link
              @click="forgetThePassword"
              type="primary"
              :underline="false"
              >忘记密码？</el-link
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.input-with-button {
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中对齐 */
  width: 100%;
}
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url("@/assets/login.png") no-repeat 50% center / 900px auto,
      url("@/assets/login-bg.svg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
