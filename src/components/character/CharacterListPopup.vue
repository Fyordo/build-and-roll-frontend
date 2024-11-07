<script>
export default {
  data() {
    return {
      id: 1,
      name: "Персонаж",
      currentHP: 10,
      race: "Орк",
      class: "Клирик",
      level: "1",
      stats: [
        {id: 1, title: "Сила", value: 10},
        {id: 2, title: "Ловкость", value: 10},
        {id: 3, title: "Телосложение", value: 10},
        {id: 4, title: "Интеллект", value: 10},
        {id: 5, title: "Мудрость", value: 10},
        {id: 6, title: "Харизма", value: 10},
      ],
      spells: [
        {id: 1, title: "Забвение"},
        {id: 2, title: "Заговор на понос"},
      ],
      weapons: [
        {id: 1, title: "Меч"},
        {id: 2, title: "Лук"},
      ]
    };
  },
  props: {
    characterId: {
      type: Number,
      required: true,
    }
  }
};
</script>

<template>
  <h3 class="va-h3">{{ this.name }}</h3><br>
  <h6 class="va-h6">Текущее здоровье: {{ this.currentHP }}</h6>
  <h6 class="va-h6">Раса: {{ this.race }}</h6>
  <h6 class="va-h6">Класс: {{ this.class }}</h6>
  <br>
  <h6 class="va-h6">Заклинания</h6>
  <VaDataTable :items="this.spells" />
  <br>
  <h6 class="va-h6">Оружие</h6>
  <VaDataTable :items="this.weapons" />
</template>

<style scoped>

</style>