<template>
	<div class="autocomplete my-2">
	  <input
		v-model="search" type="text" class="text-base font-medium block w-full rounded-md border transition ease-in-out focus:ring-1 border-gray-300 border-solid p-2.5 text-gray-700 placeholder-gray-400 focus:border-blue-200 focus:ring-blue-500 focus:outline-none outline-none"
		:name="name" @input="onChange" @keydown.down="onArrowDown"
		@keydown.up="onArrowUp" @keydown.enter="onEnter"
	  >
	  <ul v-show="isOpen" class="autocomplete-results mt-1 border-2 border-gray-50 overflow-auto shadow-lg rounded list-none">
		<li v-if="isLoading" class="loading">
		  Loading results...
		</li>
		<li
		  v-for="(result, i) in results" v-else :key="i"
		  class="autocomplete-result"
		  :class="[ i === arrowCounter? 'bg-blue-100 text-blue-800': '', 'w-full	list-none	text-left	p-2.5 cursor-pointer hover:bg-gray-50 ']"
		  @click="setResult(result)"
		>
		  {{ result[label] }}
		</li>
	  </ul>
	</div>
  </template>
  <script>
  import axios from 'axios';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
	props: {
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
		default: 'name',
	  },
	},
	emits:['change', 'noResults', 'results'],
	data() {
	  return {
		isOpen: false,
		results: [],
		search: '',
		error: null,
		loading: false,
		arrowCounter: -1,
	  };
	},
	computed: {
	  showResults() {
		return Array.isArray(this.results) || this.hasError
	  },
	  noResults() {
		return Array.isArray(this.results) && this.results.length === 0
	  },
	  isLoading() {
		return this.loading === true
	  },
	  hasError() {
		return this.error !== null
	  },
	},
	mounted() {
	  document.addEventListener('click', this.handleClickOutside)
	},
	unmounted() {
	  document.removeEventListener('click', this.handleClickOutside)
	},
	methods: {
	  /**
	   * Make an http request for results
	   * @param {String} url
	   */
	  request(url) {
		this.results = [];
		this.results.push({id : 0 , name: this.search})
		return axios.get(url)
		  .then(response => {
			this.results = this.results.concat(this.getResults(response));
			this.emitRequestResultEvent();
			this.loading = false
		  })
		  .catch(error => {
			this.error = error.message
			this.loading = false
		  })
	  },
	  getResults (response) {
		if (this.responseProperty) {
			let foundObj;
			JSON.stringify(response, (_, nestedValue) => {
			  if (nestedValue && nestedValue[this.responseProperty]) 
				foundObj = nestedValue[this.responseProperty];
			  
			  return nestedValue;
			});
			return foundObj;
		}
		return []
	  },
	   /**
	   * Emit an event based on the request results
	   */
	   emitRequestResultEvent () {
		if (this.results.length === 0) 
		  this.$emit('noResults', {query: this.search})
		 else 
		  this.$emit('results', {results: this.results})
		
	  },
	  setResult(result) {
		this.search = result[this.label];
		this.isOpen = false;
		this.$emit('change', result);
	  },
	  arrayLikeSearch(items) {
		this.results = items.map(item=>{
			if(typeof item === 'object') return item;
			let itemObj = {};
			itemObj[this.label] = item;
			return itemObj;
		}).filter((item) => {
		  return item[this.label].toLowerCase().indexOf(this.search.toLowerCase()) > -1;
		});
	  },
	  onChange() {
		if (!this.source || !this.search) 
		  return false;
		 
		this.isOpen = true;
		switch (true) {
		  case typeof this.source === 'string':
			return this.request(this.source + this.search);
		  case typeof this.source === 'function':
			return this.source(this.search);
		  case Array.isArray(this.source):
			return this.arrayLikeSearch(this.source);
		  default:
			throw new Error("typeof source is "+(typeof this.source))
		}
	  },
	  handleClickOutside(event) {
		if(!this.isOpen) return false;
  
		if (!this.$el.contains(event.target)) 
		  this.onEnter();
		
	  },
	  onArrowDown() {
		if (this.arrowCounter < this.results.length) 
		  this.arrowCounter = this.arrowCounter + 1;
		
	  },
	  onArrowUp() {
		if (this.arrowCounter > 0) 
		  this.arrowCounter = this.arrowCounter - 1;
		
	  },
	  onEnter(event) {
		if(event) event.preventDefault();
		if(!this.results.length)
		  this.arrowCounter = -1;
		else if(this.arrowCounter<0)
		  this.setResult(this.results[0]);
		else
		  this.setResult(this.results[this.arrowCounter]);
		
		this.isOpen = false;
	  },
	},
  });
  </script>
	
  <style>
  .autocomplete-result.is-active {
	background-color: #ecf7ff;
	color: #2563eb;
  }
  </style>