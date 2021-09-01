import { ref, Ref } from 'vue';
import { ItemType, UpdateItemType, RemoveItemType } from '../types';

type useItemsReturn = {
  items: Ref<ItemType[]>;
  updateItem: UpdateItemType;
  removeItem: RemoveItemType;
}

export default function useItems(index: Ref<number>): useItemsReturn {
  const items = ref<ItemType[]>([]);

  const updateItem = (item: ItemType) => {
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
