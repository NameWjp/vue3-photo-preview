export type itemType = {
  // 唯一标识
  key: string,
  // 图片地址
  src: string,
  // 控住图片显示的节点
  originRef?: HTMLElement | null,
  // 图片介绍
  intro?: string
}

export type updateItemType = (item: itemType) => void;

export type removeItemType = (key: string) => void;

export type handleShowType = (key: string) => void;
