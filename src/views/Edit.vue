<template>
  <div class="editWrapper">
    <transition
      name="slidedown"
      appear
      @before-enter="beforeEnterSlidedown"
      @enter="enterSlidedown"
    >
      <h2 style="margin: 0 0 20px 0">
        Editing a project with id {{ projectId }}
      </h2>
    </transition>
    <transition name="switch" mode="out-in">
      <div class="inputWrapper">
        <input
          class="title"
          type="text"
          v-model="titleEdit"
          placeholder="Title"
        />
        <textarea
          class="description"
          v-model="descriptionEdit"
          placeholder="Description"
          cols="40"
          rows="6"
        ></textarea>
        <button
          :class="{ isValid: isValidTitle && isValidDescryption }"
          class="button addButton"
          @click="modifyProject()"
          :disabled="!isValidTitle && !isValidDescryption"
        >
          Update
        </button>
      </div>
      <!-- <div v-else-if="isLoading && !error">Loading...</div> -->
    </transition>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { openDB } from "idb";
import gsap from "gsap";

export default {
  name: "Edit",
  setup() {
    const router = useRouter();
    const titleEdit = ref("");
    const descriptionEdit = ref("");
    const isValidTitle = ref(true);
    const isValidDescryption = ref(true);
    const projectId = router.currentRoute._rawValue.params.id;
    let db, tx, project, store;
    onMounted(async () => {
      db = await openDB("projectDB", 1, db => {
        db.createObjectStore("projects", { keyPath: "id" });
      });
      getProject();
    });
    async function getProject() {
      callDB();
      project = await tx.objectStore("projects").get(parseFloat(projectId));
      titleEdit.value = project.title;
      descriptionEdit.value = project.description;
    }
    async function modifyProject() {
      callDB();
      project.completed = false;
      project.title = titleEdit.value;
      project.description = descriptionEdit.value;
      project.modified = true;
      project.modifiedDate = getDateOfModify();
      store.put(project);
      router.push("/");
    }
    async function callDB() {
      tx = db.transaction("projects", "readwrite");
      store = tx.objectStore("projects");
    }
    function getDateOfModify() {
      let current = new Date();
      let time =
        addZero(current.getHours()) +
        ":" +
        addZero(current.getMinutes()) +
        ":" +
        addZero(current.getSeconds());
      let date =
        addZero(current.getDate()) +
        "-" +
        addZero(current.getMonth() + 1) +
        "-" +
        current.getFullYear();
      let dateTime = date + " " + time;
      function addZero(dateElement) {
        if (dateElement <= 9) return "0" + dateElement;
        else return dateElement;
      }
      return dateTime;
    }
    const beforeEnterSlidedown = el => {
      el.style.opacity = 0;
      el.style.transform = "translateY(-20px)";
    };
    const enterSlidedown = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.35,
        onComplete: done
      });
    };
    watch(titleEdit, (newValue, oldValue) => {
      if (titleEdit.value != "" && titleEdit.value != " ") {
        isValidTitle.value = true;
      } else isValidTitle.value = false;
    });
    watch(descriptionEdit, (newValue, oldValue) => {
      if (descriptionEdit.value != "" && descriptionEdit.value != " ") {
        isValidDescryption.value = true;
      } else isValidDescryption.value = false;
    });
    return {
      titleEdit,
      descriptionEdit,
      modifyProject,
      projectId,
      beforeEnterSlidedown,
      enterSlidedown,
      isValidTitle,
      isValidDescryption
    };
  }
};
</script>

<style scoped>
.editWrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.inputWrapper {
  width: 40%;
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 25px;
  /* color: #2c3e50; */
  border: 2px solid #808080;
  border-radius: 10px;
  padding: 5px;
}
.description {
  /* color: #2c3e50; */
  font-size: 25px;
  border: 2px solid #808080;
  border-radius: 10px;
  resize: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 5px 0 5px 0;
  padding: 5px;
}
.description:focus {
  border: 2px solid #4289b9;
  transition: 0.5s;
}
.button {
  font-size: 25px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #808080;
  border-radius: 10px;
  transition: 0.1s;
  align-self: center;
  pointer-events: none;
  /* color: #808080; */
}
.button:hover {
  font-size: 26px;
}
.addButton:hover {
  border: 2px solid #42b942;
  color: #42b942;
}
.isValid {
  pointer-events: auto;
  color: #2c3e50;
}
.list-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.list-enter-active {
  transition: all 0.5s ease;
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
.list-leave-active {
  transition: all 0.5s ease;
}
.switch-enter-from,
.switch-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.switch-enter-active,
.switch-leave-active {
  transition: all 0.5s ease;
}
@media (max-width: 1000px) {
  .inputWrapper {
    width: 60%;
    transition: width 0.2s ease;
  }
}
@media (max-width: 800px) {
  .inputWrapper {
    width: 75%;
    transition: width 0.2s ease;
  }
}
@media (max-width: 600px) {
  .inputWrapper {
    width: 90%;
    transition: width 0.2s ease;
  }
}
</style>