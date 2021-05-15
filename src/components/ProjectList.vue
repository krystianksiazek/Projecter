<template>
  <div>
    <div class="optionsWrapper">
      <div :class="{ checkboxChecked: sortOption != 0 }" class="checkbox">
        <span
          class="material-icons sorterNavigation"
          data-v-9c9b7d9e=""
          @click="sortToggleDown()"
        >
          arrow_downward
        </span>
        <transition :name="switchSortingDirection" mode="out-in">
          <span class="checked sorter" v-if="sortOption == 1">
            Only not completed
          </span>
          <span class="checked sorter" v-else-if="sortOption == 2">
            Only completed
          </span>
          <span class="checked sorter" v-else-if="sortOption == 3">
            First not completed
          </span>
          <span class="checked sorter" v-else-if="sortOption == 4">
            First completed
          </span>
          <span class="checked sorter" v-else-if="sortOption == 5">
            First newest
          </span>
          <span class="checked sorter" v-else-if="sortOption == 6">
            First oldest
          </span>
          <span class="sorter" v-else-if="sortOption == 0">Unsorted list</span>
        </transition>
        <span
          class="material-icons sorterNavigation"
          data-v-9c9b7d9e=""
          @click="sortToggleUp()"
        >
          arrow_upward
        </span>
      </div>
      <span
        @click="$emit('open-modal')"
        class="material-icons deleteAllDataBtn"
      >
        delete_forever
      </span>
      <div
        @click="removeOnCompleteToggle()"
        :class="{ checkboxChecked: removeOnComplete }"
        class="checkbox removeOnCompleteBtn"
      >
        <transition name="switchSortingUp" mode="out-in">
          <span class="checked" v-if="removeOnComplete">
            Remove on complete
          </span>
          <span v-else>Don't remove on complete</span>
        </transition>
      </div>
    </div>
    <div>
      <transition name="switch" mode="out-in">
        <div class="projects" v-if="projectsCopy.length">
          <transition-group
            appear
            name="list"
            @before-enter="beforeEnter"
            @enter="enter"
            @before-leave="beforeLeave"
            @leave="leave"
          >
            <div
              v-for="(project, index) in projectsCopySorter(sortOption)"
              v-if="projectsCopySorter(sortOption).length"
              :key="project.id"
              :data-index="index"
              class="project"
              :class="{ completed: project.completed }"
            >
              <SingleProject
                :project="project"
                :removeOnComplete="removeOnComplete"
                :below600px="below600px"
                @completed="onComplete"
                @removed="onRemove"
              />
            </div>
            <h2 v-else-if="!projectsCopySorter(sortOption).length">
              Nothing matches
            </h2>
          </transition-group>
        </div>
        <h2 v-else-if="error" style="color: #b94242">{{ error }}</h2>
        <div v-else-if="showAllDone && !projectsCopy.length && !error.length">
          <h2 v-if="DBexist">All done!</h2>
          <h2 v-if="!DBexist">
            Click the
            <span class="material-icons navButton" to="/add">add_box</span> icon
            to create the database and add the first project/task.
          </h2>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import SingleProject from "./SingleProject.vue";
import { ref, onMounted } from "vue";
import gsap from "gsap";
import projectManagement from "../composables/projectManagement";

