"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Wifi, Camera, User, BookOpen } from "lucide-react";

export default function NovoAlunoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rfidScanning, setRfidScanning] = useState(false);
  const [rfidValue, setRfidValue] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
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

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraOn(true);
    } catch (error) {
      alert("Erro ao acessar a câmera");
      console.error(error);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/alunos");
      }, 1500);
    }, 1200);
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Aluno cadastrado!
          </h3>

          <p className="text-gray-400 text-sm">
            Redirecionando para a lista...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
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
          <p className="text-gray-400 text-sm">
            Preencha os dados para cadastrar
          </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Nome completo *
              </label>

              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                placeholder="Ex: João da Silva"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                E-mail
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="joao@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Telefone
              </label>

              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Responsável
              </label>

              <input
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
                placeholder="Nome do responsável"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Tel. Responsável
              </label>

              <input
                name="telefoneResponsavel"
                value={form.telefoneResponsavel}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
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

            <h3 className="font-bold text-gray-900">
              Dados Acadêmicos
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              name="ra"
              value={form.ra}
              onChange={handleChange}
              required
              placeholder="RA"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm"
            />

            <select
              name="curso"
              value={form.curso}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">Curso</option>
              <option value="DS">Desenvolvimento de Sistemas</option>
              <option value="RD">Eletrônica</option>
              <option value="RD">Mecanica</option>
            </select>

            <select
              name="turma"
              value={form.turma}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm"
            >
              <option value="">Turma</option>
              <option value="1DS">IDEV3</option>
              <option value="2DS">IELEMEC3</option>
              <option value="2DS">IELEMEC4</option>
              <option value="2DS">IDEV4</option>
              <option value="2DS">IELEMEC5</option>
              <option value="2DS">IDEV5</option>
            </select>

          </div>
        </div>

        {/* Biometria */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">

          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Wifi size={14} className="text-emerald-600" />
            </div>

            <h3 className="font-bold text-gray-900">
              Identificação Biométrica
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            {/* RFID */}
            <div className="border border-gray-200 rounded-xl p-4">

              <button
                type="button"
                onClick={simulateRfidScan}
                className="w-full bg-violet-50 py-3 rounded-xl"
              >
                Escanear RFID
              </button>

              {rfidValue && (
                <p className="mt-2 text-sm font-mono">{rfidValue}</p>
              )}

            </div>

            {/* Camera */}
            <div className="border border-gray-200 rounded-xl p-4">

              <div className="w-full bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-3 overflow-hidden">
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera size={24} className="mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Câmera não ativada</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={startCamera}
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Camera size={14} />
                Capturar Foto
              </button>

            </div>

          </div>

        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3">

          <Link
            href="/dashboard/alunos"
            className="px-6 py-3 border border-gray-200 rounded-xl text-sm"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#c8102e] text-white px-6 py-3 rounded-xl"
          >
            <Save size={15} />
            Cadastrar Aluno
          </button>

        </div>

      </form>
    </div>
  );
}