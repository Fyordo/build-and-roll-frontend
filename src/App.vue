<script setup>
import {onMounted, ref} from 'vue';
import {useBreakpoint} from 'vuestic-ui';
import SidebarItem from "@/components/navigation/SidebarItem.vue";

const showSidebar = ref(true)

let isAuth = localStorage.getItem('token') !== null;

const breakpoints = useBreakpoint()

const sidebarRoutes = [
  {title: "Конструктор", link: "/constructor", icon: "dataset", active: true},
  {title: "Заклинания", link: "/spells", icon: "star", active: true},
  {title: "Оружие", link: "/weapons", icon: "colorize", active: true},
  {title: "Комната", link: "/room", icon: "house", active: true},
];

import {computed} from 'vue';
import {useColors} from "vuestic-ui";

const {applyPreset, currentPresetName} = useColors();

const switchValue = computed({
  get() {
    return currentPresetName.value
  },
  set(value) {
    localStorage.setItem('theme', value)
    applyPreset(value)
  }
})

onMounted(() => {
  localStorage.setItem('theme', 'dark');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyPreset(savedTheme);
  }
});


</script>

<template>
  <VaLayout
      style="height: 100vh"
      :left="{ absolute: breakpoints.smDown }"
  >
    <template #top>
      <VaNavbar color="primary" class="py-2">
        <template #left>
          <VaButton :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar"/>
        </template>
        <template #center>
          <VaNavbarItem class="font-bold text-lg">
            <h1>Build&Roll</h1>
          </VaNavbarItem>
        </template>
        <template #right>
          <div class="flex items-center gap-5">
            <VaSwitch
                v-model="switchValue"
                true-value="dark"
                false-value="light"
                color="#333333"
                off-color="#ffd300"
            />
          </div>
        </template>
      </VaNavbar>
    </template>

    <template #left>
      <VaSidebar
          :minimized="!showSidebar"
          minimized-width="60px">
        <SidebarItem v-for="item in sidebarRoutes" :title="item.title" :link="item.link" :icon="item.icon"
                     :active="item.active"/>
        <VaSpacer/>
        <SidebarItem v-if="isAuth" title="Профиль" link="/profile" icon="person" active/>
        <SidebarItem v-else title="Авторизация" link="/auth" icon="person" active/>
      </VaSidebar>
    </template>

    <template #content>
      <div class="main-container">
        <RouterView/>
      </div>
    </template>
  </VaLayout>
</template>

<style scoped>
.main-container {
  margin: 20px;
}
</style>