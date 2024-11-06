<script>
import {defineComponent} from "vue";
import {allSpells} from "@/assets/allSpells.js";

export default defineComponent({
  computed: {
    pages() {
      return this.perPage && this.perPage !== 0
          ? Math.ceil(this.items.length / this.perPage)
          : this.items.length;
    },
  },
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

    const perPage = 10;
    const currentPage = 1;
    const filter = "";
    const selectedLevel = undefined;
    const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selectedSchool = undefined;
    const schoolOptions = [];

    return {
      items,
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
.spells-container {
  width: auto;
  text-wrap: wrap;
}
</style>