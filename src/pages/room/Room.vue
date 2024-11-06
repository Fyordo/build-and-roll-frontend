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

    <div v-if="users.length > 0" class="user-list">
      <h4>Пользователи в комнате:</h4>
      <ul>
        <li v-for="(user, index) in users" :key="index">{{ user.username }}</li>
      </ul>
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
let users = ref([]);
let roomId = ref(null);
const authUserId = localStorage.getItem("userId");
const pusher = new Pusher('61cebc6ceca8652470ef', {
  cluster: 'eu',
});
let channel = ref(null);
let messages = ref([]);


const loadRoomData = async (id) => {
  const response = await axiosAgregator.sendGet(`/api/v1/room/${id}`);

  const authUser = {
    id: authUserId,
    username: localStorage.getItem("username"),
  };

  addUser(authUser);
  room.value = response.data;
};

const enablePusher = async(id) => {
  channel = pusher.subscribe(`room_${id}_channel`);
  channel.bind('USER_JOINED', function(data) {
    const user = data.user;
    addUser(user);
  });

  channel.bind('USER_LEFT', function(data) {
    const user = data.user;
    removeUser(user);
  });

  await channel.bind('UPDATE_USERS', function(data) {
    const user = data.user;
    console.log("+++++")
    console.log(data.users)

    if(user.id.toString() === authUserId){
      data.users.forEach(newUser => {
        if (!users.value.some(existingUser => existingUser.username === newUser.username)) {
          users.value.push(newUser);
        }
      });
    }
  });
};

const addUser = async (user) => {
  if (!users.value.some(existingUser => existingUser.id === user.id)) {
    if (user.id !== authUserId) {
      addNotification(`${user.username} подключился к комнате`);
      console.log("------");
      await axiosAgregator.sendPost(`/api/v1/room/${roomId}/send_users`, {
        users : users.value,
        user: user
      });
    }
    users.value.push(user);
  }
};

const removeUser = (user) => {
  const userIndex = users.value.findIndex(existingUser => existingUser.id === user.id);
  if (userIndex !== -1) {
    addNotification(`${user.username} вышел из комнаты`);
    users.value.splice(userIndex, 1);
  }
};

const addNotification = (message) => {
  if (notifications.value.length < 3) {
    notifications.value.push(message);
    setTimeout(() => {
      notifications.value.shift();
    }, 10000);
  }
};

const addMessage = (message) => {
  this.messages.push(message);
};

onMounted(() => {
  roomId = route.params.id;
  enablePusher(roomId);
  loadRoomData(roomId);
});

const leaveRoom = async () => {
  const userId = localStorage.getItem("userId");
  await axiosAgregator.sendPost("/api/v1/room/remove_user", {
    userId: userId,
    roomId: roomId,
  });
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
