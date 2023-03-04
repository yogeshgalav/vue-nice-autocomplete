import { createApp } from 'vue'
import App from './App.vue'
import TailwindApp from './Tailwind/App.vue'
// import { Autocomplete } from 'vue-nice-autocomplete';

const app = createApp(TailwindApp);
// app.use(Autocomplete);
app.mount('#app');
