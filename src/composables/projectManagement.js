import { ref } from "vue";
const projectManagement = () => {
  var db;
  const projects = ref([]);
  const DBexist = ref();
  const error = ref(false);
  function makeDB() {
    let openRequest = indexedDB.open("projectDB", 1);
    openRequest.onupgradeneeded = function() {
      db = openRequest.result;
      if (!db.objectStoreNames.contains("projects")) {
        setCookie("DBexist", true, 365);
        db.createObjectStore("projects", {
          keyPath: "id",
          autoIncrement: false,
        });
      }
    };
  }
  function setCookie(name, value, expirationDays) {
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    document.cookie =
      encodeURIComponent(name) +
      "=" +
      encodeURIComponent(value) +
      (!expirationDays
        ? ""
        : "; expires=" + expirationDate.toUTCString() + "; SameSite=None" + "; Secure");
  }
  function getCookieValue(name) {
    let result = document.cookie.match(
      "(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    result = result ? result.pop() : "";
    if (result == "true") {
      return true;
    } else if (result == "false") {
      return false;
    } else return result;
  }
  function deleteCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  function load() {
    if (getCookieValue("DBexist")) {
      DBexist.value = true;
      db = indexedDB.open("projectDB", 1);
      db.onsuccess = function() {
        db = db.result;
        if (db.objectStoreNames.contains("projects")) {
          let tx = db.transaction("projects", "readwrite");
          let projectDB = tx.objectStore("projects");
          let project = projectDB.getAll();
          project.onsuccess = function() {
            projects.value = project.result;
          };
        }
      };
    } else {
      DBexist.value = false;
    }
  }
  return { projects, error, load, makeDB, DBexist, setCookie, getCookieValue, deleteCookie };
};

export default projectManagement;
