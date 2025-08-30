<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import * as monaco from "monaco-editor";
import { ElMessage } from "element-plus";
import { executeCodeService } from "@/api/codeExecution";

const code = ref(`// 在这里输入代码
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`);
const language = ref("java");
const output = ref("");
let editor = null;

onMounted(() => {
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
});

// 监听语言切换，动态切换编辑器语言
watch(language, (val) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), val);
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
    const res = await executeCodeService({
      code: code.value,
      language: language.value,
    });
    if(res.data.data.success === false){
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
</script>

<template>
  <page-container title="在线编程">
    <el-row>
      <el-col :span="4">
        <el-select v-model="language" style="width: 120px">
          <el-option label="Java(8.0版本)" value="java" />
          <el-option label="Python(开发中，暂不开放)" value="python" />
        </el-select>
      </el-col>
      <el-col :span="20">
        <el-button type="primary" @click="runCode">运行代码</el-button>
      </el-col>
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