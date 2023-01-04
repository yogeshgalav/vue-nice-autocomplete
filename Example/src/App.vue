<template>
<VueNiceAutocomplete 
    @change="setCountry" 
    source="https://restcountries.com/v2/name/" 
    response-property="name" 
    v-model:change="data.country"
/>
</template>


<script setup>
import VueNiceAutocomplete from 'vue-nice-autocomplete';
import {reactive } from 'vue';

let data = reactive({
    country: null
});
function setCountry(c){
    console.log(c);
}
</script>
