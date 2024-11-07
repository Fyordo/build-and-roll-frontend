<script>
export default {
  data() {
    const stats = [
      {
        id: 1,
        title: "Сила",
        level: 0,
      },
      {
        id: 2,
        title: "Ловкость",
        level: 0,
      },
      {
        id: 3,
        title: "Интеллект",
        level: 0,
      },
      {
        id: 4,
        title: "Мудрость",
        level: 0,
      },
      {
        id: 5,
        title: "Харизма",
        level: 0,
      },
      {
        id: 6,
        title: "Телосложение",
        level: 0,
      }
    ];
    const spellsColumns = [
      {key:"name", label:"Название"},
      {key:"school", label:"Школа"},
      {key:"level", label:"Уровень"}
    ]
    const weaponsColumns = [
      {key:"name", label:"Название"},
      {key:"type", label:"Тип оружия"},
      {key:"properties.Damage", label:"Урон"},
      {key:"properties.Damagetype", label:"Тип урона"},
    ]
    return {
      stats,
      spellsColumns,
      weaponsColumns,
      mappedStats: []
    };
  },
  mounted() {
    this.mappedStats = this.character.characterStats.map(e => {
      return {
        name: this.stats.findLast(el => el.id === e.id)?.title,
        level: e.level,
      }
    })
  },
  props: {
    character: {
      type: Object,
      required: true,
    }
  }
};
</script>

<template>
  <h3 class="va-h3">{{ character.name }}</h3><br>
  <h6 class="va-h6">Текущее здоровье: {{ character.level * 10 }}</h6>
  <h6 class="va-h6">Уровень: {{ character.level }}</h6>
  <h6 class="va-h6">Раса: {{ character.race.name }}</h6>
  <h6 class="va-h6">Класс: {{ character.characterClass.name }}</h6>
  <br>
  <h6 class="va-h6">Характеристики</h6>
  <VaDataTable :items="this.mappedStats"/>
  <br>
  <h6 class="va-h6">Заклинания</h6>
  <VaDataTable :items="character.spells" :columns="spellsColumns"/>
  <br>
  <h6 class="va-h6">Оружие</h6>
  <VaDataTable :items="character.weapons" :columns="weaponsColumns"/>
</template>

<style scoped>

</style>