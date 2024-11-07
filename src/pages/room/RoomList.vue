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
    <VaButton @click="toggleModal">
      Создать комнату
    </VaButton>

    <VaModal v-model="showModal" @ok="submitForm">
      <h3 class="va-h3">Создать комнату</h3>
      <br>
      <form @submit.prevent="submitForm">
        <div>
            <VaInput
                v-model=newRoom.title
                placeholder="Название"
                label="Название"
            />
        </div>
      </form>
    </VaModal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosAgregator from "@/server/axiosAgregator.js";

export default {
  data() {
    return {
      rooms: [], // Инициализируем массив комнат
      showModal: false,
      newRoom: {
        title: '',
      },
    };
  },
  methods: {

    async fetchRooms() {
      const response = await axiosAgregator.sendGet("/api/v1/room/all");
      this.rooms = response.data;
    },

    async joinRoom(roomId) {
      const userId = localStorage.getItem('userId');
      const characterListId = localStorage.getItem("characterListId");
      if (characterListId === null) {
        alert('У вас не выбран лист персонажа!')
        return
      }
      await axiosAgregator.sendPost("/api/v1/room/add_user", {
        userId: userId,
        roomId: roomId,
        characterListId: characterListId
      });
      this.$router.push(`/room/${roomId}`); // Используем id для перехода в нужную комнату
    },

    toggleModal() {
      this.showModal = !this.showModal;
    },

    createRoom() {
      this.$router.push('/create-room'); // Перенаправляем на страницу создания комнаты
    },

    async submitForm() {
      try {
        const response = await axiosAgregator.sendPost("/api/v1/room/", this.newRoom);
        await this.fetchRooms();
      } catch (error) {
        console.error("Ошибка при создании комнаты:", error);
      }
    },
  },
  mounted() {
    this.fetchRooms(); // Загружаем комнаты при монтировании компонента
  }
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
