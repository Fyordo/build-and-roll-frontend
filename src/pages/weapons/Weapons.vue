<script>
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
          ? Math.ceil(this.items.length / this.perPage)
          : this.items.length;
    },
  },
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

    const perPage = 10;
    const currentPage = 1;
    const filter = "";

    return {
      items,
      columns,
      perPage,
      currentPage,
      filter
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
  <VaDataTable
      :items="items"
      :columns="columns"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
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
            <span><b>Цена:</b> {{ rowData.properties.cost }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Урон:</b> {{ rowData.properties.damage }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Тип урона:</b> {{ rowData.properties.damageType }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Вес:</b> {{ rowData.properties.weight }}</span>
          </div>
          <br>
          <div class="flex items-center">
            <span><b>Дополнительные данные:</b> {{ rowData.properties.additionalData.join(', ') }}</span>
          </div>
        </div>
      </div>
    </template>
    <template #bodyAppend>
      <tr>
        <td colspan="6">
          <div class="flex justify-center mt-4">
            <VaPagination
                v-model="currentPage"
                :pages="pages"
            />
          </div>
        </td>
      </tr>
    </template>
  </VaDataTable>
</template>

<style scoped>

</style>