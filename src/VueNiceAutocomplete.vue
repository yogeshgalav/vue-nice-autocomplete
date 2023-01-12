<template>
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Search Country</h4>

            <input type="text" class="form-control" @input="onChange" v-model="search" @keydown.down="onArrowDown"
                @keydown.up="onArrowUp" @keydown.enter="onEnter" />
            <ul v-show="isOpen"
                class="list-group list-group-flush bg-secondary">
                <li class="loading" v-if="isLoading">
                    Loading results...
                </li>
                <li v-else v-for="(result, i) in results" :key="i" @click="setResult(result)"
                    class="autocomplete-result"
                    :class="[i === arrowCounter ? 'bg-primary text-primary' : '',
                        'list-group-item'
                    ]">
                    {{ result[label] }}
                </li>
            </ul>
        </div>
    </div>



</template>

<script>
    import axios from 'axios';
    import {
        defineComponent
    } from 'vue';

    export default defineComponent({
        emits: ['change'],
        props: {
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
        destroyed() {
            document.removeEventListener('click', this.handleClickOutside)
        },
        methods: {
            /**
             * Make an http request for results
             * @param {String} url
             */
            request(url) {
                return axios.get(url)
                    .then(response => {
                        // this.results = this.getResults(response.data)
                        this.results = response.data;
                        this.results.unshift({
                            id: 0,
                            name: this.search
                        })
                        this.emitRequestResultEvent()
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
                        if (nestedValue && nestedValue[this.responseProperty]) {
                            foundObj = nestedValue[this.responseProperty];
                        }
                        return nestedValue;
                    });
                    return foundObj;
                }
                return []
            },
            /**
             * Emit an event based on the request results
             */
            emitRequestResultEvent() {
                if (this.results.length === 0) {
                    this.$emit('noResults', {
                        query: this.search
                    })
                } else {
                    this.$emit('results', {
                        results: this.results
                    })
                }
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
                if (!this.source || !this.search) {
                    return false;
                }
                this.isOpen = true;
                switch (true) {
                    case typeof this.source === 'string':
                        return this.request(this.source + this.search);
                    case typeof this.source === 'function':
                        return this.source(this.search);
                    case Array.isArray(this.source):
                        return this.arrayLikeSearch(this.source);
                    default:
                        throw new Error("typeof source is " + (typeof this.source))
                }
            },
            handleClickOutside(event) {
                if (!this.$el.contains(event.target)) {
                    this.isOpen = false;
                    this.arrowCounter = -1;
                }
            },
            onArrowDown() {
                if (this.arrowCounter < this.results.length) {
                    this.arrowCounter = this.arrowCounter + 1;
                }
            },
            onArrowUp() {
                if (this.arrowCounter > 0) {
                    this.arrowCounter = this.arrowCounter - 1;
                }
            },
            onEnter() {
                this.setResult(this.results[this.arrowCounter]);
                this.arrowCounter = -1;
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
