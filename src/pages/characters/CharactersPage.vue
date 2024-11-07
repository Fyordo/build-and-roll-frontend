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
    selectedItems() {
      if (this.selectedItems.length > 0) {
        localStorage.setItem('characterListId', this.selectedItems[0].id);
      } else {
        localStorage.removeItem('characterListId');
      }
    }
  },
  data() {
    const items = [];

    const columns = [
      {key: "name", label: "Имя персонажа", sortable: false},
      {key: "race", label: "Раса персонажа", sortable: false},
      {key: "class", label: "Класс персонажа", sortable: false},
      {key: "level", label: "Уровень персонажа", sortable: false},
      {key: "actions", label: "Действия", width: '80px'},
    ];

    return {
      openedItemId: null,
      openedItem: null,
      modalOpened: false,
      items,
      columns,
      selectedItems: [],
      selectedItemsEmitted: [],
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async openModal(id) {
      const item = this.items[id];
      await axiosAgregator.sendGet('/api/v1/character/' + item.id).then(response => {
        this.openedItem = response.data;
      })
      this.openedItemId = id;
      this.modalOpened = true;
    },
    async loadData() {
      await axiosAgregator.sendGet('/api/v1/character').then((response) => {
        this.items = response.data;
        const selectedListId = localStorage.getItem('characterListId');
        if (selectedListId) {
          console.log(selectedListId)
          for (const item of this.items) {
            if (item.id == selectedListId) {
              this.selectedItems.push(item)
              return;
            }
          }
        }
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