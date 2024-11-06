<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    const items = [
      {
        name: "Elven Lightblade",
        weaponType: "Melee",
        properties: {
          cost: "50 gp",
          damage: "1d6",
          damageType: "piercing",
          weight: "1 lb",
          additionalData: [
            "Finesse",
            "Light",
            "Special"
          ]
        },
      }
    ];

    const columns = [
      { key: "name", label: "Название", sortable: true },
      { key: "weaponType", label: "Тип оружия", sortable: true },
      { key: "actions", label: "Допольнительная информация", sortable: true, width: 80 },
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
        {{ isExpanded ? 'Закрыть': 'Открыть' }}
      </VaButton>
    </template>

    <template #expandableRow="{ rowData }">
      <div class="flex gap-2">
        <div class="pl-2">
          <div class="flex gap-1">
            <span>Цена: {{ rowData.properties.cost }}</span>
          </div>
          <div class="flex items-center">
            <span>Урон: {{ rowData.properties.damage }}</span>
          </div>
          <div class="flex items-center">
            <span>Тип урона: {{ rowData.properties.damageType }}</span>
          </div>
          <div class="flex items-center">
            <span>Вес: {{ rowData.properties.weight }}</span>
          </div>
          <div class="flex items-center">
            <span>Дополнительные данные: {{ rowData.properties.additionalData.join(', ') }}</span>
          </div>
        </div>
      </div>
    </template>
  </VaDataTable>
</template>

<style scoped>

</style>