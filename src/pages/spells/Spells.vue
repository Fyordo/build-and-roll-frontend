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
        <div class="pl-2">
          <div class="flex items-center">
              <span>
                <div class="long-text">
                  Описание: {{ rowData.text }}
                </div>
              </span>
          </div>
          <div class="flex items-center">
            <span>Время каста: {{ rowData.castingTime }}</span>
          </div>
          <div class="flex items-center">
            <span>Мтаериалы: {{ rowData.materials }}</span>
          </div>
          <div class="flex items-center">
            <span>Компоненты: {{ rowData.components }}</span>
          </div>
          <div class="flex items-center">
            <span>Длиительность: {{ rowData.duration }}</span>
          </div>
          <div class="flex items-center">
            <span>Источник: {{ rowData.source }}</span>
          </div>
        </div>
      </div>
    </template>
  </VaDataTable>
</template>

<style scoped>
.long-text {
  width: 300px;
  max-width: 300px;
}
</style>