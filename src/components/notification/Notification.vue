<!-- Notification.vue -->
<template>
  <div class="notification" v-if="message">
    {{ message }}
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  message: String,
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 50px;
  right: 20px;
  background-color: #f0ad4e;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>
