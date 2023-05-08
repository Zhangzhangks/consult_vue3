import { request } from "@utils/request";
import type {
  CodeType,
  Icode,
  Patient,
  PatientList,
  User,
  UserInfo,
} from "@/type/user";
// 密码登录
export const loginByPassword = ({ mobile, password }) => {
  return request<User>("/login/password", "POST", { mobile, password });
};

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request<Icode>("/code", "GET", { mobile, type });
};

// 短信登录
export const loginByMobile = (mobile: string, code: string) => {
  return request<User>("/login", "POST", { mobile, code });
};

// 获取个人信息
export const getUserInfo = () => request<UserInfo>("/patient/myUser");

// 获患者信息列表
export const getPatientList = () => request<PatientList>("/patient/mylist");
// 添加患者信息
export const addPatient = (patient: Patient) => {
  request("/patient/add", "POST", patient);
};
<<<<<<< Updated upstream
=======

// 编辑患者信息
export const editPatient = (patient: Patient) =>
  request("/patient/update", "PUT", patient);
  
// 查询患者详情
export const getPatientDetail = (id: string) =>
  request<Patient>(`/patient/info/${id}`);
>>>>>>> Stashed changes
