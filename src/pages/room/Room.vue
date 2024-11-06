<template>
  <div class="room-page">
    <h2>Список Комнат</h2>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="rooms.length === 0">Нет доступных комнат.</div>
    <ul>
      <li v-for="room in rooms" :key="room.title">
        <h3>{{ room.title }}</h3>
        <p>Владелец: {{ room.owner.username }}</p>
        <a :href="room.invitationLink" target="_blank">Присоединиться к комнате</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import axiosAgregator from "@/server/axiosAgregator.js";

const rooms = ref([]);
const loading = ref(true);

const fetchRooms = async () => {
  try {
    console.log("sdf")
    const response = await axiosAgregator.sendGet('/api/v1/room');
    rooms.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке комнат:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRooms();
});
</script>

<style scoped>
.room-page {
  margin: 20px;
}
.room-page h2 {
  font-size: 24px;
}
.room-page ul {
  list-style-type: none;
  padding: 0;
}
.room-page li {
  margin-bottom: 15px;
}
</style>
