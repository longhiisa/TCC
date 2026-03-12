"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Wifi, Camera, User, BookOpen } from "lucide-react";

export default function NovoAlunoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rfidScanning, setRfidScanning] = useState(false);
  const [rfidValue, setRfidValue] = useState("");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    turma: "",
    curso: "",
    ra: "",
    responsavel: "",
    telefoneResponsavel: "",
    observacoes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function simulateRfidScan() {
    setRfidScanning(true);
    setTimeout(() => {
      const tag = "F" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setRfidValue(tag);
      setRfidScanning(false);
    }, 2000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/alunos"), 1500);
    }, 1200);
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Aluno cadastrado!</h3>
          <p className="text-gray-400 text-sm">Redirecionando para a lista...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/alunos"
          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-gray-300 transition"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Novo Aluno</h2>
          <p className="text-gray-400 text-sm">Preencha os dados para cadastrar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados pessoais */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Dados Pessoais</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome completo *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Ex: João da Silva"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">E-mail</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="joao@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Responsável</label>
              <input
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
                placeholder="Nome do responsável"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tel. Responsável</label>
              <input
                name="telefoneResponsavel"
                value={form.telefoneResponsavel}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition"
              />
            </div>
          </div>
        </div>

        {/* Dados acadêmicos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-violet-600" />
            </div>
            <h3 className="font-bold text-gray-900">Dados Acadêmicos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RA / Matrícula *</label>
              <input
                name="ra"
                value={form.ra}
                onChange={handleChange}
                required
                placeholder="2024001"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Curso *</label>
              <select
                name="curso"
                value={form.curso}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition bg-white"
              >
                <option value="">Selecione</option>
                <option value="DS">Desenvolvimento de Sistemas</option>
                <option value="RD">Redes de Computadores</option>
                <option value="AD">Administração</option>
                <option value="EL">Eletrotécnica</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Turma *</label>
              <select
                name="turma"
                value={form.turma}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition bg-white"
              >
                <option value="">Selecione</option>
                <option value="1DS">1º DS</option>
                <option value="2DS">2º DS</option>
                <option value="3DS">3º DS</option>
                <option value="1RD">1º RD</option>
                <option value="2RD">2º RD</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Observações</label>
            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              rows={3}
              placeholder="Informações adicionais..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e] transition resize-none"
            />
          </div>
        </div>

        {/* Identificação biométrica */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Wifi size={14} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900">Identificação Biométrica</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* RFID */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wifi size={14} className="text-violet-600" />
                <span className="text-sm font-semibold text-gray-700">Cartão RFID</span>
              </div>
              {rfidValue ? (
                <div className="flex items-center gap-3 bg-violet-50 rounded-xl p-3 mb-3">
                  <code className="text-sm font-mono text-violet-700 font-bold">{rfidValue}</code>
                  <span className="text-xs text-violet-500">Registrado</span>
                </div>
              ) : null}
              <button
                type="button"
                onClick={simulateRfidScan}
                disabled={rfidScanning}
                className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {rfidScanning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                    Aproxime o cartão...
                  </>
                ) : (
                  <>
                    <Wifi size={14} />
                    {rfidValue ? "Re-escanear Cartão" : "Escanear Cartão RFID"}
                  </>
                )}
              </button>
            </div>

            {/* Facial */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Camera size={14} className="text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">Reconhecimento Facial</span>
              </div>
              <div className="w-full bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-3">
                <div className="text-center text-gray-400">
                  <Camera size={24} className="mx-auto mb-1 opacity-50" />
                  <p className="text-xs">Câmera não ativada</p>
                </div>
              </div>
              <button
                type="button"
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <Camera size={14} />
                Capturar Foto
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/dashboard/alunos"
            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={15} />
                Cadastrar Aluno
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
