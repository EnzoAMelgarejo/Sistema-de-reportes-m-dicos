<template>
  <div class="layout" :class="{ 'navbar-collapsed': isNavbarCollapsed }">
    <NavBar v-if="showNavbar" @toggle="isNavbarCollapsed = $event" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, watch, computed, ref } from 'vue'
import NavBar from './components/NavBar.vue'

const router = useRouter()
const route = useRoute()
const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

const isNavbarCollapsed = ref(false)

const showNavbar = computed(() => route.name !== 'Welcome')

onMounted(() => {
  watch(
    () => route.fullPath,
    async () => {
      if (isLoading.value) return

      if (route.meta.requiresAuth && !isAuthenticated.value) {
        await loginWithRedirect({
          appState: { targetUrl: route.fullPath },
        })
      }

      if (route.name === 'Welcome' && isAuthenticated.value) {
        router.replace('/home')
      }
    },
    { immediate: true }
  )
})
</script>

