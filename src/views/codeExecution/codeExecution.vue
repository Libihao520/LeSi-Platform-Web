<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import * as monaco from "monaco-editor";
import { ElMessage } from "element-plus";
import { executeCodeService } from "@/api/codeExecution";


const language = ref("java");
const output = ref("");
let editor = null;

function getDefaultCode(lang) {
  switch(lang) {
    case "java":
      return `// Java 示例代码
// 包含基本语法、变量、循环和函数
public class Main {
    public static void main(String[] args) {
        // 打印输出
        System.out.println("Hello, World!");
        
        // 变量定义与使用
        int number = 42;
        String text = "Java 编程";
        boolean flag = true;
        
        System.out.println("数字: " + number);
        System.out.println("文本: " + text);
        
        // 循环示例
        System.out.println("计数:");
        for (int i = 1; i <= 5; i++) {
            System.out.print(i + " ");
        }
        System.out.println();
        
        // 条件判断
        if (flag) {
            System.out.println("条件为真");
        } else {
            System.out.println("条件为假");
        }
        
        // 函数调用
        int result = addNumbers(10, 20);
        System.out.println("10 + 20 = " + result);
    }
    
    // 自定义函数
    private static int addNumbers(int a, int b) {
        return a + b;
    }
}`;
    case "python":
      return `# Python 示例代码
# 包含基本语法、变量、循环和函数

# 打印输出
print("Hello, World!")

# 变量定义与使用
number = 42
text = "Python 编程"
flag = True

print(f"数字: {number}")
print(f"文本: {text}")

# 循环示例
print("计数:")
for i in range(1, 6):
    print(i, end=" ")
print()

# 条件判断
if flag:
    print("条件为真")
else:
    print("条件为假")

# 列表操作
fruits = ["苹果", "香蕉", "橙子"]
print("水果列表:")
for fruit in fruits:
    print(f"- {fruit}")

# 自定义函数
def add_numbers(a, b):
    return a + b

result = add_numbers(10, 20)
print(f"10 + 20 = {result}")`;
    case "cpp":
      return `// C++ 示例代码
// 包含基本语法、变量、循环和函数
#include <iostream>
#include <vector>
#include <string>

using namespace std;

// 自定义函数
int addNumbers(int a, int b) {
    return a + b;
}

int main() {
    // 打印输出
    cout << "Hello, World!" << endl;
    
    // 变量定义与使用
    int number = 42;
    string text = "C++ 编程";
    bool flag = true;
    
    cout << "数字: " << number << endl;
    cout << "文本: " << text << endl;
    
    // 循环示例
    cout << "计数: ";
    for (int i = 1; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl;
    
    // 条件判断
    if (flag) {
        cout << "条件为真" << endl;
    } else {
        cout << "条件为假" << endl;
    }
    
    // 容器使用
    vector<string> fruits = {"苹果", "香蕉", "橙子"};
    cout << "水果列表:" << endl;
    for (const auto& fruit : fruits) {
        cout << "- " << fruit << endl;
    }
    
    // 函数调用
    int result = addNumbers(10, 20);
    cout << "10 + 20 = " << result << endl;
    
    return 0;
}`;
    default:
      return "// 请选择一种编程语言";
  }
}
const code = ref(getDefaultCode(language.value));
// 监听语言切换，动态切换编辑器语言和示例代码
watch(language, (newVal, oldVal) => {
  if (editor) {
    // 切换编辑器语言
    monaco.editor.setModelLanguage(editor.getModel(), newVal);
    // 更新示例代码
    code.value = getDefaultCode(newVal);
    editor.setValue(code.value);
  }
});

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
</script>

<template>
  <page-container title="在线编程">
    <el-row>
      <el-col :span="4">
        <el-select v-model="language" style="width: 120px">
          <el-option label="Java(8.0版本)" value="java" />
          <el-option label="Python(3.7版本)" value="python" />
          <el-option label="c++(13版本)" value="cpp" />
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