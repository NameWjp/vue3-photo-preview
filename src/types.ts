export type ItemType = {
  // 唯一标识
  key: string,
  // 图片地址
  src: string,
  // 控住图片显示的节点
  originRef?: HTMLElement | null,
  // 图片介绍
  intro?: string | null
}

export type UpdateItemType = (item: ItemType) => void;

export type RemoveItemType = (key: string) => void;

export type HandleShowType = (key: string) => void;

// 动画类型
export enum ShowAnimateEnum {
  None,
  In,
  Out,
}