export default {
  name: "List",
  components: { SingleProject },
  props: ["projects", "error", "projectsCopy", "DBexist"],
  setup(props) {
    const { setCookie, getCookieValue } = projectManagement();
    const sortOption = ref(getSortBy());
    const showAllDone = ref(false);
    const removeOnComplete = ref(getRemoveOnComplete());
    const below600px = ref(null);
    const switchSortingDirection = ref(null);
    checkForAllDone();
    function checkForAllDone() {
      setTimeout(function() {
        if (!props.projectsCopy.length) {
          showAllDone.value = true;
        }
      }, 500);
    }
    function setSortBy(sortOption) {
      if (props.DBexist) {
        setCookie("sorterOption", sortOption, 365);
      }
    }
    function setRemoveOnComplete(sortOption) {
      if (props.DBexist) {
        setCookie("removeOnComplete", sortOption, 365);
      }
    }
    function getSortBy() {
      if (!props.DBexist) {
        return 0;
      } else if (getCookieValue("sorterOption") == "") {
        return 5;
      } else {
        return parseFloat(getCookieValue("sorterOption"));
      }
    }
    function getRemoveOnComplete() {
      return getCookieValue("removeOnComplete");
    }
    function projectsCopySorter(sortBy) {
      switch (sortBy) {
        case 0:
          return props.projectsCopy.sort((projectA, projectB) =>
            projectA.id > projectB.id ? 1 : -1
          );
        case 1:
          return props.projectsCopy.filter(
            project => project.completed === false
          );
        case 2:
          return props.projectsCopy.filter(
            project => project.completed === true
          );
        case 3:
          return props.projectsCopy.sort((a, b) =>
            a.completed > b.completed ? 1 : -1
          );
        case 4:
          return props.projectsCopy.sort((a, b) =>
            a.completed < b.completed ? 1 : -1
          );
        case 5:
          return props.projectsCopy.sort((a, b) =>
            a.createdDate < b.createdDate ? 1 : -1
          );
        case 6:
          return props.projectsCopy.sort((a, b) =>
            a.createdDate > b.createdDate ? 1 : -1
          );
      }
    }
    function onComplete(complete, id) {
      const index = props.projectsCopy.findIndex(project => project.id == id);
      props.projectsCopy[index].completed = complete;
    }
    function onRemove(id) {
      props.projectsCopy.splice(
        props.projectsCopy.map(e => e.id).indexOf(id),
        1
      );
      checkForAllDone();
    }
    function sortToggleUp() {
      switchSortingDirection.value = "switchSortingUp";
      if (sortOption.value < 6) {
        sortOption.value++;
      } else if (sortOption.value == 6) {
        sortOption.value = 0;
      }
      setSortBy(sortOption.value);
    }
    function sortToggleDown() {
      switchSortingDirection.value = "switchSortingDown";
      if (sortOption.value > 0) {
        sortOption.value--;
      } else if (sortOption.value == 0) {
        sortOption.value = 6;
      }
      setSortBy(sortOption.value);
    }
    function removeOnCompleteToggle() {
      removeOnComplete.value = !removeOnComplete.value;
      setRemoveOnComplete(removeOnComplete.value);
    }
    const beforeEnter = el => {
      el.style.opacity = 0;
      el.style.transform = "translateY(100px)";
    };
    const enter = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        onComplete: done,
        delay: el.dataset.index * 0.2
      });
    };
    const beforeLeave = el => {
      el.style.opacity = 1;
    };
    const leave = (el, done) => {
      gsap.to(el, {
        keyframes: [
          { opacity: 0.5, duration: 0.2 },
          { opacity: 0, height: 0, padding: 0, margin: 0, duration: 0.4 },
          { border: 0, duration: 0.1 }
        ],
        onComplete: done
      });
    };
    onMounted(
      (window.onresize = () => {
        if (screen.width <= 600) {
          below600px.value = true;
        } else below600px.value = false;
      })
    );
    return {
      onComplete,
      onRemove,
      beforeEnter,
      enter,
      beforeLeave,
      leave,
      projectsCopySorter,
      sortOption,
      sortToggleUp,
      sortToggleDown,
      removeOnComplete,
      removeOnCompleteToggle,
      below600px,
      showAllDone,
      switchSortingDirection
    };
  }
};
</script>

<style scoped>
.completed {
  border-left: 15px solid #42b983 !important;
}
.projects {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.project {
  border-left: 15px solid #b94242;
  border-top: 5px solid grey;
  border-bottom: 5px solid grey;
  border-right: 5px solid grey;
  margin-bottom: 20px;
  padding: 10px;
  width: 60%;
  text-align: left;
  border-radius: 10px;
  transition: width 0.2s ease;
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
.switchSortingUp-enter-from {
  transform: translateY(15px);
  opacity: 0;
}
.switchSortingUp-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}
.switchSortingDown-enter-from {
  transform: translateY(-15px);
  opacity: 0;
}
.switchSortingDown-leave-to {
  transform: translateY(15px);
  opacity: 0;
}
.switchSortingUp-enter-active,
.switchSortingUp-leave-active,
.switchSortingDown-enter-active,
.switchSortingDown-leave-active {
  transition: all 0.25s ease;
}
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #2196f3;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
.optionsWrapper {
  display: flex;
  justify-content: center;
}
.checkbox {
  margin: 5px;
  width: 250px;
  height: 35px;
  font-size: 15px;
  border: 2px solid #808080;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: 0.2s;
  letter-spacing: 1px;
}
.deleteAllDataBtn {
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
}
.sorter {
  flex-grow: 4;
}
.sorterNavigation {
  cursor: pointer;
}
.removeOnCompleteBtn {
  cursor: pointer;
}
.sorterNavigation:hover {
  transition: 0.2s;
}
.sorterNavigation:active {
  color: #42b983;
  transition: 0.2s;
}
.sorterNavigation:nth-child(1) {
  margin-left: 5px;
}
.sorterNavigation:nth-child(3) {
  margin-right: 5px;
}
.checked {
  color: #42b983;
  text-decoration: underline;
}
.checkboxChecked {
  border: 2px solid #42b983;
}

@media (max-width: 1000px) {
  .project {
    width: 70%;
    transition: width 0.2s ease;
  }
}
@media (max-width: 800px) {
  .project {
    width: 80%;
    transition: width 0.2s ease;
  }
}
@media (max-width: 600px) {
  .project {
    width: 90%;
    transition: width 0.2s ease;
  }
  .checkbox {
    font-size: 13px;
    width: 210px;
  }
}
</style>