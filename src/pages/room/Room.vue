<template>
  <div class="main-container">
    <div class="room-container">
      <VaCard
          stripe
          stripe-color="success"
          v-if="room"
      >
        <VaCardTitle>
          <h3 class="va-h3">
            {{ room.title }}
          </h3>
        </VaCardTitle>
        <VaCardContent>
          Владелец: {{ room.owner.username }}
          <VaCardActions>
            <VaButton @click="leaveRoom">Покинуть комнату</VaButton>
          </VaCardActions>
        </VaCardContent>
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

    <br>
    <br>

    <div class="va-table-responsive">
      <table class="va-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Имя игрока</th>
          <th>Здоровье</th>
          <th>Уровень</th>
          <th>Тип игрока</th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="user in users"
            :key="user.id"
        >
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ 10 }}</td>
          <td>{{ 1 }}</td>
          <td>{{ user.id == room.owner.id ? "Dungeon Master" : "Игрок" }}</td>
          <td>
            <VaButton
                preset="plain"
                icon="visibility"
                @click="this.openModal(user.id)"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <VaModal
        v-model="this.modalOpened"
    >
      <CharacterListPopup
          :character-id="this.openedItemId"
      />
    </VaModal>

  </div>
</template>


<script>
import {VaListItemSection} from "vuestic-ui";
import axiosAgregator from "@/server/axiosAgregator.js";
import Pusher from "pusher-js";
import CharacterListPopup from "@/components/character/CharacterListPopup.vue";

const pusher = new Pusher('61cebc6ceca8652470ef', {
  cluster: 'eu',
})
let channel = null;

export default {
  components: {CharacterListPopup, VaListItemSection},
  data() {
    const columns = [
      {key: "id", label: "ID игрока"},
      {key: "username", label: "Имя игрока", sortable: false},
      {key: "type", label: "Тип игрока", sortable: false},
      {key: "actions", label: "Действия", width: '80px'},
    ];

    return {
      openedItemId: null,
      modalOpened: false,
      columns: columns,
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
    openModal(id) {
      this.openedItemId = id;
      this.modalOpened = true;
    },
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
        
        if (user.username !== this.authUsername) {
          return;
        }
        
        this.users = data.users;
        
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
  border-radius: 5px;
  padding: 10px; /* Отступы */
  margin: 10px; /* Отступы между уведомлениями */
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease; /* Плавный переход */
}

.fade-enter, .fade-leave-to /* .fade-leave-active в версии Vue >=2.1.8 */
{
  opacity: 0; /* Начальная непрозрачность */
}

</style>
