<script>
import {defineComponent} from "vue";
import axiosAgregator from "@/server/axiosAgregator.js";

export default defineComponent({
  mounted() {
    this.loadData();
  },
  watch: {
    currentPage() {
      this.loadData();
    },
    perPage() {
      this.loadData();
    },
    selectedLevel() {
      this.loadData();
    },
    selectedSchool() {
      this.loadData();
    },
    filter() {
      this.loadData();
    }
  },
  data() {
    const columns = [
      {key: "level", label: "Уровень", sortable: false},
      {key: "name", label: "Название", sortable: false},
      {key: "school", label: "Школа", sortable: false},
      {key: "properties.range", label: "Дальность", sortable: false},
      {key: "actions", label: "Допольнительная информация", width: 80},
    ];

    const perPage = 10;
    const currentPage = 1;
    const filter = "";
    const selectedLevel = undefined;
    const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selectedSchool = undefined;
    const schoolOptions = [
      'Divination',
      'Illusion',
      'Necromancy',
      'Abjuration',
      'Transmutation',
      'Evocation',
      'Transmutation',
      'Conjuration',
      'Enchantment',
      'Conjuration',
      'Evocation'
    ];

    return {
      items: [],
      columns,
      perPage,
      currentPage,
      filter,
      selectedLevel,
      spellLevels,
      selectedSchool,
      schoolOptions
    };
  },
  methods: {
    loadData() {
      let path = `/api/v1/lib/spell?page=${this.currentPage}&perPage=${this.perPage}`;
      if (this.selectedSchool !== undefined) {
        path += `&school=${this.selectedSchool}`;
      }
      if (this.selectedLevel !== undefined) {
        path += `&level=${this.selectedLevel}`;
      }
      if (this.filter.length > 0) {
        path += `&search=${this.filter}`;
      }
      axiosAgregator.sendGet(path)
          .then(response => {
            console.log(response.data);
            this.items = response.data;
          })
    }
  }
})
;
</script>

<template>
  <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-10 mb-6">
    <VaInput
        v-model.number="perPage"
        type="number"
        placeholder="Кол-во..."
        label="Элементов на странице"
        style="margin-right: 10px"
    />
    <VaInput
        v-model.number="currentPage"
        type="number"
        placeholder="Страница..."
        label="Текущая страница"
        style="margin-right: 10px"
    />
    <VaInput
        v-model="filter"
        class="sm:col-span-2 md:col-span-3"
        placeholder="Название..."
        label="Фильтр"
    />
  </div>
  <br>

  <div class="grid sm:grid-cols-2 gap-6 mb-6">
    <VaSelect
        v-model="selectedLevel"
        label="Уровень"
        :options="spellLevels"
        style="margin-right: 10px"
    />
    <VaSelect
        v-model="selectedSchool"
        label="Школа"
        :options="schoolOptions"
    />
  </div>
  <VaDataTable
      :items="items"
      :columns="columns"
  >
    <template #cell(actions)="{ row, isExpanded }">
      <VaButton
          :icon="isExpanded ? 'va-arrow-up': 'va-arrow-down'"
          preset="secondary"
          class="w-full"
          @click="row.toggleRowDetails()"
      >
        {{ isExpanded ? 'Закрыть' : 'Открыть' }}
      </VaButton>
    </template>

    <template #expandableRow="{ rowData }">
      <div class="flex gap-2">
        <div class="pl-2 spells-container">
          <div class="flex items-center">
              <span>
                  <b>Описание:</b> {{ rowData.properties.text }}
              </span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Время каста:</b> {{ rowData.properties.castingTime }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Материалы:</b> {{ rowData.properties.materials }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Компоненты:</b> {{ rowData.properties.components }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Длительность:</b> {{ rowData.properties.duration }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Источник:</b> {{ rowData.properties.source }}</span>
          </div>
        </div>
      </div>
    </template>
  </VaDataTable>
</template>

<style scoped>
.spells-container {
  width: auto;
  text-wrap: wrap;
}
</style>