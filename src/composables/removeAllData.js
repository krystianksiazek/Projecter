import { ref } from "vue";
import projectManagement from "./projectManagement"

const removeAllData = () => {
  const { getCookieValue, setCookie, deleteCookie } = projectManagement();
  function removeDB() {
    var deleteRequest = indexedDB.deleteDatabase("projectDB");

    deleteRequest.onerror = function(event) {
      console.log("Error deleting database.");
    };

    deleteRequest.onsuccess = function(event) {
      console.log("Database deleted successfully");

      console.log(event.result); // should be undefined
    };
  }
  function removeCookies() {
    deleteCookie("DBexist");
    deleteCookie("removeOnComplete");
    deleteCookie("sorterOption");
  }
  return { removeDB, removeCookies };
};
export default removeAllData;
