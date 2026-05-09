<script lang="ts">
import {defineComponent, ref} from 'vue'
import {Auth} from "@/api/auth.ts";

interface ValidationRule {
  (value: string): boolean | string;
}

export default defineComponent({
  name: "LoginForm",
  setup: function() {

    const email = ref<string>('');
    const password = ref<string>('');
    const errorMessage = ref<string>('');

    const loading = ref<boolean>(false);

    const emailRules: ValidationRule[] = [
        (value: string): boolean | string => {
          if (value && value.trim() !== '') return true;
          return 'Вы должны ввести почту';
        },
        (value: string): boolean | string => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(value)) return true;
          return 'Введите корректный email адрес';
        }
    ];

    const passwordRules: ValidationRule[] = [
      (value: string): boolean | string => {
        if (value && value.trim() !== '') return true;
        return 'Вы должны ввести пароль';
      },
    ];

    const onSubmit = (): void => {

      errorMessage.value = ''
      loading.value = true;

      const api = new Auth();
      api.login(email.value, password.value)
          .then(() => {
            location.assign('/');
          })
          .catch((reason: string) => {
            errorMessage.value = reason;
          })
          .finally(() => {
            loading.value = false;
          });
    };

    return {
      email,
      password,
      emailRules,
      errorMessage,
      passwordRules,
      onSubmit,
      loading
    };
  }
});
</script>

<template>
  <v-sheet class="mx-auto w-xs-75 w-sm-75 w-md-33 w-lg-33 w-xl-33 ">
    <v-card :disabled="loading" :loading="loading" theme="myCustomDarkTheme" class="mx-auto px-6 py-8 custom-v-card-loader-full-loading">
      <template v-slot:loader="{ isActive }">
        <v-progress-circular
            color="red"
            :active="isActive"
            indeterminate
            v-show="loading"
        ></v-progress-circular>
      </template>

      <v-card-title>
        <h4>Вход в личный кабинет</h4>
      </v-card-title>
      <v-alert
          v-show="errorMessage !== ''"
          border="top"
          type="error"
          variant="outlined"
          class="custom-v-alert__content"
          prominent
      >
        {{ errorMessage }}
      </v-alert>
      <br>
      <v-form
          @submit.prevent="onSubmit"
          class="custom-v-form-bold"
      >
        <v-text-field
            v-model="email"
            :readonly="loading"
            :rules="emailRules"
            class="mb-2"
            label="Email"
            type="email"
            clearable
        ></v-text-field>

        <v-text-field
            v-model="password"
            :readonly="loading"
            :rules="passwordRules"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            clearable
        ></v-text-field>

        <br>
        <v-btn
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            block
        >
          Войти
        </v-btn>
      </v-form>

      <v-card-actions class="flex-column">
        <RouterLink to="/"><p>Вернитесь домой</p></RouterLink>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<style scoped lang="scss">
</style>
