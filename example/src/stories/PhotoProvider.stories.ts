import { PhotoProvider, PhotoConsumer } from 'vue3-photo-preview';
import pic1 from './images/1.jpg';

export default {
  title: 'PhotoProvider',
  component: PhotoProvider,
}

const Template: Function = (args: Object) => ({
  components: { PhotoProvider, PhotoConsumer },
  setup() {
    return { args };
  },
  template: `
    <photo-provider v-bind="args">
      <PhotoConsumer src="${pic1}">
        <button>点击打开</button>
      </PhotoConsumer>
    </photo-provider>
  `,
});

export const 默认行为 = Template.bind({});
默认行为.args = {
  photoClosable: false,
  maskClosable: true
};
