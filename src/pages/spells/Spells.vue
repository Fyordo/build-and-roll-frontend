<script>
import { defineComponent } from "vue";
import debounce from "lodash/debounce.js";
import {allSpells} from "@/assets/allSpells.js";
import axiosAgregator from "@/server/axiosAgregator.js";

export default defineComponent({
  data() {
    const items = allSpells;

    const columns = [
      { key: "ru.level", label: "Уровень", sortable: true },
      { key: "ru.name", label: "Название", sortable: true },
      { key: "ru.school", label: "Школа", sortable: true },
      { key: "ru.range", label: "Дистанция", sortable: true },
      { key: "ru.castingTime", label: "Время каста", sortable: true },
    ];

    const input = "";

    return {
      items,
      columns,
      input,
      filter: input,
      isDebounceInput: false,
      isCustomFilteringFn: false,
      filteredCount: items.length,
    };
  },

  props: {
    page: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    }
  },

  computed: {
    customFilteringFn() {
      return this.isCustomFilteringFn ? this.filterExact : undefined;
    },
  },

  methods: {
    loadData(){
      const page = this.page ?? 1;
      const perPage = this.perPage ?? 10;
      axiosAgregator.sendGet(`/api/spells?page=${page}&perPage=${perPage}`).then(response => {
        this.items = response.data.data;
      })
    },
    filterExact(source) {
      if (this.filter === "") {
        return true;
      }
      return source?.toString?.() === this.filter;
    },

    updateFilter(filter) {
      this.filter = filter;
    },

    debouncedUpdateFilter: debounce(function (filter) {
      this.updateFilter(filter);
    }, 600),
  },

  watch: {
    input(newValue) {
      if (this.isDebounceInput) {
        this.debouncedUpdateFilter(newValue);
      } else {
        this.updateFilter(newValue);
      }
    },
  },
});
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6 mb-6">
    <VaInput
        v-model="input"
        placeholder="Название..."
        class="w-full"
    />
  </div>

  <VaDataTable
      :items="items"
      :columns="columns"
      :filter="filter"
      :filter-method="customFilteringFn"
      @filtered="filteredCount = $event.items.length"
  />

  <VaAlert
      class="!mt-6"
      color="info"
      outline
  >
    Number of filtered items:
    <VaChip>{{ filteredCount }}</VaChip>
  </VaAlert>
</template>

<style scoped>

</style>