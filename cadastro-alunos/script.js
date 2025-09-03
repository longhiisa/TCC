// Alternância de abas
function openTab(tabId) {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => tab.classList.remove("active"));
  contents.forEach((content) => content.classList.remove("active"));

  document.querySelector(`.tab[onclick="openTab('${tabId}')"]`).classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

// Função fictícia para captura de foto
function capturePhoto() {
  alert("Funcionalidade de captura de foto ainda não implementada.");
}
