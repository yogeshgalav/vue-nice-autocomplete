<template>
  <section class="autocomplete">
    <input
      v-model="search"
      :name="name"
      type="text"
      class="form-control"
      :disabled="disabled"
      :placeholder="placeholder"
      :readonly="!isAsync"
      @input="onChange"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @focus="onFocus"
    >
    <transition name="fade">
      <ul
        v-if="isOpen===true"
        id="autocomplete-results"
        class="autocomplete-results"
      >
        <li
          v-if="isLoading"
          class="loading"
        >
          {{ ('loading...') }}
        </li>
        <li
          v-for="(currentResult, i) in results"
          :key="i"
          class="autocomplete-result"
          :class="{ 'is-active': i === arrowCounter }"
          @click="setResult(currentResult)"
        >
          <slot
            name="list"
            v-bind="currentResult"
          >
            {{ currentResult[value] }}
          </slot>
        </li>
        <li
          v-if="createNewItem===true"
          class="autocomplete-result"
          @click="createNew"
        >
          {{ ('Create New') }}
        </li>
      </ul>
    </transition>
  </section>
</template>

<style>
  .autocomplete {
    position: relative;
  }

  .autocomplete-results {
	display: inline-block !important;
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    overflow: auto;
    width: 100%;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #10069f;
    color: white;
  }

</style>
<script>
export default {
	name: 'Autocomplete',

	props: {
		name: {
			type: String,
			required: true,
			default: () => 'autocomplete',
		},
		value: {
			type: String,
			required: true,
			default: () => 'name',
		},
		placeholder: {
			type: String,
			required: false,
			default: () => '',
		},
		items: {
			type: Array,
			required: true,
			default: () => [],
		},
		isAsync: {
			type: Boolean,
			required: false,
			default: true,
		},
		isLoading: {
			type: Boolean,
			required: false,
			default: false,
		},
		createNewItem: {
			type: Boolean,
			required: false,
			default: true,
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
		initialValue: {
			type: Object,
			required: false,
			default: () => {},
		},
	},
	$_veeValidate: {
		value () {
			return this.search;
		}
	},
	data() {
		return {
			isOpen: false,
			results: [],
			result:{},
			search: '',
			arrowCounter: 0,
		};
	},
	watch:{
		items(val){
			this.results = val;
			if(this.isAsync===true){
				this.isOpen=true;
			}
		},
		initialValue(val){
			if(val && !this.search){
				this.result = Object.assign({},val);
				this.search = this.result[this.value];
			}
		}
	},
	updated() {
		if(this.initialValue && this.search===''){
			this.result = Object.assign({},this.initialValue);
			this.search = this.result[this.value];
		}
	},
	mounted() {
		if(this.initialValue && this.search===''){
			this.result = Object.assign({},this.initialValue);
			this.search = this.result[this.value];
		}
		this.results = this.items;
		document.addEventListener('click', this.handleClickOutside);
	},
	destroyed() {
		document.removeEventListener('click', this.handleClickOutside);
	},
	methods: {
		onChange() {
			if(this.isAsync===false){
				this.results = this.results.filter(node=>node.name.indexOf(this.search) !== -1);
				return true;
			}
			// Let's warn the parent that a change was made
			this.$emit('input', this.search);
		},
		setResult(result) {
			this.$emit('selected', result);
			this.search = result[this.value];
			this.isOpen = false;
		},
		createNew() {
			if(this.createNewItem===false){
				return false;
			}
			this.$emit('selectNew', this.search);
			this.isOpen = false;
		},
		onArrowDown() {
			if (this.arrowCounter < this.results.length) {
				this.arrowCounter = this.arrowCounter + 1;
			}
		},
		onArrowUp() {
			if (this.arrowCounter > 0) {
				this.arrowCounter = this.arrowCounter -1;
			}
		},
		onEnter() {
			this.$emit('selected', this.results[this.arrowCounter]);
			this.search = this.results[this.arrowCounter][this.value];
			this.isOpen = false;
			this.arrowCounter = -1;
		},
		handleClickOutside(evt) {
			if(this.createNewItem===false || this.isOpen === false){
				return false;
			}
			if (!this.$el.contains(evt.target)) {
				this.$emit('selectNew', this.search);
				this.isOpen = false;
				this.arrowCounter = -1;
			}
		},
		onFocus(){
			if(this.isAsync===false){
				this.isOpen=true;
			}
		}
	}
};
</script>
