<template>
  <div class="room-container">
    <VaCard class="room-details-card" v-if="room">
      <VaCardHeader>
        <h3>{{ room.title }}</h3>
        <p>Владелец: {{ room.owner.username }}</p>
      </VaCardHeader>
      <VaCardContent>
        <p>Описание: {{ room.description }}</p>

      </VaCardContent>
      <VaCardActions>
        <VaButton @click="leaveRoom">Покинуть комнату</VaButton>
      </VaCardActions>
    </VaCard>

    <div v-else>
      <p>Загрузка данных о комнате...</p>
    </div>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
    <transition-group name="fade" tag="div">
      <div v-for="(notification, index) in notifications" :key="index" class="notification">
        {{ notification }}
      </div>
    </transition-group>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosAgregator from "@/server/axiosAgregator.js";
import Pusher from "pusher-js";

const route = useRoute();
const router = useRouter();

const room = ref(null);
const notifications = ref([]);

const loadRoomData = async (id) => {
  const response = await axiosAgregator.sendGet(`/api/v1/room/${id}`);
  room.value = response.data; // Присваиваем полученные данные
};
const enablePusher = async(id) => {
  const pusher = new Pusher('61cebc6ceca8652470ef', {
    cluster: 'eu',
  });

  const channel = pusher.subscribe(`room_${id}_channel`);
  console.log(`room_${id}_channel`)

  channel.bind('USER_JOINED', function(data) {
    const user = data.user.username;
    addNotification(`${user} подключился к комнате`);
  });
};

const addNotification = (message) => {
  if (notifications.value.length < 3) { // Ограничение до 3 уведомлений
    notifications.value.push(message); // Добавляем сообщение в массив уведомлений
    setTimeout(() => {
      notifications.value.shift(); // Удаляем первое уведомление через 10 секунд
    }, 5000);
  }
};



onMounted(() => {
  const roomId = route.params.id;
  enablePusher(roomId);
  loadRoomData(roomId);
});

const leaveRoom = () => {
  router.push('/room');
};
</script>

<style scoped>
.room-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.room-details-card {
  width: 100%;
  max-width: 600px;
}
.notification {
  background-color: #255fc6; /* Цвет фона уведомления */
  border: 1px solid #007bff; /* Граница */
  padding: 10px; /* Отступы */
  margin: 10px; /* Отступы между уведомлениями */
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease; /* Плавный переход */
}

.fade-enter, .fade-leave-to /* .fade-leave-active в версии Vue >=2.1.8 */ {
  opacity: 0; /* Начальная непрозрачность */
}

</style>
