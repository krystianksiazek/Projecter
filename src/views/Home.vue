<template>
  <div class="home">
    <ProjectList
      :projects="projects"
      :error="error"
      :projectsCopy="projectsCopy"
      :DBexist="DBexist"
    />
  </div>
</template>

<script>
import ProjectList from "@/components/ProjectList.vue";
import projectManagement from "../composables/projectManagement";
import { ref } from "vue";

export default {
  name: "Home",
  components: {
    ProjectList
  },
  setup() {
    const { projects, error, load, DBexist } = projectManagement();
    load();
    const projectsCopy = ref(projects);
    return { projects, error, projectsCopy, DBexist };
  }
};
</script>
