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
    </template>
  </VaDataTable>
  <br>


  <VaModal
      v-model="this.modalOpened"
  >
    <CharacterListPopup
        :character="this.openedItem"
    />
  </VaModal>
</template>

<script>
import {defineComponent} from "vue";
import router from "@/router/router.js";
import CharacterListPopup from "@/components/character/CharacterListPopup.vue";
import axiosAgregator from "@/server/axiosAgregator.js";

export default defineComponent({
  components: {
    CharacterListPopup
  },
  watch: {
    selectedItems(){
      if (this.selectedItems.length > 0) {
        localStorage.setItem('characterListId', this.selectedItems[0].id);
      }
      else{
        localStorage.removeItem('characterListId');
      }
    }
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
      {key: "race.name", label: "Раса персонажа", sortable: false},
      {key: "characterClass.name", label: "Класс персонажа", sortable: false},
      {key: "level", label: "Уровень персонажа", sortable: false},
      {key: "actions", label: "Действия", width: '80px'},
    ];

    return {
      openedItemId: null,
      openedItem: null,
      modalOpened: false,
      items,
      columns,
      selectedItems: [items[1]],
      selectedItemsEmitted: [],
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    openModal(id) {
      axiosAgregator.sendGet('/')
      this.openedItemId = id;
      this.modalOpened = true;
    },
    loadData(){
      axiosAgregator.sendGet('/api/v1/character/all').then((response) => {
        this.items = response.data;
      })
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