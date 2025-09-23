import request from "@/utils/request";


export function executeCodeService(data) {
  return request.post("/CodeExecution/ExecuteJava", data);
}


export function GetAllExercisesService(data) {
  return request.get("/CodeExercises/GetAllExercises", data);
}


export function SubmitCodeService(data) {
  return request.post("/CodeExercises/SubmitCode", data);
}
