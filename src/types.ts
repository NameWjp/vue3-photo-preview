export type ItemType = {
  // 唯一标识
  key: string;
  // 图片地址
  src: string;
  // 控住图片显示的节点
  originRef?: HTMLElement | null;
  // 图片介绍
  intro?: string | null;
  // 图片下载名称
  downloadName?: string | null;
}

export type OriginRectType = {
  left: number;
  top: number;
  width: number;
  height: number;
} | null;

export type UpdateItemType = (item: ItemType) => void;

export type RemoveItemType = (key: string) => void;

export type HandleShowType = (key: string) => void;

// 动画类型
export enum ShowAnimateEnum {
  None,
  In,
  Out,
}

// 触摸状态
export enum TouchTypeEnum {
  Normal,
  X, // x 轴只能水平切换图片
  Y, // y 轴只能撤销图片
  Scale, // 缩放模式
}

// 边缘状态
export enum EdgeTypeEnum {
  Left,
  Right,
  Top,
  Bottom,
}
