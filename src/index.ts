import { App } from 'vue';
import PhotoProvider from './PhotoProvider/index.vue';
import PhotoConsumer from './PhotoConsumer/index.vue';
import PhotoSlider from './PhotoSlider/index.vue';

const components = [
  PhotoProvider,
  PhotoConsumer,
  PhotoSlider
];

const install = (app: App): void  => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};

export * from './types';

export { PhotoProvider, PhotoConsumer, PhotoSlider };

export default { install };
