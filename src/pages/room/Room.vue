<template>
  <div class="main-container">
    <div class="room-container">
      <VaCard class="room-details-card" v-if="room">
        <VaCardBlock>
          <h3>{{ room.title }}</h3>
          <p>Владелец: {{ room.owner.username }}</p>
        </VaCardBlock>
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

      <transition-group name="fade" tag="div">
        <div v-for="(notification, index) in notifications" :key="index" class="notification">
          {{ notification }}
        </div>
      </transition-group>
    </div> <!-- End of room-container -->

    <VaList fit>
      <VaListLabel> Пользователи в комнате: </VaListLabel>
      <VaListItem
          v-for="(user, id) in this.users"
          :key="id"
          class="list__item"
      >
        <VaListItemSection avatar>
          <VaAvatar>
            <img :src="user.img" :alt="user.name">
          </VaAvatar>
        </VaListItemSection>

        <VaListItemSection>
          <VaListItemLabel>
            {{ user.username }}
          </VaListItemLabel>

        </VaListItemSection>

        <VaListItemSection icon>
          <VaIcon
              name="remove_red_eye"
              color="background-element"
          />
        </VaListItemSection>
      </VaListItem>
    </VaList>

  </div>
</template>


<script>
import {VaListItemSection} from "vuestic-ui";
import axiosAgregator from "@/server/axiosAgregator.js";
import Pusher from "pusher-js";
const pusher = new Pusher('61cebc6ceca8652470ef', {
  cluster: 'eu',
})
let channel = null;

export default {
  components: {VaListItemSection},
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
  beforeUnmount() {
    this.deleteUser();
  },

  methods: {
    async loadRoomData(id) {
      const response = await axiosAgregator.sendGet(`/api/v1/room/${id}`);

      const authUser = {
        id: this.authUserId,
        username: this.authUsername,
      };

      await this.addUser(authUser);
      this.room = response.data;
    },

    enablePusher(id) {
      channel = pusher.subscribe(`room_${id}_channel`)
      channel.bind('USER_JOINED', async (data) => {
        const user = data.user;
        this.addUser(user);
        if (user.username !== this.authUsername) {
          this.addNotification(`${user.username} подключился к комнате`);
          await axiosAgregator.sendPost(`/api/v1/room/${this.roomId}/send_users`, {
            users: this.users,
            user: user
          });
        }
      });

      channel.bind('USER_LEFT', (data) => {
        const user = data.user;
        this.removeUser(user);
      });

      channel.bind('UPDATE_USERS', (data) => {
        const user = data.user;
        console.log("000")
        if(user.username !== this.authUsername) {
          return;
        }
        console.log("+++");
        this.users = data.users;
        console.log(this.users);
        //this.users.push(user);

        //console.log(this.users);
      });
    },

    async addUser(user) {
      if (!this.users.some(existingUser => existingUser.username === user.username)) {
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
      await this.deleteUser();
      this.$router.push('/room');
    },

    async deleteUser() {
      const userId = localStorage.getItem("userId");
      await axiosAgregator.sendPost("/api/v1/room/remove_user", {
        userId: userId,
        roomId: this.roomId,
      });
    }
  }

};

</script>

<style lang="scss">
.list__item + .list__item {
  margin-top: 20px;
}

.room-container {
 display: flex;
 justify-content: start;
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
