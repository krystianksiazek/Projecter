<template>
  <div class="projectWrapper">
    <div class="projectBody">
      <p
        class="id"
        :class="{ idClickable: project.modified || project.completed }"
        @click="showCreatedDate = !showCreatedDate"
      >
        ID: {{ project.id }} |
        <transition name="date-fade" mode="out-in">
          <span v-if="project.completed && !showCreatedDate">
            <span v-if="completedDateToTemplate">
              <b>Completed:</b> {{ completedDateToTemplate }}
            </span>
            <span v-if="!completedDateToTemplate">
              <b>Completed:</b> {{ project.completedDate }}
            </span>
          </span>
          <span
            v-else-if="
              project.modified && !showCreatedDate && !project.completed
            "
          >
            <b>Last modified:</b> {{ project.modifiedDate }}
          </span>
          <span v-else> <b>Created:</b> {{ project.createdDate }} </span>
        </transition>
      </p>
      <h2
        class="title"
        :class="{ projectDone: project.completed }"
        @click.self="showDetails = !showDetails"
      >
        {{ project.title }}
        <span
          v-if="!below600px"
          :class="{ rotateUp: showDetails }"
          class="material-icons rotateDown"
          @click="showDetails = !showDetails"
        >
          arrow_downward
        </span>
      </h2>
      <span
        v-if="below600px"
        :class="{ rotateUp: showDetails }"
        class="material-icons rotateDown"
        @click="showDetails = !showDetails"
      >
        arrow_downward
      </span>
      <p
        class="description"
        v-if="showDetails"
        :class="{ projectDone: project.completed }"
      >
        {{ project.description }}
      </p>
    </div>
    <div v-if="showDetails" class="buttonWrapper">
      <div
        class="button doneButton"
        :class="{ doneButtonCompleted: project.completed }"
        @click="projectCompleted(project.id, project.completed)"
      >
        <span v-if="project.completed" class="material-icons"> remove </span>
        <span v-if="!project.completed" class="material-icons"> done </span>
      </div>
      <div class="button editButton" @click="projectEdit(project.id)">
        <span class="material-icons"> edit </span>
      </div>
      <div class="button removeButton" @click="projectRemoved(project.id)">
        <span class="material-icons"> delete </span>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";

export default {
  props: ["project", "removeOnComplete", "below600px"],

  setup(props, context) {
    const router = useRouter();
    const showDetails = ref(false);
    const showCreatedDate = ref(false);
    const completedDateToTemplate = ref(null);
    let db, tx, project, store, openRequest;
    onMounted(() => {
      openRequest = indexedDB.open("projectDB", 1);
      openRequest.onerror = function() {
        console.error("Error", openRequest.error);
      };
      openRequest.onsuccess = function() {
        db = openRequest.result;
      };
    });
    function projectCompleted(id, completed) {
      tx = db.transaction("projects", "readwrite");
      store = tx.objectStore("projects");
      project = tx.objectStore("projects").get(id);
      project.onerror = function() {
        console.error("Error", openRequest.error);
      };
      project.onsuccess = function() {
        project.result.completedDate = getDateOfComplete();
        completedDateToTemplate.value = project.result.completedDate;
        project.result.completed = !completed;
        if (!project.result.completed) {
          project.result.completedDate = null;
          completedDateToTemplate.value = null;
        }
        store.put(project.result);
      };
      if (props.removeOnComplete && !completed) {
        projectRemoved(id);
      }
      context.emit("completed", !completed, id);
    }
    async function projectRemoved(id) {
      tx = db.transaction("projects", "readwrite");
      await tx.objectStore("projects").delete(id);
      context.emit("removed", id);
    }
    function projectEdit(id) {
      router.push("/project/" + id);
    }
    function getDateOfComplete() {
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
    return {
      projectCompleted,
      projectRemoved,
      projectEdit,
      showDetails,
      showCreatedDate,
      completedDateToTemplate
    };
  }
};
</script>

<style scoped>
.description {
  white-space: pre-line;
  font-size: 18px;
}
.id {
  font-size: 14px;
  margin: 0;
}
.idClickable {
  cursor: pointer;
}
.rotateUp {
  rotate: 180deg;
}
.rotateDown,
.rotateUp {
  cursor: pointer;
  user-select: none;
  transition: all 0.25s ease;
}
.projectWrapper {
  display: flex;
  justify-content: space-between;
  transition: height 0.2s ease;
}
.buttonWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.button {
  font-size: 25px;
  width: 50px;
  height: 50px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #808080;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
}
.button:hover {
  font-size: 30px;
  transition: 0.2s;
}
img {
  width: 40px;
  height: 40px;
}
.title {
  cursor: pointer;
  user-select: none;
  margin: 10px 0 15px 0;
}
@media (max-width: 600px) {
  .projectWrapper {
    align-items: center;
    flex-direction: column;
  }
  .projectBody {
    text-align: center;
  }
  .buttonWrapper {
    display: flex;
    flex-direction: row;
  }
}
.date-fade-enter-active,
.date-fade-leave-active {
  transition: opacity 0.3s ease;
}
.date-fade-enter-from,
.date-fade-leave-to {
  opacity: 0;
}
</style>
