import { ref, Ref } from 'vue';
import { handleShowType, itemType } from '../types';

type useVisibleReturn = {
  visible: Ref<boolean>,
  handleHide: () => void,
  handleShow: handleShowType
}

export default function useVisible(items: Ref<itemType[]>, index: Ref<number>): useVisibleReturn {
  const visible = ref(false);

  const handleHide = () => {
    visible.value = false;
  };

  const handleShow = (key: string) => {
    const itemIndex = items.value.findIndex(item => item.key === key);
    if (itemIndex > -1) {
      index.value = itemIndex;
      visible.value = true;
    }
  };

  return {
    visible,
    handleHide,
    handleShow
  };
}
