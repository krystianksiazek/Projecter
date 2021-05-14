<template>
  <Navbar />
  <router-view v-slot="{ Component }">
    <transition
      name="route"
      mode="out-in"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<script>
import gsap from "gsap";
import Navbar from './components/Navbar.vue';

export default {
  name: "App",
  components: { Navbar },
  setup() {
    const beforeEnter = (el) => {
      el.style.opacity = 0.5;
      el.style.transform = "translateX(100px)";
    };
    const enter = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        onComplete: done,
      });
    };
    const beforeLeave = (el) => {
      el.style.opacity = 1;
    };
    const leave = (el, done) => {
      gsap.to(el, {
        keyframes: [
          { opacity: 0, transform: "translateX(-100px)", delay: 0.5 },
        ],
        onComplete: done,
      });
    };
    
    return { beforeEnter, enter, beforeLeave, leave };
  },
};
</script>

<style>

</style>
