<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { VaInput, VaButton } from 'vuestic-ui';
import axiosAgregator from "@/server/axiosAgregator.js";

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const router = useRouter();

localStorage.clear();

const handleRegister = async () => {
  errorMessage.value = ''; // Сброс сообщения об ошибке

  try {
    const response = await axiosAgregator.sendPost("/api/v1/auth/register", {
      username: email.value,
      password: password.value,
    });

    if (response.status === 200) {
      alert("Регистрация прошла успешно!");
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      router.push('/auth').then(() => {
        location.reload();
      });
    } else {
      errorMessage.value = response.data.message || "Ошибка регистрации";
    }
  } catch (error) {
    errorMessage.value = "Ошибка сервера";
  }
};
</script>

<template>
  <div class="auth-container">
    <h2 class="va-h2">Регистрация</h2>
    <VaInput v-model="email" label="Имя пользователя" type="email" placeholder="Введите ваше имя" />
    <br>
    <br>
    <VaInput v-model="password" label="Пароль" type="password" placeholder="Введите ваш пароль" />
    <br>
    <br>
    <br>

    <VaButton @click="handleRegister" color="primary" class="register-button">Зарегистрироваться</VaButton>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
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

.register-button {
  margin-top: 20px; /* Установите нужный отступ */
}
</style>
