<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { VaInput, VaButton } from 'vuestic-ui';
import axiosAgregator from "@/server/axiosAgregator.js";


const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = ''; // Сброс сообщения об ошибке
  localStorage.clear();

  const response = await axiosAgregator.sendPost("/api/v1/auth/login", {
    username: email.value,
    password: password.value,
  });

  if (response.status === 200 && response.data.accessToken) {
    localStorage.setItem("access_token", response.data.accessToken);
    localStorage.setItem("refresh_token", response.data.refreshToken);
    await loadUserProfile();
    router.push('/').then(() => {
      location.reload();
    });
  } else {
    alert("Сервер тупит");
  }
};

const loadUserProfile = async () => {
  const response = await axiosAgregator.sendGet("/api/v1/profile");

  if (response.status === 200 && response.data.username) {
    //console.log( response.data)
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('userId', response.data.id);
  } else {
    alert("Сервер тупит");
  }
};

</script>

<template>
  <div class="auth-container">
    <h2>Вход</h2>
    <VaInput v-model="email" label="Email" type="email" placeholder="Введите ваш email" />
    <VaInput v-model="password" label="Пароль" type="password" placeholder="Введите ваш пароль" />

    <VaButton @click="handleLogin" color="primary">Войти</VaButton>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>

  <p class="register-link">Нет аккаунта? <router-link to="/register">Зарегистрируйтесь</router-link></p>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.register-link {
  margin-top: 20px; /* Добавьте отступ сверху для лучшего визуального восприятия */
  text-align: center; /* Центрируем текст */
}
</style>