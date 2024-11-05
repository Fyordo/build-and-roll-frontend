
<template>
  <div class="character-sheet">
    <img src="@/assets/character-sheet.png" alt="Character Sheet" class="sheet-image" />
    <div class="stats">
      <div class="stat">
        <label for="strength">Сила:</label>
        <input type="number" id="strength" v-model.number="stats.strength" />
      </div>
      <div class="stat">
        <label for="dexterity">Ловкость:</label>
        <input type="number" id="dexterity" v-model.number="stats.dexterity" />
      </div>
      <div class="stat">
        <label for="constitution">Телосложение:</label>
        <input type="number" id="constitution" v-model.number="stats.constitution" />
      </div>
      <div class="stat">
        <label for="intelligence">Интеллект:</label>
        <input type="number" id="intelligence" v-model.number="stats.intelligence" />
      </div>
      <div class="stat">
        <label for="wisdom">Мудрость:</label>
        <input type="number" id="wisdom" v-model.number="stats.wisdom" />
      </div>
      <div class="stat">
        <label for="charisma">Харизма:</label>
        <input type="number" id="charisma" v-model.number="stats.charisma" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const stats = ref({
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
});
</script>

<style scoped>
.character-sheet {
  position: relative;
}

.sheet-image {
  width: 100%;
  max-width: 600px;
}

.stats {
  position: absolute;
  top: 20px; /* Позиционируйте в зависимости от изображения */
  left: 20px; /* Позиционируйте в зависимости от изображения */
}

.stat {
  margin-bottom: 10px;
}

label {
  display: block;
}
</style>
