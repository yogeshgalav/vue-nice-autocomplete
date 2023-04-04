<template>
	<div class="autocomplete my-2">
	  <input
		v-model="data.search" type="text" class="text-base font-medium block w-full rounded-md border transition ease-in-out focus:ring-1 border-gray-300 border-solid p-2.5 text-gray-700 placeholder-gray-400 focus:border-blue-200 focus:ring-blue-500 focus:outline-none outline-none"
		:name="props.name" @input="onChange" @keydown.down="onArrowDown"
		@keydown.up="onArrowUp" @keydown.enter="onEnter"
	  >
	  <ul v-show="data.isOpen" class="autocomplete-results mt-1 border-2 border-gray-50 overflow-auto shadow-lg rounded list-none">
		<li v-if="data.isLoading" class="loading">
		  Loading results...
		</li>
		<li
		  v-for="(result, i) in data.results" v-else :key="i"
		  class="autocomplete-result"
		  :class="[ i === arrowCounter? 'bg-blue-100 text-blue-800': '', 'w-full	list-none	text-left	p-2.5 cursor-pointer hover:bg-gray-50 ']"
		  @click="setResult(result)"
		>
			<slot name="result" :result="result">
				{{ result[label] }}
			</slot>
		</li>
	  </ul>
	</div>
  </template>
  <script setup>
  import axios from 'axios';
  import { computed, onMounted, onUnmounted, reactive } from 'vue';
  
	let props = defineProps({
	  name: {
		type: String,
		required: false,
		default: 'autocomplete',
	  },
	  source: {
		type: [String, Array, Function],
		required: true,
		default: '',
	  },
	  label: {
		type: String,
		required: false,
		default: 'name',
	  },
	  responseProperty: {
		type: String,
		required: false,
	  },
	});
	const emits = defineEmits(['change', 'noResults', 'results']);
	let data = reactive({
		isOpen: false,
		results: [],
		search: '',
		error: null,
		loading: false,
		arrowCounter: -1,
	});
	const showResults = computed(()=>{
		return Array.isArray(data.results) || hasError
	});
	const noResults = computed(()=>{
		return Array.isArray(data.results) && data.results.length === 0
	});
	const isLoading = computed(()=>{
		return data.loading === true
	});
	const hasError = computed(()=>{
		return data.error !== null
	});
	  
	onMounted(()=>{
	  document.addEventListener('click', handleClickOutside)
	});
	onUnmounted(()=>{
	  document.removeEventListener('click', handleClickOutside)
	});
	/**
	   * Make an http request for results
	   * @param {String} url
	   */
	async function request(url) {
		data.results = [];
		data.results.push({id : 0 , name: data.search})
		let response = await axios.get(url)
		  .then(response => {
			return getResults(response.data)
		  })
		  .then(response => {
			data.results = data.results.concat(response);
			emitRequestResultEvent();
			data.loading = false
		  })
		  .catch(error => {
			data.error = error.message
			data.loading = false
		  });

		  return response;
	};
	function getResults (response) {
		if (!props.responseProperty) {
			return response;
		}
		let foundObj = response;
		props.responseProperty.split('.').forEach(el=>{
			foundObj = foundObj[el];
		});
		return foundObj;
	};
	   /**
	   * Emit an event based on the request results
	   */
	function emitRequestResultEvent () {
		if (data.results.length === 0) 
		  emits('noResults', {query: data.search})
		 else 
		  emits('results', {results: data.results})
		
	};
	function setResult(result) {
		data.search = result[label];
		data.isOpen = false;
		emits('change', result);
	};
	function arrayLikeSearch(items) {
		data.results = items.map(item=>{
			if(typeof item === 'object') return item;
			let itemObj = {};
			itemObj[data.label] = item;
			return itemObj;
		}).filter((item) => {
		  return item[data.label].toLowerCase().indexOf(data.search.toLowerCase()) > -1;
		});
	};
	function onChange() {
		if (!props.source || !data.search) 
		  return false;
		
		data.isOpen = true;
		switch (true) {
		  case typeof props.source === 'string':
			return request(props.source + data.search);
		  case typeof props.source === 'function':
			return source(data.search);
		  case Array.isArray(props.source):
			return arrayLikeSearch(props.source);
		  default:
			throw new Error("typeof source is "+(typeof props.source))
		}
	};
	function handleClickOutside(event) {
		if(!data.isOpen) return false;
  
		if (!$el.contains(event.target)) 
		  onEnter();
		
	};
	function onArrowDown() {
		if (data.arrowCounter < data.results.length) 
		data.arrowCounter = data.arrowCounter + 1;
		
	};
	function onArrowUp() {
		if (data.arrowCounter > 0) 
		data.arrowCounter = data.arrowCounter - 1;
		
	};
	function onEnter(event) {
		if(event) event.preventDefault();
		if(!data.results.length)
		data.arrowCounter = -1;
		else if(data.arrowCounter<0)
		  setResult(data.results[0]);
		else
		  setResult(data.results[data.arrowCounter]);
		
		  data.isOpen = false;
	};
  </script>
	
  <style>
  .autocomplete-result.is-active {
	background-color: #ecf7ff;
	color: #2563eb;
  }
  </style>