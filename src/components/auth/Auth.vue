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

  localStorage.setItem("token", 'token');
  router.push("/");
  // try {
  //   // const response = await axiosAgregator.sendPost("/auth/login", {
  //   //   login: email,
  //   //   password: password,
  //   // });
  //
  //
  //   // if (response.status === 200 && response.data.token) {
  //   //   localStorage.setItem("jwt", response.data.token);
  //   //   localStorage.setItem("userId", response.data.id);
  //   //   this.$router.push("/shelf");
  //   // } else {
  //   //   alert("Сервер тупит");
  //   // }
  // } catch (error) {
  //   if (error.response && error.response.status === 400) {
  //     alert("Неверно введены данные");
  //   } else {
  //     alert("Произошла вот эта жопа:", error);
  //   }
  // }
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
</style>