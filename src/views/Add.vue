<template>
  <div class="addWrapper">
    <transition
      name="slidedown"
      appear
      @before-enter="beforeEnterSlidedown"
      @enter="enterSlidedown"
    >
      <h2 style="margin: 0 0 20px 0">Create a new project</h2>
    </transition>
    <transition name="list" appear>
      <div class="inputWrapper">
        <input class="title" type="text" v-model="title" placeholder="Title" />
        <textarea
          class="description"
          v-model="description"
          placeholder="Description"
          cols="40"
          rows="6"
        ></textarea>
        <button
          :class="{ isValid: isValidTitle && isValidDescryption }"
          class="button addButton"
          @click="createProject"
          :disabled="!isValidTitle && !isValidDescryption"
        >
          Save
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import projectManagement from "../composables/projectManagement";

export default {
  name: "Add",
  setup() {
    const { makeDB } = projectManagement();
    const router = useRouter();
    const title = ref("");
    const description = ref("");
    const isValidTitle = ref(false);
    const isValidDescryption = ref(false);
    function createProject() {
      makeDB();
      let newProject = {
        id: getID(),
        title: title.value,
        description: description.value,
        createdDate: getDateOfCreate(),
        modified: false,
        modifiedDate: null,
        completed: false,
        completedDate: null
      };
      addProject(newProject);
    }
    function getID() {
      return Math.floor(Math.random() * 1000000);
    }
    function getDateOfCreate() {
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
    function addProject(project) {
      let openRequest = indexedDB.open("projectDB", 1);
      openRequest.onupgradeneeded = function() {
        let db = openRequest.result;
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", {
            keyPath: "id",
            autoIncrement: false
          });
        }
      };
      openRequest.onerror = function() {
        console.error("Error", openRequest.error);
      };
      openRequest.onsuccess = function() {
        let db = openRequest.result;
        let object = db.transaction("projects", "readwrite");
        let projects = object.objectStore("projects");
        let test = projects.get(project.id);
        function addRequest(projectModified) {
          let request = projects.add(projectModified);
          request.onsuccess = function() {
            router.push("/");
            console.log(
              "Project added - id: " +
                request.result +
                ", title: " +
                project.title
            );
          };
          request.onerror = function() {
            console.log("Error", request.error);
          };
        }
        test.onsuccess = function() {
          if (test.result == undefined) {
            addRequest(project);
          } else {
            project.id = getID();
            addRequest(project);
          }
        };
        test.onerror = function() {
          console.log("Error", request.error);
        };
      };
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
    watch(title, (newValue, oldValue) => {
      if (title.value != "" && title.value != " ") {
        isValidTitle.value = true;
      } else isValidTitle.value = false;
    });
    watch(description, (newValue, oldValue) => {
      if (description.value != "" && description.value != " ") {
        isValidDescryption.value = true;
      } else isValidDescryption.value = false;
    });
    return {
      title,
      description,
      createProject,
      beforeEnterSlidedown,
      enterSlidedown,
      isValidTitle,
      isValidDescryption
    };
  }
};
</script>

<style scoped>
.addWrapper {
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
.description:focus,
.title:focus {
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
