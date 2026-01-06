
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, CaseType, AnalysisResult, User } from './types';
import { gemini } from './services/geminiService';
import { 
  Scale, 
  MessageSquare, 
  FileSearch, 
  Mic, 
  Send, 
  AlertTriangle, 
  Info, 
  MapPin, 
  Search, 
  Brain,
  Camera,
  CheckCircle2,
  ChevronRight,
  Gavel,
  ShieldCheck,
  X,
  RefreshCw,
  Check,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  Lock,
  Mail,
  Zap,
  Maximize,
  Sun,
  Shield,
  Users,
  Building2,
  HeartHandshake,
  Baby,
  HandHelping,
  PhoneCall,
  Landmark,
  FileText,
  CreditCard,
  Languages,
  BadgeAlert,
  HardHat,
  Briefcase,
  Store,
  DollarSign,
  UserCheck,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const AuthView: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const userData: User = {
        name: isLogin ? (email.split('@')[0] || 'Citizen') : name,
        email: email,
        joinedAt: Date.now()
      };
      onLogin(userData);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#064e3b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]" />
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="p-10 text-center bg-emerald-50/50 border-b border-emerald-100">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Scale className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-emerald-950">Wakalat.ai</h1>
          <p className="text-emerald-700 font-medium text-sm mt-2">Simplified Legal Guidance for Pakistan</p>
        </div>
        <div className="p-10">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8" role="tablist">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-emerald-700 shadow-lg' : 'text-slate-500'}`}>Sign In</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-emerald-700 shadow-lg' : 'text-slate-500'}`}>Register</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            )}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : isLogin ? <><LogIn className="w-5 h-5" /> Sign In</> : <><UserPlus className="w-5 h-5" /> Create Account</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper component for simple markdown-like rendering
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|###\s[^\n]+)/g);
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-black text-emerald-950 mt-4 mb-2 first:mt-0">{part.replace('### ', '')}</h3>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-black text-emerald-800">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'directory'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [directorySearch, setDirectorySearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Analysis specific states
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisImageData, setAnalysisImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [followUpMessages, setFollowUpMessages] = useState<ChatMessage[]>([]);
  const [followUpInput, setFollowUpInput] = useState('');
  const [isFollowUpTyping, setIsFollowUpTyping] = useState(false);

  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const followUpEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wakalat_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      initializeChat(u.name);
    }
    navigator.geolocation.getCurrentPosition(
      p => setLocation({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      e => console.log("Location denied")
    );
  }, []);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isTyping]);
  useEffect(() => followUpEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [followUpMessages, isFollowUpTyping]);

  const initializeChat = (name: string) => {
    setMessages([{ role: 'model', text: `Salaam, ${name}! I'm Wakalat.ai. I can simplify Pakistani legal documents or procedures for you. How can I help?`, timestamp: Date.now() }]);
  };

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const stream = await gemini.chatStream(text, history, {
        useThinking,
        useSearch: useSearch || text.includes('news') || text.includes('today'),
        useMaps: text.includes('near') || text.includes('where'),
        latLng: location || undefined
      });

      let fullText = "";
      const modelId = Date.now();
      let grounding: any[] = [];
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: modelId, isThinking: useThinking }]);

      for await (const chunk of stream) {
        fullText += chunk.text;
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            grounding = chunk.candidates[0].groundingMetadata.groundingChunks
                .map((c: any) => c.web || c.maps)
                .filter(Boolean);
        }
        setMessages(prev => prev.map(m => m.timestamp === modelId ? { ...m, text: fullText, groundingUrls: grounding.length > 0 ? grounding : m.groundingUrls } : m));
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "Mafi chahta hoon, technical masala aa gaya hai. Dobara koshish karein.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFollowUpSend = async (overrideInput?: string) => {
    const text = overrideInput || followUpInput;
    if (!text.trim() || !analysis) return;

    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    setFollowUpMessages(prev => [...prev, userMsg]);
    setFollowUpInput('');
    setIsFollowUpTyping(true);

    try {
      const history = followUpMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const prompt = `Context: The user previously analyzed a document.
Original Analysis Summary: ${analysis.summary}
Original Risks: ${analysis.risks.join(', ')}
Original Next Steps: ${analysis.nextSteps.join(', ')}

User Question about this document: ${text}`;

      const stream = await gemini.chatStream(prompt, history, { useThinking: true });

      let fullText = "";
      const modelId = Date.now();
      setFollowUpMessages(prev => [...prev, { role: 'model', text: '', timestamp: modelId }]);

      for await (const chunk of stream) {
        fullText += chunk.text;
        setFollowUpMessages(prev => prev.map(m => m.timestamp === modelId ? { ...m, text: fullText } : m));
      }
    } catch (e) {
      console.error(e);
      setFollowUpMessages(prev => [...prev, { role: 'model', text: "Shumariati khata. Dobara try karein.", timestamp: Date.now() }]);
    } finally {
      setIsFollowUpTyping(false);
    }
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('wakalat_user'); };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          setIsTyping(true);
          const transcription = await gemini.transcribeAudio(base64);
          if (transcription) handleSend(transcription);
          setIsTyping(false);
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (e) { console.error(e); }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const processAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    setFollowUpMessages([]); 
    setAnalysisImageData(base64);
    try {
      const res = await gemini.analyzeDocument(base64, 'image/jpeg');
      setAnalysis(res);
    } catch (e) { alert("Analysis error."); } finally { setIsAnalyzing(false); setCapturedImage(null); }
  };

  const assistanceCategories = [
    { id: 'police', label: 'Police', icon: Shield, color: 'blue', query: 'Find nearest Police Stations and explain how to file an FIR.' },
    { id: 'courts', label: 'Courts', icon: Landmark, color: 'emerald', query: 'Find District and Sessions Courts near me.' },
    { id: 'nadra', label: 'NADRA', icon: CreditCard, color: 'indigo', query: 'Find nearest NADRA Registration Centers.' },
    { id: 'ombudsman', label: 'Ombudsman', icon: HeartHandshake, color: 'teal', query: 'Find Federal or Provincial Ombudsman (Mohtasib) offices for government complaints.' },
    { id: 'consumer', label: 'Consumer Rights', icon: Store, color: 'amber', query: 'How to file a complaint in a Consumer Court and where is the nearest one?' },
    { id: 'women', label: 'Women Protection', icon: Users, color: 'rose', query: 'Find Women Protection Centers and explain legal rights for women in Pakistan.' },
    { id: 'child', label: 'Child Welfare', icon: Baby, color: 'sky', query: 'Find Child Protection and Welfare Bureau offices.' },
    { id: 'legal-aid', label: 'Legal Aid', icon: HandHelping, color: 'orange', query: 'Find free legal aid clinics and pro-bono lawyers in my city.' },
    { id: 'fbr', label: 'Tax/FBR', icon: DollarSign, color: 'green', query: 'Find nearest FBR Regional Tax Offices and help with NTN/Filer status.' },
    { id: 'labour', label: 'Labour Dept', icon: HardHat, color: 'yellow', query: 'Find Directorate of Labour Welfare for employment disputes.' },
    { id: 'human-rights', label: 'Human Rights', icon: UserCheck, color: 'violet', query: 'Find National Commission for Human Rights (NCHR) offices.' },
    { id: 'revenue', label: 'Land/Revenue', icon: FileText, color: 'stone', query: 'Find nearest Patwarkhana or Revenue Department office for land records.' },
  ];

  const filteredCategories = assistanceCategories.filter(cat => 
    cat.label.toLowerCase().includes(directorySearch.toLowerCase())
  );

  if (!user) return <AuthView onLogin={u => { setUser(u); localStorage.setItem('wakalat_user', JSON.stringify(u)); initializeChat(u.name); }} />;

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-medium">
      <header className="fixed top-0 left-0 right-0 h-20 bg-emerald-900/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 z-[100] text-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg"><Scale className="text-emerald-900 w-6 h-6" /></div>
          <h1 className="text-xl font-black tracking-tight">Wakalat.ai</h1>
        </div>
        <div className="flex bg-white/10 p-1 rounded-xl ring-1 ring-white/20">
          {[
            { id: 'analyze', label: 'Summarize & Analyze', icon: FileSearch },
            { id: 'directory', label: 'Resource Directory', icon: MapPin },
            { id: 'chat', label: 'AI Assistant', icon: MessageSquare }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold ${activeTab === tab.id ? 'bg-white text-emerald-900 shadow-md' : 'text-emerald-100 hover:bg-white/5'}`}>
              <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <button onClick={handleLogout} className="w-10 h-10 bg-white/10 hover:bg-red-500/20 rounded-xl flex items-center justify-center transition-all"><LogOut className="w-5 h-5" /></button>
      </header>

      <main className={`flex-1 overflow-y-auto mt-20 ${activeTab === 'chat' ? 'pb-40' : 'pb-10'} px-6`}>
        <div className="max-w-5xl mx-auto py-8">
          {activeTab === 'chat' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[90%] p-6 rounded-[2rem] shadow-sm ${m.role === 'user' ? 'bg-emerald-800 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                    {m.isThinking && <div className="text-[10px] font-black uppercase text-slate-400 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2"><Brain className="w-3 h-3" /> Thinking Process</div>}
                    <div className="text-[15px] leading-relaxed">
                        <FormattedText text={m.text || "..."} />
                    </div>
                    {m.groundingUrls && m.groundingUrls.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sources & Links</p>
                            <div className="flex flex-wrap gap-2">
                                {m.groundingUrls.map((g, idx) => (
                                    <a key={idx} href={g.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors">
                                        <ExternalLink className="w-3 h-3" /> {g.title || 'Source'}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && <div className="p-4 bg-white border border-slate-200 rounded-full w-20 flex justify-center gap-1 animate-pulse"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /></div>}
              <div ref={messagesEndRef} />
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {!analysis && !isAnalyzing && !capturedImage && (
                <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-200 text-center hover:border-emerald-500 transition-all group">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8"><Camera className="text-emerald-600 w-10 h-10" /></div>
                  <h2 className="text-2xl font-black mb-4">Analyze Legal Docs</h2>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Get a simplified summary of any FIR, contract, or notice.</p>
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => { navigator.mediaDevices.getUserMedia({ video: true }).then(s => { setIsCameraOpen(true); setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 100); }); }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-emerald-700 transition-all"><Camera className="w-5 h-5" /> Take Photo</button>
                    <label className="cursor-pointer bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"><input type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setCapturedImage(r.result as string); r.readAsDataURL(f); } }} /> Upload</label>
                  </div>
                </div>
              )}

              {isCameraOpen && (
                <div className="relative bg-black rounded-3xl overflow-hidden aspect-[3/4] max-w-lg mx-auto shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 px-6">
                    <button onClick={() => { const s = videoRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t => t.stop()); setIsCameraOpen(false); }} className="p-5 bg-white/20 backdrop-blur-xl rounded-2xl text-white"><X className="w-6 h-6" /></button>
                    <button onClick={() => { if (videoRef.current && canvasRef.current) { const c = canvasRef.current; c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight; c.getContext('2d')?.drawImage(videoRef.current, 0, 0); setCapturedImage(c.toDataURL('image/jpeg')); const s = videoRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t => t.stop()); setIsCameraOpen(false); } }} className="p-6 bg-white rounded-full shadow-2xl active:scale-95"><div className="w-8 h-8 rounded-full border-4 border-emerald-600" /></button>
                  </div>
                </div>
              )}

              {capturedImage && !isAnalyzing && (
                <div className="max-w-lg mx-auto bg-white p-8 rounded-[2.5rem] shadow-xl text-center">
                  <img src={capturedImage} className="w-full rounded-2xl mb-6 shadow-md border" />
                  <div className="flex gap-4">
                    <button onClick={() => setCapturedImage(null)} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold">Retake</button>
                    <button onClick={() => processAnalysis(capturedImage.split(',')[1])} className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg">Analyze Now</button>
                  </div>
                </div>
              )}

              {isAnalyzing && <div className="p-20 text-center animate-pulse"><div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" /><h3 className="text-xl font-bold">Reviewing legal context...</h3></div>}

              {analysis && (
                <div className="space-y-6 animate-in slide-in-from-bottom-8">
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2"><CheckCircle2 className="text-emerald-600" /> Summary</h3>
                      <button onClick={() => { setAnalysis(null); setFollowUpMessages([]); }} className="text-slate-400 hover:text-red-500 transition-colors"><RefreshCw className="w-5 h-5" /></button>
                    </div>
                    <p className="text-slate-700 leading-relaxed bg-emerald-50/30 p-6 rounded-2xl italic border-l-4 border-emerald-500 font-semibold">"{analysis.summary}"</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border">
                      <h4 className="font-black text-lg mb-4 flex items-center gap-2 text-amber-600"><AlertTriangle className="w-5 h-5" /> Key Risks</h4>
                      <ul className="space-y-4">{analysis.risks.map((r, i) => <li key={i} className="text-sm font-semibold text-slate-600 flex gap-3"><div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" /> {r}</li>)}</ul>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border">
                      <h4 className="font-black text-lg mb-4 flex items-center gap-2 text-emerald-600"><ChevronRight className="w-5 h-5" /> Next Steps</h4>
                      <div className="space-y-4">{analysis.nextSteps.map((s, i) => <div key={i} className="flex gap-4 items-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl shadow-sm"><span className="w-8 h-8 bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center justify-center shrink-0">{i+1}</span><span className="text-sm font-bold text-slate-700">{s}</span></div>)}</div>
                    </div>
                  </div>

                  {/* Follow-up Questions Section */}
                  <div className="mt-12 space-y-6 pt-8 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-emerald-950">Ask follow-up questions</h3>
                        <p className="text-sm text-slate-500 font-medium">Get deeper clarity on specific parts of the document.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {followUpMessages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
                          <div className={`max-w-[85%] p-5 rounded-2xl shadow-sm text-sm font-medium ${m.role === 'user' ? 'bg-emerald-700 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                            <FormattedText text={m.text} />
                          </div>
                        </div>
                      ))}
                      {isFollowUpTyping && (
                        <div className="flex gap-2 p-4 bg-slate-50 rounded-2xl w-24 justify-center animate-pulse">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                        </div>
                      )}
                      <div ref={followUpEndRef} />
                    </div>

                    {followUpMessages.length === 0 && (
                      <div className="flex flex-wrap gap-2">
                        {["Is this document legally binding?", "Explain the risks further.", "What is the deadline mentioned?", "What happens if I don't follow the next steps?"].map(suggestion => (
                          <button 
                            key={suggestion}
                            onClick={() => handleFollowUpSend(suggestion)}
                            className="px-5 py-2.5 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="relative group shadow-xl rounded-[2rem]">
                      <input 
                        type="text" 
                        value={followUpInput}
                        onChange={(e) => setFollowUpInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFollowUpSend()}
                        placeholder="Type your question about this document..."
                        className="w-full pl-6 pr-16 py-5 bg-white border-2 border-slate-100 focus:border-emerald-500 rounded-[2rem] outline-none transition-all font-bold text-sm"
                      />
                      <button 
                        onClick={() => handleFollowUpSend()}
                        disabled={!followUpInput.trim() || isFollowUpTyping}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center disabled:opacity-50 hover:bg-emerald-700 transition-colors shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'directory' && (
            <div className="space-y-10">
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl">
                      <Building2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-4xl font-black">Legal Directory</h2>
                  </div>
                  <p className="text-slate-400 mb-8 font-medium text-lg max-w-xl">Find specialized government offices, courts, help desks, and protection bureaus near you across Pakistan.</p>
                  <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input type="text" value={directorySearch} onChange={e => setDirectorySearch(e.target.value)} placeholder="Search for Courts, NADRA, Police..." className="w-full pl-12 pr-6 py-4 bg-white/10 rounded-2xl outline-none border border-white/10 focus:ring-2 focus:ring-emerald-500 transition-all font-bold placeholder:text-slate-600" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map(cat => (
                    <button key={cat.id} onClick={() => { setActiveTab('chat'); handleSend(cat.query); }} className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
                      <div className={`w-14 h-14 bg-${cat.color}-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><cat.icon className={`w-7 h-7 text-${cat.color}-600`} /></div>
                      <h4 className="font-black text-slate-900 text-lg mb-1">{cat.label}</h4>
                      <p className="text-xs text-slate-500 font-medium">Click to find nearby offices and view legal guidance.</p>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No resources found matching your search.</p>
                  </div>
                )}
              </div>

              <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm"><BadgeAlert className="w-6 h-6 text-emerald-600" /></div>
                  <div>
                    <h5 className="font-black text-emerald-950">Emergency Contact Numbers</h5>
                    <p className="text-sm text-emerald-700 font-medium">Immediate help channels for critical situations.</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 uppercase">Police</span>
                    <span className="text-xl font-black text-emerald-700">15</span>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 uppercase">Ambulance</span>
                    <span className="text-xl font-black text-emerald-700">115</span>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 uppercase">FIA Cyber</span>
                    <span className="text-xl font-black text-emerald-700">1991</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {activeTab === 'chat' ? (
        <div className="fixed bottom-8 left-0 right-0 px-8 z-50">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-4 shadow-2xl border border-white ring-1 ring-slate-200/50">
            <div className="flex gap-3 mb-4 px-2">
              <button onClick={() => setUseThinking(!useThinking)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${useThinking ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border'}`}><Brain className="w-3 h-3 inline mr-2" /> Reasoning Mode</button>
              <button onClick={() => setUseSearch(!useSearch)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${useSearch ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 border'}`}><Search className="w-3 h-3 inline mr-2" /> Live Web Search</button>
            </div>
            <div className="flex gap-4 items-center">
              <button onMouseDown={startRecording} onMouseUp={stopRecording} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><Mic className="w-6 h-6" /></button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask anything about law, FIRs or property..." className="flex-1 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-[2rem] px-8 py-5 font-bold outline-none transition-all shadow-inner" />
              <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-xl active:scale-95"><Send className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setActiveTab('chat')} className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 ring-4 ring-white"><MessageSquare className="w-7 h-7" /></button>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default App;
