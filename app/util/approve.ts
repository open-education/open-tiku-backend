export enum Status {
  Draft = 0,     // 0: 草稿
  Pending = 1,   // 1: 待审核
  Published = 2, // 2: 已发布
  Rejected = 3,  // 3: 被拒绝
}

export interface Label {
  text: string,
  color: string,
}

// 定义字典用于显示名
const StatusMap: Record<Status, Label> = {
  [Status.Draft]: {
    text: "草稿",
    color: "cyan",
  },
  [Status.Pending]: {
    text: "待审核",
    color: "geekblue"
  },
  [Status.Published]: {
    text: "已发布",
    color: "green"
  },
  [Status.Rejected]: {
    text: "被拒绝",
    color: "red"
  },
};

// 根据状态获取审核文本
export function getStatusLabel(status: number): Label {
  if (status == Status.Pending) {
    return StatusMap[Status.Pending];
  }
  if (status == Status.Published) {
    return StatusMap[Status.Published];
  }
  if (status == Status.Rejected) {
    return StatusMap[Status.Rejected];
  }
  return StatusMap[Status.Draft];
}
