<script>
import {defineComponent} from "vue";
import {allSpells} from "@/assets/allSpells.js";

export default defineComponent({
  data() {
    const items = allSpells.map((e) => {
      return e.ru;
    });

    const columns = [
      {key: "level", label: "Уровень", sortable: true},
      {key: "name", label: "Название", sortable: true},
      {key: "school", label: "Школа", sortable: true},
      {key: "range", label: "Дальность", sortable: true},
      {key: "actions", label: "Допольнительная информация", width: 80},
    ];

    return {
      items,
      columns
    };
  },
});
</script>

<template>
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
                  <b>Описание:</b> {{ rowData.text }}
              </span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Время каста:</b> {{ rowData.castingTime }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Материалы:</b> {{ rowData.materials }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Компоненты:</b> {{ rowData.components }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Длительность:</b> {{ rowData.duration }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Источник:</b> {{ rowData.source }}</span>
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