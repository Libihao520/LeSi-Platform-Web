<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import * as monaco from "monaco-editor";
import { ElMessage } from "element-plus";
import { SubmitCodeService, GetAllExercisesService } from "@/api/codeExecution";

const language = ref("python");
const output = ref("");
const questions = ref([]); // 存储题目列表
const selectedQuestion = ref(""); // 当前选中的题目
let editor = null;

// 获取默认代码，包含选中的题目描述
function getDefaultCode(lang) {
  // 找到当前选中的题目
  const question = questions.value.find(
    (q) => q.id === selectedQuestion.value
  ) || { title: "请选择题目", description: "" };

  // 题目描述作为注释放在代码开头
  const questionComment = `# 题目: ${question.title}
# 描述: ${question.description}
# 请在下面编写代码解决该问题
`;

  // 不同语言的基础代码
  const baseCodes = {
    python: questionComment + "\n",
  };

  return baseCodes[lang] || questionComment;
}

const code = ref(getDefaultCode(language.value));

// 监听语言切换
watch(language, (newVal) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), newVal);
    code.value = getDefaultCode(newVal);
    editor.setValue(code.value);
  }
});

// 监听题目切换
watch(selectedQuestion, () => {
  if (editor) {
    code.value = getDefaultCode(language.value);
    editor.setValue(code.value);
  }
});

onMounted(async () => {
  // 创建编辑器
  editor = monaco.editor.create(document.getElementById("editor-container"), {
    value: code.value,
    language: language.value,
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 16,
    minimap: { enabled: false },
  });

  editor.onDidChangeModelContent(() => {
    code.value = editor.getValue();
  });
  // 获取题目列表
  try {
    const res = await GetAllExercisesService();
    questions.value = res.data.data || [];
    // 默认选中第一个题目
    if (questions.value.length > 0) {
      selectedQuestion.value = questions.value[0].id;
    }
  } catch (e) {
    ElMessage.error("获取题目失败：" + (e.message || e));
  }
});

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }
});

const runCode = async () => {
  output.value = "正在运行...";
  try {
    const res = await SubmitCodeService({
      questionId: selectedQuestion.value,
      code: code.value,
      IsPractice: false,
    });
    if (res.data.data.success === false) {
      output.value = "运行出错：" + (res.data.data.error || "未知错误");
      ElMessage.error("代码执行失败");
      return;
    }
    output.value = res.data.data.output || "无输出";
  } catch (e) {
    output.value = "运行出错：" + (e.message || e);
    ElMessage.error("代码执行失败");
  }
};

const subMenuPropsCode = async () => {
  output.value = "已提交，感谢您的参与！";
    output.value = "正在提交...";
  try {
    const res = await SubmitCodeService({
      questionId: selectedQuestion.value,
      code: code.value,
      IsPractice: true,
    });

    // 2. 修复接口响应判断逻辑（原逻辑颠倒）
    if (res.data.code === 0) {
      // 提交成功：弹窗提示 + 输出成功信息
      await ElMessageBox.alert("提交成功！感谢您的参与～", "提交结果", {
        confirmButtonText: "确定",
        type: "success", // 成功样式弹窗
        center: true,
      });
      output.value = "提交成功！服务器已接收您的代码";
      ElMessage.success("代码提交成功");
    } else {
      // 提交失败：显示错误信息
        ElMessage.success("代码提交失败");
      output.value = "提交出错：" + (res.data?.message || "未知错误");
    
    }
  } catch (e) {
    output.value = "提交出错：" + (e.message || e);
    ElMessage.error("代码提交失败");
  }
};
</script>

<template>
  <page-container title="在线编程">
    <el-row>
      <el-col :span="8">
        <el-select v-model="language" style="width: 140px; margin-right: 10px">
          <el-option label="Python(3.7版本)" value="python" />
        </el-select>

        <!-- 题目选择下拉框 -->
        <el-select v-model="selectedQuestion" style="width: 300px">
          <el-option
            v-for="question in questions"
            :key="question.id"
            :label="question.title"
            :value="question.id"
          />
        </el-select>
      </el-col>
      <el-col :span="16">
        <el-button type="primary" @click="runCode">测试</el-button>
        <el-button type="primary" @click="subMenuPropsCode">提交</el-button>
      </el-col>
            <el-alert
        title="温馨提示：每人每题只有一次提交机会，请测试无误后再提交哦～"
        type="warning"
      />
    </el-row>
    <div
      id="editor-container"
      style="height: 400px; border: 1px solid #eee; margin-top: 16px"
    ></div>
    <el-card style="margin-top: 16px">
      <template #header>输出结果</template>
      <pre style="min-height: 80px">{{ output }}</pre>
    </el-card>
  </page-container>
</template>

<style lang="scss" scoped>
#editor-container {
  width: 100%;
}
</style>
