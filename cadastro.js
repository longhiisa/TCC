class CadastroAPI {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.init();
  }

  init() {
    const form = document.getElementById('AlunoForm');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const aluno = {
      nomeCompleto: document.getElementById('nomeCompleto')?.value || '',
      matricula: document.getElementById('matricula')?.value || '',
      turma: document.getElementById('turma')?.value || '',
      telefoneResponsavel: document.getElementById('telefoneResponsavel')?.value || '',
      dataNascimento: document.getElementById('dataNascimento')?.value || '',
      responsavel: document.getElementById('responsavel')?.value || '',
      rfid: document.getElementById('rfid')?.value || ''
    };

    console.log('Dados do aluno:', aluno);

    try {
      const response = await fetch(`${this.baseURL}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Sucesso! Aluno cadastrado com ID: ${result.id}`);
        event.target.reset();
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Erro de conexão com o servidor');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CadastroAPI();
});
