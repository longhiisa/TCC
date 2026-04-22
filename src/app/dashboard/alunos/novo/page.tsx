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

  // --- NOVOS ESTADOS PARA O RECONHECIMENTO FACIAL ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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

  // --- FUNÇÃO PARA LIGAR A LOGITECH C270 ---
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }, // Resolução da C270
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
    } catch (error) {
      alert("Erro ao acessar a Logitech C270. Verifique se está conectada.");
      console.error(error);
    }
  }

  // --- FUNÇÃO PARA CAPTURAR O FRAME ---
  function capturePhoto() {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);

      const base64 = canvas.toDataURL("image/jpeg");
      setCapturedImage(base64);
      alert("Foto capturada! Agora clique em 'Cadastrar Aluno' para salvar.");
    }
  }

  // --- ENVIO DOS DADOS PARA O BACKEND PYTHON ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!capturedImage) {
      alert("Por favor, capture a foto do aluno antes de salvar.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          ra: form.ra,
          image: capturedImage, // Envia a foto em Base64
          // Você pode enviar os outros campos do form se o seu backend Python for salvar no banco SQL
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/alunos");
        }, 1500);
      } else {
        alert("Erro ao salvar no servidor de reconhecimento facial.");
      }
    } catch (error) {
      alert("O servidor Python está desligado!");
    } finally {
      setSaving(false);
    }
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/alunos" className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-gray-300 transition">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Novo Aluno</h2>
          <p className="text-gray-400 text-sm">Preencha os dados e capture a face</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Dados Pessoais</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Nome completo *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Ex: João da Silva" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8102e]" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">E-mail</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="joao@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>
        </div>

        {/* Dados Acadêmicos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-violet-600" />
            </div>
            <h3 className="font-bold text-gray-900">Dados Acadêmicos</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="ra" value={form.ra} onChange={handleChange} required placeholder="RA (Necessário para a foto)" className="border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            <select name="curso" value={form.curso} onChange={handleChange} required className="border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <option value="">Curso</option>
              <option value="DS">Desenvolvimento de Sistemas</option>
              <option value="RD">Eletrônica</option>
              <option value="MC">Mecânica</option>
            </select>
            <select name="turma" value={form.turma} onChange={handleChange} required className="border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <option value="">Turma</option>
              <option value="1DS">IDEV3</option>
              <option value="2DS">IDEV4</option>
            </select>
          </div>
        </div>

        {/* Biometria (Onde a mágica acontece) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Wifi size={14} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900">Identificação Biométrica</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* RFID */}
            <div className="border border-gray-200 rounded-xl p-4">
              <button type="button" onClick={simulateRfidScan} className="w-full bg-violet-50 py-3 rounded-xl hover:bg-violet-100 transition">
                {rfidScanning ? "Lendo..." : "Escanear RFID"}
              </button>
              {rfidValue && <p className="mt-2 text-sm font-mono text-center bg-gray-50 py-1 border rounded">Tag: {rfidValue}</p>}
            </div>

            {/* Câmera Logitech C270 */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="w-full bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-3 overflow-hidden border">
                {cameraOn ? (
                  <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay playsInline />
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera size={24} className="mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Clique abaixo para ativar a C270</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={cameraOn ? capturePhoto : startCamera}
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                <Camera size={14} />
                {cameraOn ? "Capturar Foto" : "Ativar Câmera"}
              </button>
              
              {capturedImage && <p className="text-[10px] text-emerald-600 font-bold text-center mt-1">✓ FOTO PRONTA PARA SALVAR</p>}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <Link href="/dashboard/alunos" className="px-6 py-3 border border-gray-200 rounded-xl text-sm">Cancelar</Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#c8102e] text-white px-6 py-3 rounded-xl hover:bg-[#a00d25] transition disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Salvando..." : "Cadastrar Aluno"}
          </button>
        </div>
      </form>
    </div>
  );
}