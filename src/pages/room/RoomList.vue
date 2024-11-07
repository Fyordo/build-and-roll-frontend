<template>
  <div class="rooms-container">
    <VaCard
        stripe
        stripe-color="success"
        v-for="room in rooms" :key="room.id"
    >
      <VaCardTitle>
        <h3 class="va-h3">
          {{ room.title }}
        </h3>
      </VaCardTitle>
      <VaCardContent>
        Владелец: {{ room.owner.username }}
        <VaCardActions>
          <VaButton @click="joinRoom(room.id)">Присоединиться</VaButton>
        </VaCardActions>
      </VaCardContent>
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

const joinRoom = async (roomId) => {
  const userId = localStorage.getItem('userId');
  await axiosAgregator.sendPost("/api/v1/room/add_user", {
    userId: userId,
    roomId: roomId,
  });
  router.push(`/room/${roomId}`); // Используем id для перехода в нужную комнату
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
