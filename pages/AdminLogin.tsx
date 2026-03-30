
import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-md w-full glass gold-border p-12 rounded-[50px] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 gold-bg opacity-30"></div>
        
        <div className="w-24 h-24 gold-bg/5 border border-gold-text/30 rounded-full flex items-center justify-center mx-auto mb-10 shadow-gold group">
          <Lock size={36} className="gold-text group-hover:scale-110 transition-transform" />
        </div>
        
        <h2 className="text-3xl font-bold gold-text uppercase tracking-[0.2em] mb-2">Secure Node</h2>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.5em] mb-10">Command Access Only</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="relative">
             <input 
                type="password" 
                autoFocus
                placeholder="ACCESS PASSCODE" 
                className={`w-full bg-white/5 border rounded-2xl px-6 py-5 outline-none transition-all text-center tracking-[0.5em] text-white focus:bg-white/10 ${error ? 'border-red-500 bg-red-500/5' : 'border-white/10 focus:border-gold-text'}`}
                onChange={e => setPassword(e.target.value)}
                value={password}
             />
           </div>
           
           <button className="w-full py-5 gold-bg text-black font-bold rounded-2xl shadow-gold hover:scale-[1.02] transition-all uppercase tracking-[0.3em] text-xs">
             Authenticate
           </button>

           {error && (
             <div className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-bold uppercase mt-4 animate-bounce">
                <AlertCircle size={14} /> Unauthorized Request
             </div>
           )}
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
