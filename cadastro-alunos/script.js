// Alternância de abas
function openTab(tabId) {
  // Obtém todas as abas e conteúdos
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  // Remove a classe "active" de todas as abas e conteúdos
  tabs.forEach((tab) => tab.classList.remove("active"));
  contents.forEach((content) => content.classList.remove("active"));

  // Adiciona a classe "active" na aba clicada e no conteúdo correspondente
  const activeTab = document.querySelector(`#${tabId}`);
  if (activeTab) {
    activeTab.classList.add("active");
  }
  const activeContent = document.querySelector(`#${tabId}-content`);
  if (activeContent) {
    activeContent.classList.add("active");
  }
}

// Função para captura de foto (simulação)
function capturePhoto() {
  // Exibe uma mensagem indicando que a captura de foto ainda não foi implementada
  alert("Funcionalidade de captura de foto ainda não implementada.");

  // Você pode adicionar lógica aqui para integrar com a câmera se necessário
  // Exemplo: Usando a API da câmera do navegador
  // navigator.mediaDevices.getUserMedia({ video: true })
  //   .then(function(stream) {
  //     // Exemplo de como mostrar a captura da câmera
  //     console.log("Câmera ativada!", stream);
  //   })
  //   .catch(function(error) {
  //     console.error("Erro ao acessar a câmera:", error);
  //   });
}
