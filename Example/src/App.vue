<template>
  <div>
    <h3>VueNiceAutocomplete</h3>
   <VueNiceAutocomplete
   name="githubRepos"
   source="https://api.github.com/users/yogeshGalav/repos?search="
   label="name"
   ></VueNiceAutocomplete>
  </div>
</template>
<script setup>
import VueNiceAutocomplete from 'vue-nice-autocomplete';
import 'vue-nice-autocomplete/src/index.css';
</script>
  
