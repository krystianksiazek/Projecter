<template>
  <div class="dimmer" @click.self="$emit('close-modal')">
    <div class="modalWrapper">
      <a class="close" @click="$emit('close-modal')" />
      <div class="content">
        <h2>Delete all saved data such as database and cookies?</h2>
        <h4>All tasks will be deleted!</h4>
        <div class="buttons">
          <div class="checkbox removeOnCompleteBtn">
            <span> Yes, remove </span>
          </div>
          <div class="checkbox removeOnCompleteBtn">
            <span> No, leave it  </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Modal"
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
  // height: 40%;
  position: absolute;
  background-color: #091a28;
  border-radius: 10px;
  border: 2px solid #42b983;
  z-index: 3;
  @media (max-width: 1000px) {
    width: 80% !important;
    // height: 50% !important;
  }
}
.content {
  color: #2c3e50;
  justify-content: center;
  align-items: center;
  padding: 20px;
  display: flex;
  // position: absolute;
  height: auto;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: column;
}
.checkbox {
  margin: 5px;
  padding: 6px;
  // min-width: 125px;
  // height: 35px;
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
.close {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 30px;
  opacity: 0.5;
  margin: 10px;
  z-index: 1;
}
.close:before,
.close:after {
  position: absolute;
  left: 13px;
  content: " ";
  height: 30px;
  width: 2px;
  background-color: rgb(255, 255, 255);
}
.close:hover:before,
.close:hover:after {
  transition: 0.2s;
  background-color: #42b983;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
</style>
