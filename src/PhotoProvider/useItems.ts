import { ref, Ref } from 'vue';
import { ItemType, UpdateItemType, RemoveItemType } from '../types';

type useItemsReturn = {
  items: Ref<ItemType[]>;
  updateItem: UpdateItemType;
  removeItem: RemoveItemType;
}

export default function useItems(index: Ref<number>): useItemsReturn {
  const items = ref<ItemType[]>([]);

  const getElementIndex = (children: HTMLCollection, child: HTMLElement | null | undefined) => {
    return child ? Array.prototype.indexOf.call(children, child) : -1;
  };

  const sortItems = (items: ItemType[]) => {
    const children = items[0].originRef?.parentNode?.children;
    if (children && children.length) {
      items.sort((cur, next) => getElementIndex(children, cur.originRef) - getElementIndex(children, next.originRef));
    }
  };

  const updateItem = (item: ItemType) => {
    const index = items.value.findIndex(({ key }) => item.key === key);
    if (index > -1) {
      items.value.splice(index, 1, item);
    } else {
      items.value.push(item);
      sortItems(items.value);
    }
  };

  const removeItem = (key: string) => {
    const nextItems = items.value.filter((item) => item.key !== key);
    const nextEndIndex = nextItems.length - 1;

    items.value = nextItems;
    index.value = Math.max(Math.min(index.value, nextEndIndex), 0);
  };

  return {
    items,
    updateItem,
    removeItem,
  };
}
