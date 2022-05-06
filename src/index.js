import VueNiceAutocomplete from "./VueNiceAutocomplete.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.use(VueNiceAutocomplete);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

VueNiceAutocomplete.install = install;

export default VueNiceAutocomplete;