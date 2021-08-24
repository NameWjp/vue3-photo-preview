import { App } from 'vue';
import PhotoProvider from './PhotoProvider.vue';
import PhotoConsumer from './PhotoConsumer.vue';

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
