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

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosAgregator from "@/server/axiosAgregator.js";
import Pusher from "pusher-js";

export default {
  data() {
    return {
      room: null,
      notifications: [],
      users: [],
      roomId: null,
      authUserId: localStorage.getItem("userId"),
      authUsername: localStorage.getItem("username"),
      pusher: new Pusher('61cebc6ceca8652470ef', {
        cluster: 'eu',
      }),
      channel: null,
    };
  },

  mounted() {
    this.roomId = this.$route.params.id;
    this.enablePusher(this.roomId);
    this.loadRoomData(this.roomId);
  },

  methods: {
    async loadRoomData(id) {
      const response = await axiosAgregator.sendGet(`/api/v1/room/${id}`);

      const authUser = {
        id: this.authUserId,
        username: this.authUsername,
      };

      this.addUser(authUser);
      this.room = response.data;
    },

    enablePusher(id) {
      this.channel = this.pusher.subscribe(`room_${id}_channel`);

      this.channel.bind('USER_JOINED', (data) => {
        const user = data.user;
        this.addUser(user);
      });

      this.channel.bind('USER_LEFT', (data) => {
        const user = data.user;
        this.removeUser(user);
      });

      this.channel.bind('UPDATE_USERS', (data) => {
        const user = data.user;

        if (user.username === this.authUsername) {
          data.users.forEach(newUser => {
            if (!this.users.some(existingUser => existingUser.username === newUser.username)) {
              this.users.push(newUser);
            }
          });
        }
      });
    },

    async addUser(user) {
      if (!this.users.some(existingUser => existingUser.username === user.username)) {
        if (user.username !== this.authUsername) {
          this.addNotification(`${user.username} подключился к комнате`);
          await axiosAgregator.sendPost(`/api/v1/room/${this.roomId}/send_users`, {
            users: this.users,
            user: user
          });
        }
        this.users.push(user);
      }
    },

    removeUser(user) {
      const userIndex = this.users.findIndex(existingUser => existingUser.id === user.id);

      if (userIndex !== -1) {
        this.addNotification(`${user.username} вышел из комнаты`);
        this.users.splice(userIndex, 1);
      }
    },

    addNotification(message) {
      if (this.notifications.length < 3) {
        this.notifications.push(message);

        setTimeout(() => {
          this.notifications.shift();
        }, 10000);
      }
    },

    async leaveRoom() {
      const userId = localStorage.getItem("userId");

      await axiosAgregator.sendPost("/api/v1/room/remove_user", {
        userId: userId,
        roomId: this.roomId,
      });

      this.$router.push('/room');
    }
  }
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
