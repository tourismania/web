<template>
  <main>
	  <div class="main__not-found">
		  <div>
			  <h1>Вы улетели не туда</h1>
		  </div>
		  <div>
			  <RouterLink to="/"><p>Вернитесь домой</p></RouterLink>
		  </div>
	  </div>
  </main>
</template>
<style lang="scss" scoped>
.main__not-found {
	display: flex;
	text-align: center;
	align-items: center;
	flex-direction: column;
	height: 100vh;
	align-content: center;
	justify-content: center;
	background-position: center;
	background-size: cover;
	color: white;
	background-image: url('../assets/images/background_main.jpg');

	& a {
		color: white;
		text-decoration: underline;
	}
}
</style>
