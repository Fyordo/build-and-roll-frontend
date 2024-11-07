<script>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {VaInput, VaButton} from 'vuestic-ui';
import defaultLogo from '@/assets/default_logo.jpg';
import axiosAgregator from "@/server/axiosAgregator.js";
import router from "@/router/router.js";

export default {
  data() {
    return {
      user: {
        username: '',
        email: '',
        profilePicture: defaultLogo,
      }
    }
  },
  mounted() {
    this.loadUserProfile();
  },
  methods: {
    loadUserProfile() {
      axiosAgregator.sendGet("/api/v1/profile").then(response => {
        console.log(response.data);
        this.user.username = response.data.username;
      });
    },
    logout(){
      localStorage.clear()
      router.push('/auth').then(() => {
        location.reload();
      });
    }
  }
}
</script>

<template>
  <div class="profile-container">
    <VaCard>
      <VaImage
          :src="'https://img.freepik.com/free-icon/person-street-view-symbol_318-1051.jpg?size=626&ext=jpg'"
          class="h-52"
      />
      <VaCardTitle>
        <h3 class="va-h3">
          {{ this.user.username }}
        </h3>
      </VaCardTitle>
      <VaCardContent>
        <VaButton @click="logout" color="danger">Выйти</VaButton> <!-- Кнопка выхода -->
      </VaCardContent>
    </VaCard>
  </div>
</template>


<style scoped>
.profile-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

.profile-picture {
  width: 100px; /* Ширина изображения */
  height: 100px; /* Высота изображения */
  border-radius: 50%; /* Круглая форма */
  object-fit: cover; /* Сохранение пропорций */
  margin-bottom: 20px; /* Отступ снизу */
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
в