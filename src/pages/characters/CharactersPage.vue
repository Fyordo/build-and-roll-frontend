<template>
  <VaButton
      icon-right="arrow_forward"
      icon-color="#ffffff"
      @click="toConstructor"
  >
    Создать персонажа
  </VaButton>
  <br>
  <br>

  <VaDataTable
      v-model="selectedItems"
      :items="items"
      :columns="columns"
      selectable
      :select-mode="'single'"
      @selection-change="selectedItemsEmitted = $event.currentSelectedItems"
  />
  <br>

  <VaAlert
      class="!mt-6"
      color="info"
      outline
  >
    Выбранный основной лист персонажа:
    <VaChip
        v-for="item in selectedItemsEmitted"
        :key="item.id"
        class="ml-2"
        @click="unselectItem(item)"
    >
      {{ item.name }}
    </VaChip>
  </VaAlert>
</template>

<script>
import {defineComponent} from "vue";
import router from "@/router/router.js";

export default defineComponent({
  data() {
    const items = [
      {
        id: 1,
        name: "Персонаж 1",
        race: "Орк",
        class: "Клирик",
        level: "1",
      },
      {
        id: 2,
        name: "Персонаж 2",
        race: "Эльф",
        class: "Мечник",
        level: "5",
      },
    ];

    const columns = [
      {key: "name", label: "Имя персонажа", sortable: true},
      {key: "race", label: "Раса персонажа", sortable: true},
      {key: "class", label: "Класс персонажа", sortable: true},
      {key: "level", label: "Уровень персонажа", sortable: true},
    ];

    return {
      items,
      columns,
      selectedItems: [items[1]],
      selectedItemsEmitted: [],
    };
  },

  methods: {
    toConstructor(){
      router.push('/constructor')
    },
    unselectItem(item) {
      this.selectedItems = this.selectedItems.filter(
          (selectedItem) => selectedItem !== item
      );
    },
  },
});
</script>

<style scoped>

</style>