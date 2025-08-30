import request from "@/utils/request";


export function executeCodeService(data) {
  return request.post("/CodeExecution/ExecuteJava", data);
}