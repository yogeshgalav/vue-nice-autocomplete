<template>
	<div class="my-2">
		<div class="w-full">
			<input v-model="search" type="text"
				:class="inputClass"
				:name="name" @input="onChange" @keydown.down="onArrowDown" @keydown.up="onArrowUp" @keydown.enter="onEnter">
		</div>
		<div v-show="isOpen" :class="listClass">
			<div v-if="isLoading" class="loading">
				Loading results...
			</div>
			<div v-for="(result, i) in results" v-else :key="i" class=""
				:class="[i === arrowCounter ? 'listActiveItemClass' : '', 'listItemClass']"
				@click="setResult(result)">
				{{ result[label] }}
			</div>
		</div>
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
		listClass: {
			type: String,
			required: false,
			default: 'mt-1 border-2 border-slate-50 shadow-lg rounded  overflow-hidden',
		},
		listItemClass: {
			type: String,
			required: false,
			default: 'relative text-left p-2.5 cursor-pointer hover:bg-slate-50',
		},
		listActiveItemClass: {
			type: String,
			required: false,
			default: 'bg-blue-100 text-blue-800',
		},
	},
	emits: ['change'],
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
			this.results.push({ id: 0, name: this.search })
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
		getResults(response) {
			if (this.responseProperty) {
				let foundObj;
				JSON.stringify(response, (_, nestedValue) => {
					if (nestedValue && nestedValue[this.responseProperty])
						foundObj = nestedValue[this.responseProperty];

					return nestedValue;
				});
				return foundObj;
			}
			if (Array.isArray(response)) {
				return response;
			}
			return []
		},
		/**
		* Emit an event based on the request results
		*/
		emitRequestResultEvent() {
			if (this.results.length === 0)
				this.$emit('noResults', { query: this.search })
			else
				this.$emit('results', { results: this.results })

		},
		setResult(result) {
			this.search = result[this.label];
			this.isOpen = false;
			this.$emit('change', result);
		},
		arrayLikeSearch(items) {
			this.results = items.filter((item) => {
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
				return this.source(this.search).then(response=>{	
			  this.results = this.results.concat(this.getResults(response));
			  this.emitRequestResultEvent();
			});
				case Array.isArray(this.source):
					return this.arrayLikeSearch(this.source);
				default:
					throw new Error("typeof source is " + (typeof this.source))
			}
		},
		handleClickOutside(event) {
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
			if (event) event.preventDefault();
			if (!this.results.length)
				this.arrowCounter = -1;
			else if (this.arrowCounter < 0)
				this.setResult(this.results[0]);
			else
				this.setResult(this.results[this.arrowCounter]);

			this.isOpen = false;
		},
	},
});
</script>