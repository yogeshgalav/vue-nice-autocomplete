<template>
  <div class="card">
    <h3 class="heading">VueNiceAutocomplete</h3>
    <VueNiceAutocomplete name="githubRepos" source="https://api.github.com/users/yogeshGalav/repos?search=" label="name">
    </VueNiceAutocomplete>
  </div>
</template>
<script setup>
import VueNiceAutocomplete from 'vue-nice-autocomplete';
import 'vue-nice-autocomplete/src/index.css';
</script>

<style>
.card{
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.heading{
  text-align: center;
}
</style>
