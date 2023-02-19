
import VueNiceAutocomplete from "./VueNiceAutocomplete.vue";

export const Autocomplete = {
  install: (app, options) => {
    app.component("autocomplete", VueNiceAutocomplete);
  }
};

export default VueNiceAutocomplete;
