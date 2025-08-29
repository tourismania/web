<template>
  <main>
    <div class="main__welcome">
      <img src="@/assets/logos/logo_main_transparent.png" alt="">
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main__welcome {
  display: flex;
  text-align: center;
  align-items: center;
  height: 100vh;
  align-content: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
  color: white;
  background-image: url('../assets/images/background_main.png');

  & img {
    width: 300px;
  }
}
</style>
