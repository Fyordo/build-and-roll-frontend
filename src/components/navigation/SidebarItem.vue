<template>
  <RouterLink :to="{ path: this.active ? this.link : '#' }">
    <VaSidebarItem :disabled="!this.active">
      <VaSidebarItemContent>
        <VaIcon :name="this.icon"/>
        <VaSidebarItemTitle>
          {{ this.title }}
        </VaSidebarItemTitle>
      </VaSidebarItemContent>
    </VaSidebarItem>
  </RouterLink>
</template>

<script>
import {RouterLink} from "vue-router";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    }
  },
  components: {RouterLink},
};
</script>

<style>
</style>
