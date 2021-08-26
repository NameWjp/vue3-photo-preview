import { App } from 'vue';
import PhotoProvider from './PhotoProvider/index.vue';
import PhotoConsumer from './PhotoConsumer/index.vue';

const components = [
  PhotoProvider,
  PhotoConsumer
];

const install = (app: App): void  => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};

export { PhotoProvider, PhotoConsumer };

export default { install };
