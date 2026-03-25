"use client";

import { useState, useEffect } from "react";
import {
  Wifi,
  Camera,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  User,
  RefreshCw,
  Activity,
} from "lucide-react";

type EntradaTipo = "RFID" | "Facial";
type EntradaStatus = "Autorizado" | "Negado";

interface Entrada {
  id: number;
  nome: string;
  turma: string;
  tipo: EntradaTipo;
  status: EntradaStatus;
  hora: string;
  avatar: string;
  local: string;
}

const entradasIniciais: Entrada[] = [
  { id: 1, nome: "Carlos Eduardo Silva", turma: "DS-3A", tipo: "RFID", status: "Autorizado", hora: "08:47:12", avatar: "CE", local: "Entrada Principal" },
  { id: 2, nome: "Ana Paula Mendes", turma: "RDS-2B", tipo: "Facial", status: "Autorizado", hora: "08:46:55", avatar: "AP", local: "Entrada Principal" },
  { id: 3, nome: "Desconhecido", turma: "—", tipo: "Facial", status: "Negado", hora: "08:45:30", avatar: "?", local: "Entrada Lateral" },
  { id: 4, nome: "Lucas Ferreira Santos", turma: "DS-1C", tipo: "RFID", status: "Autorizado", hora: "08:44:18", avatar: "LF", local: "Entrada Principal" },
  { id: 5, nome: "Beatriz Oliveira", turma: "RDS-3A", tipo: "RFID", status: "Autorizado", hora: "08:43:02", avatar: "BO", local: "Entrada Principal" },
  { id: 6, nome: "Rafael Costa Lima", turma: "DS-2A", tipo: "Facial", status: "Autorizado", hora: "08:41:47", avatar: "RC", local: "Laboratório" },
  { id: 7, nome: "Juliana Neves", turma: "DS-1A", tipo: "RFID", status: "Negado", hora: "08:40:33", avatar: "JN", local: "Entrada Principal" },
  { id: 8, nome: "Thiago Almeida", turma: "RDS-1B", tipo: "Facial", status: "Autorizado", hora: "08:39:20", avatar: "TA", local: "Entrada Principal" },
];

const novasEntradas: Entrada[] = [
  { id: 9, nome: "Fernanda Rocha", turma: "DS-2B", tipo: "RFID", status: "Autorizado", hora: "", avatar: "FR", local: "Entrada Principal" },
  { id: 10, nome: "Desconhecido", turma: "—", tipo: "Facial", status: "Negado", hora: "", avatar: "?", local: "Laboratório" },
  { id: 11, nome: "Pedro Henrique", turma: "DS-3A", tipo: "RFID", status: "Autorizado", hora: "", avatar: "PH", local: "Entrada Principal" },
];

export default function EntradasPage() {
  const [entradas, setEntradas] = useState<Entrada[]>(entradasIniciais);
  const [pulsar, setPulsar] = useState(false);
  const [contador, setContador] = useState(0);
  const [filtro, setFiltro] = useState<"Todos" | EntradaTipo | EntradaStatus>("Todos");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const nova = novasEntradas[contador % novasEntradas.length];
      const novaEntrada: Entrada = { ...nova, id: Date.now(), hora };

      setEntradas((prev) => [novaEntrada, ...prev.slice(0, 19)]);
      setPulsar(true);
      setContador((c) => c + 1);
      setTimeout(() => setPulsar(false), 600);
    }, 5000);

    return () => clearInterval(interval);
  }, [contador]);

  const filtradas = entradas.filter((e) => {
    if (filtro === "Todos") return true;
    return e.tipo === filtro || e.status === filtro;
  });

  const autorizados = entradas.filter((e) => e.status === "Autorizado").length;
  const negados = entradas.filter((e) => e.status === "Negado").length;
  const rfid = entradas.filter((e) => e.tipo === "RFID").length;
  const facial = entradas.filter((e) => e.tipo === "Facial").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entradas em Tempo Real</h1>
          <p className="text-sm text-gray-500 mt-1">Monitoramento ao vivo dos acessos</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <span className={`w-2 h-2 rounded-full bg-green-500 ${pulsar ? "animate-ping" : "animate-pulse"}`} />
          <span className="text-sm font-medium text-green-700">Sistema Ativo</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Autorizados", value: autorizados, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
          { label: "Negados", value: negados, icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
          { label: "Via RFID", value: rfid, icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Via Facial", value: facial, icon: Camera, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-xl p-4 flex items-center gap-3`}>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dispositivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { nome: "RFID — Entrada Principal", icon: CreditCard, status: "Online", cor: "green" },
          { nome: "Câmera — Entrada Principal", icon: Camera, status: "Online", cor: "green" },
          { nome: "RFID — Laboratório", icon: Wifi, status: "Online", cor: "green" },
        ].map((d) => (
          <div key={d.nome} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <d.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{d.nome}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                {d.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros + Tabela */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#c8102e]" />
            <h2 className="font-semibold text-gray-800">Log de Acessos</h2>
          </div>
          <div className="flex gap-2">
            {(["Todos", "RFID", "Facial", "Autorizado", "Negado"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filtro === f
                    ? "bg-[#c8102e] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Aluno", "Turma", "Local", "Método", "Status", "Horário"].map((col) => (
                  <th key={col} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtradas.map((entrada, i) => (
                <tr
                  key={entrada.id}
                  className={`hover:bg-gray-50 transition-colors ${i === 0 && pulsar ? "bg-blue-50" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        entrada.status === "Negado" ? "bg-red-100 text-red-700" : "bg-[#c8102e] text-white"
                      }`}>
                        {entrada.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{entrada.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{entrada.turma}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{entrada.local}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      entrada.tipo === "RFID"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-purple-50 text-purple-700"
                    }`}>
                      {entrada.tipo === "RFID" ? <CreditCard className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                      {entrada.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      entrada.status === "Autorizado"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {entrada.status === "Autorizado"
                        ? <CheckCircle className="w-3 h-3" />
                        : <XCircle className="w-3 h-3" />}
                      {entrada.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {entrada.hora}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
