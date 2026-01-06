// 接口返回数据结构信息
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}
