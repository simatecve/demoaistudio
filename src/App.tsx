import React, { useEffect, useState } from 'react';
import { Twitter, Linkedin, Zap, Activity, MapPin, Layers, X, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      providerInfo: []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const path = 'leads';
      await addDoc(collection(db, path), {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        ...(formData.phone ? { phone: formData.phone } : {}),
        createdAt: serverTimestamp()
      }).catch((error) => {
        handleFirestoreError(error, OperationType.CREATE, path);
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '' });
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? 'Error al guardar. Verifica los datos.' : 'Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-barlow">
      {/* Custom Cursor */}
      <div 
        className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
      >
        <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/45 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-radial-overlay z-0" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        
        {/* Navbar */}
        <nav className="w-full px-6 md:px-12 py-7 flex justify-between items-center absolute top-0 left-0">
          {/* Logo */}
          <div className="flex items-baseline gap-1 cursor-none" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <span className="font-semibold text-[20px] text-white">SwiftDrop</span>
            <span className="font-instrument italic text-[#F97316] text-[22px]">AI</span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex gap-8">
            {['Servicios IA', 'Casos Reales', 'Integraciones', 'Nosotros'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="nav-link text-[14px] text-white/55 hover:text-white transition-colors tracking-[0.06em]"
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Linkedin size={18} />
              </a>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[#0a1628] rounded-full px-[22px] py-[10px] font-semibold text-[13px] tracking-[0.04em] transition-all duration-300 hover:bg-[#F97316] hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              Agendar Demo IA
            </button>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-12">
          {/* Eyebrow */}
          <div className="glass-pill rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
            <span className="font-medium text-[12px] text-white/80 tracking-[0.1em] uppercase">
              ⚡ IA para Delivery & Logística
            </span>
          </div>

          {/* Title Line 1 */}
          <h1 className="font-bold italic text-center text-[100px] text-[#540606] text-shadow-hero leading-[1.05] animate-fade-in-up delay-150">
            Entregamos más rápido con
          </h1>
          
          {/* Title Line 2 */}
          <h2 className="font-instrument italic text-[54px] md:text-[108px] text-white text-shadow-hero leading-[1.1] animate-fade-in-up delay-300">
            IA en cada kilómetro.
          </h2>

          {/* Subtext */}
          <p className="font-light text-[16px] md:text-[20px] text-white/65 max-w-[660px] leading-[1.65] mt-6 mb-10 text-shadow-base animate-fade-in-up delay-450">
            Optimizamos rutas, predecimos demanda y automatizamos operaciones para que tu flota nunca se detenga.
          </p>

          {/* Main Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-main btn-gradient rounded-full px-9 py-4 flex items-center gap-2 text-white font-semibold text-[16px] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(249,115,22,0.45)] animate-fade-in-up delay-600"
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            <Zap size={16} className="icon-zap transition-transform duration-300" />
            Ver cómo funciona
          </button>
        </main>

        {/* Bottom Widgets */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col md:flex-row justify-between items-end gap-4 pointer-events-none">
          
          {/* Bottom Left */}
          <div className="glass-base rounded-[16px] p-[14px] px-[18px] w-fit animate-fade-in-up delay-800 pointer-events-auto">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} color="#22c55e" />
              <span className="font-bold text-[11px] text-[#22c55e] tracking-[0.12em]">SWIFTDROP CORE: ONLINE</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse-neon ml-1" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-white/50" />
                <span className="font-normal text-[11px] text-white/50">Ciudad, País</span>
              </div>
              <div className="w-[1px] h-[10px] bg-white/20" />
              <span className="font-normal text-[10px] text-white/35">Uptime 99.98%</span>
            </div>
          </div>

          {/* Bottom Center Metric */}
          <div className="hidden md:flex glass-base rounded-full px-7 py-2.5 items-center gap-6 animate-fade-in-up delay-800 pointer-events-auto">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[12px] text-white">12M+</span>
              <span className="font-light text-[10px] text-white/45 uppercase tracking-wider">Entregas</span>
            </div>
            <div className="w-[1px] h-[20px] bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-[12px] text-white">98%</span>
              <span className="font-light text-[10px] text-white/45 uppercase tracking-wider">On-Time</span>
            </div>
            <div className="w-[1px] h-[20px] bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-[12px] text-white">340ms</span>
              <span className="font-light text-[10px] text-white/45 uppercase tracking-wider">Ruta IA</span>
            </div>
          </div>

          {/* Bottom Right */}
          <div 
            className="glass-base rounded-full px-5 py-2.5 flex items-center gap-3 animate-fade-in-up delay-800 pointer-events-auto transition-all duration-300 hover:border-[#F97316]/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] cursor-none"
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            <div className="bg-white/10 p-1.5 rounded-full">
              <Layers size={13} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[11px] text-white tracking-[0.1em] uppercase">SwiftDrop Ecosystem</span>
              <span className="font-light text-[10px] text-[#F97316]">Powered by AI</span>
            </div>
          </div>

        </div>
      </div>

      {/* Lead Capture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          <div className="relative w-full max-w-md glass-base rounded-2xl p-8 border border-white/10 shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-none"
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Agendar Demo</h3>
              <p className="text-sm text-white/60">Déjanos tus datos y un especialista en IA logística te contactará en breve.</p>
            </div>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in-up">
                <CheckCircle2 size={48} className="text-[#22c55e] mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">¡Solicitud Recibida!</h4>
                <p className="text-sm text-white/60">Nos pondremos en contacto contigo pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name"
                    required 
                    minLength={2}
                    maxLength={100}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all cursor-none"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Email Corporativo</label>
                  <input 
                    type="email" 
                    name="email"
                    required 
                    maxLength={150}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all cursor-none"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Empresa</label>
                  <input 
                    type="text" 
                    name="company"
                    required 
                    minLength={2}
                    maxLength={100}
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all cursor-none"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 uppercase tracking-wider">Teléfono (Opcional)</label>
                  <input 
                    type="tel" 
                    name="phone"
                    maxLength={20}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all cursor-none"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
                
                {status === 'error' && (
                  <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full btn-gradient rounded-lg px-6 py-3 mt-6 text-white font-semibold text-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] disabled:opacity-70 cursor-none"
                  onMouseEnter={handleMouseEnter} 
                  onMouseLeave={handleMouseLeave}
                >
                  {status === 'submitting' ? 'Enviando...' : 'Solicitar Demo'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
