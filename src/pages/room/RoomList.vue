<template>
  <div class="rooms-container">
    <VaCard v-for="room in rooms" :key="room.id" class="room-card">
      <div class="room-title">{{ room.title }}</div>
      <div class="room-owner">Владелец: {{ room.owner.username }}</div>
      <VaCardActions>
        <VaButton @click="joinRoom(room.id)">Присоединиться</VaButton>
      </VaCardActions>
    </VaCard>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import axiosAgregator from "@/server/axiosAgregator.js";

const router = useRouter();
const rooms = ref([]); // Инициализируем массив комнат

onMounted(async () => {
  const response = await axiosAgregator.sendGet("/api/v1/room/all");
  rooms.value = response.data; // Присваиваем полученные данные
});

const joinRoom = (id) => {
  router.push(`/room/${id}`); // Используем id для перехода в нужную комнату
};
</script>

<style scoped>
.rooms-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.room-card {
  width: calc(33% - 20px);
}

.room-title {
  font-size: 1.2em;
  font-weight: bold;
}

.room-owner {
  color: gray;
}
</style>
