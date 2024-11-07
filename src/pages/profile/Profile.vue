<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { VaInput, VaButton } from 'vuestic-ui';
import defaultLogo from '@/assets/default_logo.jpg';
import axiosAgregator from "@/server/axiosAgregator.js";

const user = ref({
  username: '',
  email: '',
  profilePicture: defaultLogo,
});

const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

onMounted(() => {
  loadUserProfile();
});

const logout = () => {

  localStorage.clear()
  router.push('/login').then(() => {
    location.reload();
  });
};

const loadUserProfile = async () => {
  const response = await axiosAgregator.sendGet("/api/v1/profile");

  if (response.status === 200 && response.data.username) {
    user.username = response.data.username;
    console.log( user.username)
  } else {
    alert("Сервер тупит");
  }
};
</script>

<template>
  <div class="profile-container">
    <div class="header">
      <img :src="user.profilePicture" alt="Profile Picture" class="profile-picture"/>
      <h2>Профиль пользователя {{ user.username}}</h2>
    </div>

    <div class="form-container">
      <VaInput v-model="user.username" label="Имя" :placeholder="user.username || 'Введите ваше имя'" />
      <VaInput v-model="user.email" label="Email" type="email" placeholder="Введите ваш email" />

      <VaButton @click="updateUserData" color="primary">Сохранить изменения</VaButton>
      <VaButton @click="logout" color="danger">Выйти</VaButton> <!-- Кнопка выхода -->

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
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