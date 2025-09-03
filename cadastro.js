document.getElementById("alunoForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio tradicional
  
    // Captura os dados
    const dadosAluno = {
      nomeCompleto: document.getElementById("nomeCompleto").value,
      matricula: document.getElementById("matricula").value,
      turma: document.getElementById("turma").value,
      dataNascimento: document.getElementById("dataNascimento").value,
      responsavel: document.getElementById("responsavel").value,
      rfid: document.getElementById("rfid").value
    };
  
    // Salva no localStorage (você pode adaptar para salvar no backend futuramente)
    localStorage.setItem("alunoCadastrado", JSON.stringify(dadosAluno));
  
    // Feedback visual
    alert("Dados salvos com sucesso!");
  
    // Opcional: limpar o formulário após salvar
    // this.reset();
  });
  