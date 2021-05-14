<template>
  <h2>Welcome to <span class="logo">Projecter</span></h2>
  <div id="nav">
    <router-link class="material-icons navButton" to="/">home</router-link>
    <input
      type="checkbox"
      id="theme-switch"
      class="theme-switch"
      v-model="darkMode"
    />
    <label for="theme-switch">
      <span v-if="darkMode" class="material-icons themeIcon"> light_mode </span>
      <span v-else class="material-icons themeIcon"> dark_mode </span>
    </label>
    <router-link class="material-icons navButton" to="/add">
      add_box
    </router-link>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
  setup() {
    const darkMode = ref(false);
    onMounted(() => {
      let bodyElement = document.body;
      bodyElement.classList.add("app-background");
      let htmlElement = document.documentElement;
      let theme = localStorage.getItem("theme");
      if (theme === "dark") {
        htmlElement.setAttribute("theme", "dark");
        darkMode.value = true;
      } else {
        htmlElement.setAttribute("theme", "light");
        darkMode.value = false;
      }
    });
    watch(darkMode, () => {
      let htmlElement = document.documentElement;
      if (darkMode.value) {
        localStorage.setItem("theme", "dark");
        htmlElement.setAttribute("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
        htmlElement.setAttribute("theme", "light");
      }
    });
    return { darkMode };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 10px 30px 10px 30px;
  display: flex;
  justify-content: center;
}

#nav a {
  font-size: 36px;
  margin: 0 20px 0 20px;
  color: #2c3e50;
  text-decoration: none;
}
#nav a:hover {
  transition: 0.2s;
}
#nav a:active {
  transition: 0.2s;
  color: #42b983 !important;
}
.themeIcon {
  font-size: 34px;
}
.logo {
  text-decoration: underline;
  color: #42b983;
}
#nav a.router-link-exact-active {
  color: #42b983;
  pointer-events: none;
}
</style>