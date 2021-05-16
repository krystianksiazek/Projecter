<template>
  <div class="dimmer" @click.self="$emit('close-modal')">
    <transition name="component" appear>
      <div class="modalWrapper">
        <a class="close" @click="$emit('close-modal')" />
        <div class="content">
          <h2>Delete all saved data such as database and cookies?</h2>
          <h4>All tasks will be deleted!</h4>
          <div class="buttons">
            <div @click="removeDB(), removeCookies(), afterRemove()" class="checkbox confirm">
              <span> Yes, remove </span>
            </div>
            <div @click="$emit('close-modal')" class="checkbox reject">
              <span> No, leave it </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import router from '@/router';
import removeAllData from "../composables/removeAllData";

export default {
  name: "Modal",
  setup() {
    const { removeDB, removeCookies } = removeAllData();
    function afterRemove() {
      window.location.reload()
    }
    return {
      removeDB,
      removeCookies,
      afterRemove
    };
  }
};
</script>
<style lang="scss" scoped>
.dimmer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.6);
}
.modalWrapper {
  width: 40%;
  position: absolute;
  border-radius: 10px;
  border: 2px solid #42b983;
  z-index: 3;
  @media (max-width: 1000px) {
    width: 80%;
  }
}
.content {
  color: #2c3e50;
  justify-content: center;
  align-items: center;
  padding: 20px;
  display: flex;
  height: auto;
  flex-direction: column;
}
.checkbox {
  margin: 5px;
  padding: 6px;
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
.buttons {
  display: flex;
}
.confirm,
.reject {
  cursor: pointer;
}
.confirm:hover {
  border-color: #b94242;
  color: #b94242;
}
.reject:hover {
  border-color: #42b942;
  color: #42b942;
}
.close {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
  margin: 10px;
  z-index: 1;
}
.close:before,
.close:after {
  position: absolute;
  left: 13px;
  content: " ";
  height: 30px;
  width: 3px;
}
.close:hover:before,
.close:hover:after {
  transition: 0.2s;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
.component-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.component-enter-active {
  transition: all 0.5s ease;
}
.component-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.component-leave-active {
  transition: all 0.5s ease;
}
</style>
