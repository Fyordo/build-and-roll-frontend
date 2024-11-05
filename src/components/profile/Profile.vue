<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { VaInput, VaButton } from 'vuestic-ui';

const user = ref({
  name: '',
  email: '',
  // Другие поля пользователя, если необходимо
});

const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();
</script>

<template>
  <div class="profile-container">
    <h2>Профиль пользователя</h2>

    <VaInput v-model="user.name" label="Имя" placeholder="Введите ваше имя" />
    <VaInput v-model="user.email" label="Email" type="email" placeholder="Введите ваш email" />

    <VaButton @click="updateUserData" color="primary">Сохранить изменения</VaButton>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
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