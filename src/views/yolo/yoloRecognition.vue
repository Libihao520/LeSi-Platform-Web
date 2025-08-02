<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Plus, Aim, Promotion } from "@element-plus/icons-vue";
import { getModelService } from "../../api/Aigc";
import { startRecognitionService } from "../../api/yolo"; // 修改API名称
import { getPkqImage, getAnimalImage } from "@/utils/image";
import { getModelClasss } from "@/utils/ModelCls";
import { nextTick } from "vue";
import * as signalR from "@microsoft/signalr"; // 引入SignalR

const loading = ref(false);
const imgUrl = ref("");
const uploadRef = ref();
const modelSelectKey = ref(0);
const sbTest = ref("");
const ModelClass = ref("目标监测");
const ModelClasss = getModelClasss();
const ModelName = ref("");
const ModelNames = [];
const connection = ref(null); // SignalR连接实例
const currentTaskId = ref(""); // 当前任务ID

// 初始化SignalR连接
const initSignalRConnection = () => {
  connection.value = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_APP_API_URL}/recognitionHub`) // 确保与后端Hub URL匹配
    .configureLogging(signalR.LogLevel.Information)
    .build();

  // 定义接收识别结果的方法
  connection.value.on("ReceiveRecognitionResult", (result) => {
    if (result.frontendTaskId === currentTaskId.value) {
      loading.value = false;
      console.log( result)
      if (result) {
        if (ModelClass.value == "目标监测") {
          imgUrl.value = result.sbJg;
        } else {
          sbTest.value = result.sbJg;
        }
        ElMessage.success("识别成功");
      } else {
        ElMessage.error("未识别出目标");
      }
    }
  });

  connection.value
    .start()
    .then(() => {
      console.log("SignalR Connected.");
      return connection.value.invoke("GetConnectionId");
    })
    .then((id) => {
      window.signalrConnectionId = id;
      console.log("SignalR Connection ID stored:", window.signalrConnectionId);
    })
    .catch((err) => console.error("SignalR Connection Error: ", err));
};

// 组件挂载时初始化连接
onMounted(() => {
  initSignalRConnection();
});

// 组件卸载时关闭连接
onUnmounted(() => {
  if (connection.value) {
    connection.value.stop();
  }
});

const onSelectFile = (uploadFile) => {
  const reader = new FileReader();
  reader.readAsDataURL(uploadFile.raw);
  reader.onload = () => {
    imgUrl.value = reader.result;
  };
};

const onUpdateAvatar = async () => {
  if (ModelName.value == "车牌识别") {
    ElMessage.error("未开放！");
    return;
  }

  if (!window.signalrConnectionId) {
    ElMessage.error("SignalR连接未建立，请稍后重试");
    return;
  }

  if (imgUrl.value) {
    loading.value = true;
    try {
      // 生成唯一任务ID
      currentTaskId.value =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);

      // 发送请求开始识别，不等待结果
      const res = await startRecognitionService(
        imgUrl.value,
        ModelName.value,
        currentTaskId.value,
        window.signalrConnectionId
      );

      // 这里不需要处理结果，结果将通过SignalR推送
      console.log("Recognition task started:", currentTaskId.value);
    } catch (error) {
      loading.value = false;
      ElMessage.error("识别请求发送失败");
      console.error(error);
    }
  } else {
    ElMessage.error("请先上传图片");
  }
};

function onExamples() {
  console.log(ModelName);
  if (ModelName.value == "1813709254033409") {
    imgUrl.value = getPkqImage();
  } else if (ModelName.value == "1813709254033410") {
    imgUrl.value = getAnimalImage();
  } else {
    ElMessage.error("未设置示例图片！");
  }
}

function clearImage() {
  imgUrl.value = "";
}

async function handleModelClassChange() {
  ModelNames.value = [];
  const selectcondition = ref({
    pagenum: 1, //当前页
    pagesize: 99, //每页条数
    ModelCls: ModelClass.value,
    modelName: "",
  });
  const res = await getModelService(selectcondition.value);
  ModelName.value = "";
  res.data.data.forEach((item) => {
    ModelNames.value.push({ label: item.modelName, value: item.id });
  });
  await nextTick();
  modelSelectKey.value++;
}
handleModelClassChange();
function handleNameChange() {
  sbTest.value = "";
}
</script>

<template>
  <page-containel title="AI识别">
    <el-form>
      <el-form-item class="select" label="模型类型：">
        <el-select v-model="ModelClass" @change="handleModelClassChange">
          <el-option
            v-for="option in ModelClasss"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="select" label="模型名称：">
        <el-select
          v-model="ModelName"
          @change="handleNameChange"
          :key="modelSelectKey"
        >
          <el-option
            v-for="option in ModelNames.value"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="sbjg"
        v-if="ModelClass != '目标监测'"
        label="识别结果："
      >
        <el-input
          v-model="sbTest"
          class="input"
          placeholder="现在还木有开始识别呢！"
          :suffix-icon="Calendar"
        />
      </el-form-item>
    </el-form>
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <el-icon v-if="!imgUrl" class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <div class="image-container">
      <el-image
        style="width: 300px; height: 300px"
        v-if="imgUrl"
        :src="imgUrl"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="[imgUrl]"
        :initial-index="0"
        fit="cover"
      />
      <span v-if="imgUrl" class="close-btn" @click="clearImage">×</span>
    </div>
    <br />
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button @click="onExamples" type="primary" :icon="Promotion" size="large"
      >示例</el-button
    >
    <el-button
      @click="onUpdateAvatar"
      type="success"
      :icon="Aim"
      size="large"
      v-loading="loading"
      >开始识别</el-button
    >
  </page-containel>
</template>
<style lang="scss" scoped>
.image-container {
  position: relative;
  display: inline-block;

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    line-height: 1;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7); // 鼠标悬停时改变背景色
    }
  }
}
.sbjg {
  .input {
    width: 208px;
  }
}
.select {
  width: 300px;
}
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
