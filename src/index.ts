import { App } from 'vue';
import TText from './TText.vue';

const components = [
  TText
];

const install = (app: App): void  => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};

export { TText };

export default { install };
