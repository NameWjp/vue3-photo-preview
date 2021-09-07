import { ref, Ref } from 'vue';

type useIndexReturn = {
  index: Ref<number>;
  updateIndex: (newIndex: number) => void;
}

export default function useIndex(): useIndexReturn {
  const index = ref(0);

  const updateIndex = (newIndex: number) => {
    index.value = newIndex;
  };

  return {
    index,
    updateIndex,
  };
}
