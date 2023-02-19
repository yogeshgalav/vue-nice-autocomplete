<p align="center">
  <img width="250" src="http://vue-technologies.com/wp-content/uploads/2022/04/cropped-vue-logo-png.png">
  <br>
  <a href="https://npm.im/vue-nice-validate">
    <img src="https://badgen.net/npm/v/vue-nice-validate">
  </a>
  <a href="https://npm.im/vue-nice-validate">
    <img src="https://badgen.net/npm/dw/vue-nice-validate?color=blue">
  </a>
  <a href="https://bundlephobia.com/result?p=vue-nice-validate">
    <img src="https://badgen.net/bundlephobia/minzip/vue-nice-validate">
  </a>
</p>

# Vue Nice Autocomplete

## Image
<img src="Auto.png" width="50%"/>

## Project setup
```
npm install vue-nice-autocomplete
```

## Usage
### Basic Usage
Import the component locally
```
<template>
  <div>
    <h3>VueNiceAutocomplete</h3>
   <VueNiceAutocomplete
   name="githubRepos"
   source="https://api.github.com/users/yogeshGalav/repos"
   label="name"
   ></VueNiceAutocomplete>
  </div>
</template>
<script setup>
import VueNiceAutocomplete from 'vue-nice-autocomplete';
import 'vue-nice-autocomplete/src/index.css';
</script>
```

Note:-
If you use tailwind css no need to import 'vue-nice-autocomplete/src/index.css';
