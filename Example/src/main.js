import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueNiceAutocomplete from 'vue-nice-autocomplete';


const app = createApp(App);
app.use(VueNiceAutocomplete);
app.mount('#app');
