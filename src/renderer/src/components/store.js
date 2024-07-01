// store.js
import { defineStore } from 'pinia'

export const useKeyStore = defineStore('key', {
  state: () => {
    return {
      key: null,
      index_value: null,
      value_value: null,
      ignore_value: null
    }
  },
  actions: {
    setKey(data) {
      this.key = data
    },
    setvalues(indexv, valuev ,ignorev) {
      this.index_value = indexv
      this.value_value = valuev
      this.ignore_value = ignorev
    },
    getKey() {
      return this.key
    },
    getvalues() {
      return [this.index_value, this.value_value, this.ignore_value]
    }
  }
})
