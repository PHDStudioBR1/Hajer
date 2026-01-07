
import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Brain,
  Activity,
  Moon,
  Sun,
  Zap,
  Heart,
  Dna,
  Instagram,
  Facebook,
  Music2,
  ArrowRight
} from 'lucide-react';

// --- Components ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefers;
    setIsDark(initialDark);
    const html = document.documentElement;
    const body = document.body;
    if (initialDark) {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const html = document.documentElement;
    const body = document.body;
    
    // Usar replace para garantir que a classe seja atualizada corretamente
    if (next) {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
    
    localStorage.setItem('theme', next ? 'dark' : 'light');
    
    // Forçar reflow para garantir que os estilos sejam recalculados
    void html.offsetHeight;
  };
  const menuItems = [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Áreas de atuação', href: '#areas' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'FAQs', href: '#faq' },
    { label: 'Contato', href: '#contato' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDark 
        ? (isScrolled ? 'bg-slate-900 shadow-md py-3' : 'bg-slate-900 py-5') 
        : (isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5')
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img 
            src="https://raw.githubusercontent.com/PHDStudioBR/PHDStudioImages/main/Dra%20Hajir%20Abdalla.svg" 
            alt="Logo Dra. Hajir Abdalla" 
            className={`h-10 md:h-12 w-auto transition-all ${
              isDark 
                ? 'invert brightness-0' 
                : (isScrolled ? 'brightness-100 opacity-90' : 'brightness-100 opacity-90')
            }`}
          />
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <a key={item.label} href={item.href} className={`text-sm font-medium transition-colors ${
              isDark 
                ? 'text-slate-200 hover:text-white' 
                : (isScrolled ? 'text-slate-700 hover:text-[#2D5B7C]' : 'text-slate-700 hover:text-[#2D5B7C]')
            }`}>
              {item.label}
            </a>
          ))}
          <a 
            href="https://wa.me/5511977920368" 
            target="_blank" 
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl ${isDark ? 'bg-[#2D5B7C] text-white hover:bg-[#1e3d54]' : 'bg-[#2D5B7C] text-white hover:bg-[#1e3d54]'}`}
          >
            Agendar teleconsulta
          </a>
          <button 
            onClick={toggleTheme}
            aria-label="Alternar modo escuro"
            className={`ml-4 p-2 rounded-full transition-colors ${
              isDark 
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
                : (isScrolled ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={`lg:hidden p-2 ${
            isDark 
              ? 'text-white' 
              : (isScrolled ? 'text-slate-700' : 'text-slate-700')
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 ${
        isDark 
          ? 'bg-slate-900 text-slate-200' 
          : 'bg-white text-slate-800'
      } z-40 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-end mb-8">
            <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
          </div>
          <nav className="flex flex-col space-y-6">
            {menuItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`text-xl font-medium pb-2 border-b ${
                  isDark 
                    ? 'text-slate-200 border-slate-700' 
                    : 'text-slate-800 border-slate-100'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a 
              href="https://wa.me/5511977920368" 
              className={`${isDark ? 'bg-[#2D5B7C] text-white' : 'bg-[#2D5B7C] text-white'} text-center py-4 rounded-xl font-bold text-lg`}
            >
              Agendar teleconsulta
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

const InstagramCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Array<{ id: string; caption?: string; media_url: string; permalink: string; media_type: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('/api/instagram');
        if (resp.ok) {
          const arr = await resp.json();
          if (Array.isArray(arr) && arr.length > 0) {
            setPosts(arr);
            return;
          }
        }
      } catch {}
      const scriptEl = document.getElementById('instagram-posts');
      if (scriptEl && scriptEl.textContent) {
        try {
          const data = JSON.parse(scriptEl.textContent);
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          }
        } catch {}
      }
    };
    load();
  }, []);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">No Instagram</h2>
            <p className="text-slate-600 dark:text-slate-300">Acompanhe conteúdos e atualizações.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronDown className="rotate-90" />
            </button>
            <button 
              onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronDown className="-rotate-90" />
            </button>
          </div>
        </div>
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((p) => (
            <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="group min-w-[260px] md:min-w-[320px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 snap-start">
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-900">
                <img src={p.media_url} alt="Post do Instagram" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </div>
              <div className="p-4">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">@drahaabdalla</div>
                <div className="text-slate-800 dark:text-slate-200 line-clamp-2">{p.caption || 'Post do Instagram'}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Hero = () => (
  <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <div className="max-w-2xl">
        <span className="inline-block bg-blue-100 text-[#2D5B7C] dark:bg-slate-800 dark:text-slate-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          Atendimento 100% Online
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
          Psiquiatria online <span className="text-[#2D5B7C]">acolhedora</span> para sua saúde mental
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          Consulta por vídeo com abordagem humana e explicativa, focada em qualidade de vida e funcionalidade.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="#contato" 
            className="flex items-center justify-center gap-2 bg-[#2D5B7C] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1e3d54] transition-all shadow-xl hover:-translate-y-1"
          >
            Agendar teleconsulta
          </a>
          <a 
            href="https://wa.me/5511977920368" 
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-[#2D5B7C] dark:text-slate-200 border-2 border-[#2D5B7C] dark:border-slate-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md"
          >
            <MessageCircle size={22} />
            Falar no WhatsApp
          </a>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute -inset-4 bg-[#7EAA92]/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-slate-200 dark:bg-slate-800 aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 group">
          <video 
            controls 
            loop
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://picsum.photos/seed/doc/800/450"
          >
            <source src="/video.mp4" type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    { icon: <Clock />, title: "Agende online", text: "Clique no botão e escolha o melhor horário para sua consulta." },
    { icon: <CheckCircle2 />, title: "Confirmação", text: "Receba todos os detalhes e orientações por WhatsApp e e-mail." },
    { icon: <Video />, title: "Sua Consulta", text: "No horário marcado, acesse o link seguro para nossa vídeo chamada." }
  ];

  return (
    // Fixed: changed class to className for React compatibility
    <section id="como-funciona" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Como a teleconsulta funciona?</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Um processo simples, seguro e totalmente focado no seu conforto.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl text-center relative hover:shadow-lg transition-all border border-slate-100 dark:border-slate-700">
              <div className="w-16 h-16 bg-[#2D5B7C] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{step.text}</p>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="text-slate-300 dark:text-slate-500" size={32} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-16 flex items-center justify-center gap-2 text-slate-500 font-medium">
          <ShieldCheck className="text-[#7EAA92]" />
          <span className="dark:text-slate-400">Selo de segurança e total privacidade de dados (LGPD)</span>
        </div>
      </div>
    </section>
  );
};

const AreasOfExpertise = () => {
  const specialties = [
    { 
      title: "Ansiedade", 
      icon: <Activity />, 
      desc: "Tratamento para quadros de preocupação excessiva, pânico e fobias que impactam seu dia a dia." 
    },
    { 
      title: "Depressão", 
      icon: <Heart />, 
      desc: "Suporte especializado para recuperar o ânimo, a energia e o prazer nas atividades cotidianas." 
    },
    { 
      title: "Insônia", 
      icon: <Moon />, 
      desc: "Higiene do sono e intervenções para distúrbios que afetam sua reparação física e mental." 
    },
    { 
      title: "Burnout", 
      icon: <Zap />, 
      desc: "Cuidado focado em estresse crônico relacionado ao trabalho e exaustão emocional." 
    },
    { 
      title: "Humor", 
      icon: <Brain />, 
      desc: "Diagnóstico e manejo de transtornos bipolares e oscilações emocionais intensas." 
    },
    { 
      title: "TDAH Adulto", 
      icon: <Dna />, 
      desc: "Foco em funcionalidade, organização e estratégias para melhorar a atenção e o foco." 
    }
  ];

  return (
    <section id="areas" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Áreas de atuação</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Tratamento focado em devolver sua funcionalidade e bem-estar.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-[#7EAA92] transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 text-[#2D5B7C] dark:text-slate-200 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2D5B7C] group-hover:text-white transition-colors">
                {React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{item.desc}</p>
              <a href="#contato" className="inline-flex items-center text-[#2D5B7C] font-bold hover:gap-3 transition-all">
                Agendar teleconsulta <ArrowRight size={18} className="ml-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="sobre" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#7EAA92]/10 rounded-full blur-3xl"></div>
        <img 
          src="/about.jpg" 
          alt="Dra. Hajir Abdalla" 
          className="rounded-[3rem] shadow-2xl relative z-10 w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://picsum.photos/seed/doctor/600/800"; }}
        />
        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl z-20 border border-slate-100 dark:border-slate-700 max-w-[200px]">
          <div className="text-[#2D5B7C] font-bold text-3xl">10+</div>
          <div className="text-slate-500 text-sm">Anos de dedicação à medicina</div>
        </div>
      </div>
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Abordagem humanizada e neurofuncional</h2>
        <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Minha prática clínica é baseada na construção de um <span className="text-[#2D5B7C] font-semibold">elo de confiança</span> genuíno. Acredito que o paciente deve entender o porquê de cada decisão terapêutica.
          </p>
          <p>
            {/* Fixed: replaced undefined text-brand-sage class with hex code consistent with the branding */}
            Trabalho com uma <span className="text-[#7EAA92] font-semibold">explicação neurofuncional acessível</span>, integrando o cuidado mente-corpo para que você tenha autonomia sobre sua própria saúde.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-[#2D5B7C]">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Formação de Excelência</h4>
            <p className="text-base">Médica com especialização em Psiquiatria, focada em atualização contínua e medicina baseada em evidências.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<Array<{ name: string; text: string; stars: number }>>([
    { name: "Marcella D Paula", text: "Me ajudou como ninguém, no momento que eu mais precisava. Atenciosa, cuidadosa e super profissional.", stars: 5 },
    { name: "Damares Santana", text: "Daria 10 estrelas se a página permitisse. Melhor médica com a qual tive o prazer de ser paciente.", stars: 5 },
    { name: "Gabriel Heleno", text: "Dra Hajir Abdalla, além de profissional muito humana, super indico de olhos fechados. Muito grata por acolher com atenção e carinho.", stars: 5 }
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch('/api/reviews');
        if (resp.ok) {
          const arr = await resp.json();
          if (Array.isArray(arr) && arr.length > 0) {
            const normalized = arr
              .map((r: any) => ({
                name: r.author_name ?? r.name ?? "Paciente",
                text: r.text ?? r.review_text ?? "",
                stars: Number(r.rating ?? r.stars ?? 5)
              }))
              .filter((r: any) => r.text && r.name);
            if (normalized.length > 0) {
              setReviews(normalized);
              return;
            }
          }
        }
      } catch {}
      const scriptEl = document.getElementById('google-reviews');
      if (scriptEl && scriptEl.textContent) {
        try {
          const data = JSON.parse(scriptEl.textContent);
          if (Array.isArray(data)) {
            const normalized = data
              .map((r: any) => ({
                name: r.author_name ?? r.name ?? "Paciente",
                text: r.text ?? r.review_text ?? "",
                stars: Number(r.rating ?? r.stars ?? 5)
              }))
              .filter((r: any) => r.text && r.name);
            if (normalized.length > 0) {
              setReviews(normalized);
            }
          }
        } catch {}
      }
    };
    load();
  }, []);

  return (
    <section id="depoimentos" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">O que dizem os pacientes</h2>
            <p className="text-slate-600 dark:text-slate-300">A prova de um cuidado feito com propósito.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronDown className="rotate-90" />
            </button>
            <button 
              onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronDown className="-rotate-90" />
            </button>
          </div>
        </div>
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((rev, idx) => (
            <div key={idx} className="min-w-[300px] md:min-w-[400px] bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 snap-start">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(rev.stars)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-6">"{rev.text}"</p>
              <div className="font-bold text-slate-900 dark:text-white">— {rev.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    { question: "Telemedicina é segura?", answer: "Sim, utilizamos plataformas criptografadas que garantem sigilo total, seguindo todas as normas do Conselho Federal de Medicina (CFM) e da LGPD." },
    { question: "Qual a duração da consulta?", answer: "As consultas costumam durar entre 45 a 60 minutos, garantindo tempo suficiente para uma escuta atenta e explicações detalhadas." },
    { question: "Recebo receitas digitais e pedidos de exame?", answer: "Sim. Todas as receitas (inclusive de controle especial) e pedidos de exame são enviados digitalmente com assinatura eletrônica válida em todo o território nacional." },
    { question: "Privacidade dos meus dados?", answer: "Seus dados sensíveis são armazenados em prontuários eletrônicos seguros com acesso restrito, garantindo confidencialidade absoluta." },
    { question: "Como se preparar para a consulta?", answer: "Certifique-se de estar em um local privativo, com boa conexão de internet e fones de ouvido. Ter em mãos medicação em uso ajuda no processo." }
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">Dúvidas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="font-bold text-slate-800 dark:text-white">{faq.question}</span>
                {openIdx === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<null | 'success'>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      `Olá, gostaria de solicitar agendamento.`,
      `Nome: ${formData.name}`,
      `Telefone: ${formData.phone}`,
      `E-mail: ${formData.email}`,
      formData.message ? `Mensagem: ${formData.message}` : null
    ].filter(Boolean).join('\\n');
    const whatsappUrl = `https://wa.me/5511977920368?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setStatus('success');
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <section id="contato" className="py-24 bg-[#2D5B7C] text-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Vamos dar o próximo passo juntos?</h2>
          <p className="text-xl text-blue-100 mb-12">
            Agende sua consulta e inicie sua jornada de cuidado com suporte especializado e humanizado.
          </p>
          <div className="space-y-6">
            <a 
              href="https://wa.me/5511977920368" 
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-6 rounded-2xl transition-all border border-white/20 group"
            >
              <div className="w-12 h-12 bg-[#7EAA92] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle fill="white" size={24} />
              </div>
              <div>
                <div className="text-sm text-blue-100 uppercase font-bold tracking-wider">WhatsApp</div>
                <div className="text-lg font-bold">Falar agora pelo WhatsApp</div>
              </div>
            </a>
            <a 
              href="https://www.instagram.com/drahaabdalla/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 p-6 rounded-2xl border border-white/20"
            >
              <div className="w-12 h-12 bg-blue-100 text-[#2D5B7C] rounded-full flex items-center justify-center">
                <Instagram size={24} />
              </div>
              <div>
                <div className="text-sm text-blue-100 uppercase font-bold tracking-wider">Instagram</div>
                <div className="text-lg font-bold">@drahaabdalla</div>
              </div>
            </a>
          </div>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl text-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-[#2D5B7C] focus:ring-2 focus:ring-[#2D5B7C]/20 transition-all outline-none"
                placeholder="Como deseja ser chamado?"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Telefone/WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-[#2D5B7C] focus:ring-2 focus:ring-[#2D5B7C]/20 transition-all outline-none"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">E-mail</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-[#2D5B7C] focus:ring-2 focus:ring-[#2D5B7C]/20 transition-all outline-none"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Mensagem (opcional)</label>
              <textarea 
                rows={4}
                className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-[#2D5B7C] focus:ring-2 focus:ring-[#2D5B7C]/20 transition-all outline-none"
                placeholder="Conte-me brevemente como posso ajudar..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#2D5B7C] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#1e3d54] transition-all shadow-lg"
            >
              Enviar Solicitação de Agendamento
            </button>
            {status === 'success' && (
              <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold">
                Recebido! Entraremos em contato em breve.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 bg-slate-900 text-slate-400">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-12 mb-12 gap-8">
        <a href="/" className="flex items-center">
          <img 
            src="https://raw.githubusercontent.com/PHDStudioBR/PHDStudioImages/main/Dra%20Hajir%20Abdalla.svg" 
            alt="Dra. Hajir Abdalla" 
            className="h-10 filter grayscale brightness-200"
          />
        </a>
        <nav className="flex flex-wrap justify-center gap-8">
          <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
          <a href="#areas" className="hover:text-white transition-colors">Áreas</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <p>© 2024 Dra. Hajir Abdalla - Todos os direitos reservados. CRM/SP 207200.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white underline">Política de Privacidade</a>
          <a href="#" className="hover:text-white underline">Cancelamento</a>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/drahaabdalla/" target="_blank" className="hover:text-white" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/drahajirabdalla" target="_blank" className="hover:text-white" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://www.tiktok.com/@drahaabdalla" target="_blank" className="hover:text-white" aria-label="TikTok">
              <Music2 size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="relative bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Header />
      <main className="bg-slate-50 dark:bg-slate-900">
        <Hero />
        <HowItWorks />
        <AreasOfExpertise />
        <AboutSection />
        <Testimonials />
        <InstagramCarousel />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
      
      {/* Persistent Floating WhatsApp (Mobile Friendly) */}
      <a 
        href="https://wa.me/5511977920368" 
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform md:p-5"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={32} fill="currentColor" />
      </a>
    </div>
  );
}
