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
  >
    <template #cell(actions)="{ rowIndex }">
      <VaButton
          preset="plain"
          icon="visibility"
          @click="this.openModal(rowIndex)"
      />
      <VaButton
          preset="plain"
          icon="delete"
          class="ml-3"
          @click="deleteItemById(rowIndex)"
      />
    </template>
  </VaDataTable>
  <br>


  <VaModal
      v-model="this.modalOpened"
  >
    <CharacterListPopup
        :character-id="this.openedItemId"
    />
  </VaModal>
</template>

<script>
import {defineComponent} from "vue";
import router from "@/router/router.js";
import CharacterListPopup from "@/components/character/CharacterListPopup.vue";

export default defineComponent({
  components: {
    CharacterListPopup
  },
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
      {key: "name", label: "Имя персонажа", sortable: false},
      {key: "race", label: "Раса персонажа", sortable: false},
      {key: "class", label: "Класс персонажа", sortable: false},
      {key: "level", label: "Уровень персонажа", sortable: false},
      {key: "actions", label: "Действия", width: '80px'},
    ];

    return {
      openedItemId: null,
      modalOpened: false,
      items,
      columns,
      selectedItems: [items[1]],
      selectedItemsEmitted: [],
    };
  },

  methods: {
    openModal(id) {
      this.openedItemId = id;
      this.modalOpened = true;
    },
    toConstructor() {
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