"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, UserPlus, Filter, Eye, Pencil, Trash2, ChevronDown, Users, ScanFace, Loader2 } from "lucide-react";

interface Aluno {
  id: number;
  nome: string;
  turma: string;
  rfid: string;
  status: "Ativo" | "Inativo";
  entrada: string;
  avatar: string;
  faceTreinada: boolean; // Nova propriedade para integrar com a IA
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // --- INTEGRAÇÃO COM O BACKEND ---
  useEffect(() => {
    async function carregarAlunos() {
      try {
        // Altere para a rota real do backend que seu colega criou (ex: "/api/alunos" ou "http://localhost:5000/alunos")
        const response = await fetch("/api/alunos"); 
        
        if (response.ok) {
          const dados = await response.json();
          setAlunos(dados);
        } else {
          gerarDadosMock(); // Fallback caso o backend mude de endereço
        }
      } catch (error) {
        console.warn("Backend não respondeu, usando dados locais temporários.");
        gerarDadosMock();
      } finally {
        setLoading(false);
      }
    }

    carregarAlunos();
  }, []);

  // Dados padrão caso a API do colega ainda não esteja online
  function gerarDadosMock() {
    setAlunos([
      { id: 1, nome: "Isabela Longhi", turma: "2º DS", rfid: "A23F91", status: "Ativo", entrada: "07:15", avatar: "IL", faceTreinada: true },
      { id: 2, nome: "Maria Oliveira", turma: "3º DS", rfid: "B88K21", status: "Ativo", entrada: "07:18", avatar: "MO", faceTreinada: true },
      { id: 3, nome: "Carlos Martins", turma: "1º DS", rfid: "C55T77", status: "Inativo", entrada: "—", avatar: "CM", faceTreinada: false },
      { id: 4, nome: "Ana Minin", turma: "2º DS", rfid: "D91R44", status: "Ativo", entrada: "07:22", avatar: "AM", faceTreinada: true },
      { id: 5, nome: "Lucas Gregório", turma: "3º DS", rfid: "E07P88", status: "Ativo", entrada: "07:31", avatar: "LG", faceTreinada: false },
      { id: 6, nome: "Otávio Seidinger", turma: "1º DS", rfid: "F33X12", status: "Ativo", entrada: "07:45", avatar: "OS", faceTreinada: true },
      { id: 7, nome: "Lucas Ferreira", turma: "2º DS", rfid: "G74Y56", status: "Inativo", entrada: "—", avatar: "LF", faceTreinada: false },
      { id: 8, nome: "Fernanda Rocha", turma: "3º DS", rfid: "H12Z99", status: "Ativo", entrada: "07:51", avatar: "FR", faceTreinada: true },
    ]);
  }

  // --- FILTROS DE BUSCA ---
  const filtrados = alunos.filter((a) => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase()) || a.rfid.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "Todos" || a.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const ativos = alunos.filter((a) => a.status === "Ativo").length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-[#c8102e] animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Buscando lista de alunos integrada...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Alunos</h2>
          <p className="text-gray-400 text-sm mt-1">{alunos.length} alunos cadastrados · {ativos} ativos</p>
        </div>
        <Link
          href="/dashboard/alunos/novo"
          className="flex items-center gap-2 bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-sm uppercase text-xs tracking-wider"
        >
          <UserPlus size={16} />
          Novo Aluno
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou TAG RFID..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#c8102e] transition"
          />
        </div>
        <div className="relative">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#c8102e] transition bg-white cursor-pointer font-medium text-gray-700"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Ativo">Apenas Ativos</option>
            <option value="Inativo">Apenas Inativos</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50/70">
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aluno</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Turma</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">RFID / TAG</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Biometria Facial</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Última entrada</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrados.map((aluno) => (
              <tr key={aluno.id} className="hover:bg-gray-50/50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm">
                      {aluno.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{aluno.nome}</p>
                      <p className="text-[10px] text-gray-400 font-bold">ID #{aluno.id.toString().padStart(4, "0")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 font-semibold">{aluno.turma}</span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-mono font-bold border border-gray-200/50">{aluno.rfid}</code>
                </td>
                {/* Coluna Inteligente de Reconhecimento Facial */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                    aluno.faceTreinada 
                      ? "bg-purple-50 text-purple-700 border border-purple-100" 
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    <ScanFace size={12} />
                    {aluno.faceTreinada ? "Face Treinada" : "Pendente"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 font-medium">{aluno.entrada}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                      aluno.status === "Ativo"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {aluno.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-blue-500 transition">
                      <Eye size={15} />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-amber-50 flex items-center justify-center text-amber-500 transition">
                      <Pencil size={15} />
                    </button>
                    <button className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500 transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrados.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Nenhum aluno encontrado</p>
          </div>
        )}

        {/* Pagination hint */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-xs text-gray-400 font-medium">Mostrando {filtrados.length} de {alunos.length} alunos</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-[#c8102e] hover:text-[#c8102e] transition bg-white font-bold">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}