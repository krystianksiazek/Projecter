<template>
  <transition name="fade" mode="out-in">
    <Modal v-if="showModal" @close-modal="showModal = false" />
  </transition>
  <div class="home">
    <ProjectList
      :projects="projects"
      :error="error"
      :projectsCopy="projectsCopy"
      :DBexist="DBexist"
      @open-modal="showModal = true"
    />
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import ProjectList from "@/components/ProjectList.vue";
import projectManagement from "../composables/projectManagement";
import { ref } from "vue";

export default {
  name: "Home",
  components: {
    ProjectList,
    Modal
  },
  setup() {
    const { projects, error, load, DBexist } = projectManagement();
    const showModal = ref(false);
    load();
    const projectsCopy = ref(projects);
    return { projects, error, projectsCopy, DBexist, showModal };
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
