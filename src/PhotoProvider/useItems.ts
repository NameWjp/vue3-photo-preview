import { ref, Ref } from 'vue';
import { itemType, updateItemType, removeItemType } from '../types';

type useItemsReturn = {
  items: Ref<itemType[]>,
  updateItem: updateItemType,
  removeItem: removeItemType
}

export default function useItems(index: Ref<number>): useItemsReturn {
  const items = ref<itemType[]>([]);

  const updateItem = (item: itemType) => {
    const index = items.value.findIndex(({ key }) => item.key === key);
    if (index > -1) {
      items.value.splice(index, 1, item);
    } else {
      items.value.push(item);
    }
  };

  const removeItem = (key: string) => {
    const nextItems = items.value.filter((item) => item.key !== key);
    const nextEndIndex = nextItems.length - 1;

    items.value = nextItems;
    index.value = Math.min(index.value, nextEndIndex);
  };

  return {
    items,
    updateItem,
    removeItem,
  };
}
