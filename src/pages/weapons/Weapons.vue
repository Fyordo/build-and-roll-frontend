<script>
import { defineComponent } from "vue";
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
    selectedType() {
      this.loadData();
    },
    filter() {
      this.loadData();
    }
  },
  methods: {
    loadData(){
      let path = `/api/v1/lib/weapon?page=${this.currentPage}&perPage=${this.perPage}`;
      if (this.selectedType !== undefined){
        path += `&type=${this.selectedType}`;
      }
      if (this.filter.length > 0){
        path += `&search=${this.filter}`;
      }
      axiosAgregator.sendGet(path)
          .then(response => {
            console.log(response.data);
            this.items = response.data;
          })
    }
  },
  data() {
    const items = [];

    const columns = [
      { key: "name", label: "Название", sortable: false },
      { key: "type", label: "Тип оружия", sortable: false },
      { key: "actions", label: "Допольнительная информация", sortable: false, width: 80 },
    ];

    const perPage = 10;
    const currentPage = 1;
    const filter = "";
    const selectedType = undefined;
    const types = ["Melee", "Ranged"];

    return {
      items,
      columns,
      perPage,
      currentPage,
      filter,
      selectedType,
      types
    };
  },
});
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
        style="margin-right: 10px"
    />
  </div>
  <br>

  <div class="grid sm:grid-cols-2 gap-6 mb-6">
    <VaSelect
        v-model="selectedType"
        label="Тип оружия"
        :options="types"
    />
  </div>
  <VaDataTable
      :items="items"
      :columns="columns"
      @filtered="filtered = $event.items"
  >
    <template #cell(actions)="{ row, isExpanded }">
      <VaButton
          :icon="isExpanded ? 'va-arrow-up': 'va-arrow-down'"
          preset="secondary"
          class="w-full"
          @click="row.toggleRowDetails()"
      >
        {{ isExpanded ? 'Закрыть': 'Открыть' }}
      </VaButton>
    </template>

    <template #expandableRow="{ rowData }">
      <div class="flex gap-2">
        <div class="pl-2">
          <div class="flex gap-1">
            <span><b>Цена:</b> {{ rowData.properties.Cost }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Урон:</b> {{ rowData.properties.Damage }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Тип урона:</b> {{ rowData.properties.DamageType }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Вес:</b> {{ rowData.properties.Weight }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Дополнительные данные:</b> {{ rowData.properties.Properties.join(', ') }}</span>
          </div>
        </div>
      </div>
    </template>
  </VaDataTable>
</template>

<style scoped>

</style>