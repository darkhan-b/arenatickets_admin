<template>
  <div class="vh-100">
    <n-space justify="center" align="center" vertical class="h-100">
      <img class="logo-img" src="/images/logo_writing.svg" alt="arenatickets" />
      <n-card
        title="Авторизация"
        class="card-form mt-10"
        header-style="text-align: center">
        <n-space vertical>
          <n-input
            v-model:value="email"
            class="form-control"
            :status="errors && errors['email'] ? 'error' : ''"
            type="text"
            placeholder="Логин" />
          <n-input
            type="password"
            class="form-control"
            show-password-on="click"
            @keydown.enter="login"
            placeholder="Пароль"
            :minlength="8"
            :status="errors && errors['password'] ? 'error' : ''"
            v-model:value="password">
            <template #password-visible-icon>
              <n-icon :size="16" :component="GlassesOutline" />
            </template>
            <template #password-invisible-icon>
              <n-icon :size="16" :component="Glasses" />
            </template>
          </n-input>

          <n-button
            :loading="loading"
            @click="login"
            text
            class="mt-10 btn-themed"
            block>
            Войти
          </n-button>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { NButton, NCard, NIcon, NInput, NSpace } from 'naive-ui'
import { ref } from 'vue'
import { GlassesOutline, Glasses } from '@vicons/ionicons5'
import { useGeneralStore } from '@/stores/general.store'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const generalStore = useGeneralStore()
const authStore = useAuthStore()
const { errors, loading } = storeToRefs(generalStore)
const router = useRouter()

const login = async () => {
  const res = await authStore.login({
    email: email.value,
    password: password.value
  })
  if (res) {
    await router.push({ name: 'statistics' })
  }
}
</script>

<style scoped lang="scss">
.card-form {
  width: 350px;
}
.logo-img {
  width: 100%;
  max-width: 180px;
}
@media screen and (max-width: 576px) {
  .card-form {
    width: calc(100vw - 40px);
  }
}
</style>
