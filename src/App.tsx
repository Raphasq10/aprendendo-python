import { Terminal, Shield, Sparkles, Database } from 'lucide-react'

export function App() {
  return (
    <div className="min-h-screen bg-[#022b3a] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#033649] border border-[#1f7a8c] rounded-2xl p-8 shadow-2xl text-center space-y-6">
        
        {/* Badge do Projeto */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1f7a8c]/20 border border-[#1f7a8c] text-[#bfdbf7] text-sm font-semibold tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-[#bfdbf7]" />
          Projeto Inicial Configurado com Sucesso
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          ⚔️ PyQuest: As Crônicas dos Dados
        </h1>

        <p className="text-[#e1e5f2] text-lg leading-relaxed max-w-xl mx-auto">
          Estrutura base pronta! Frontend em <span className="text-[#bfdbf7] font-semibold">React + Vite + TypeScript</span>, estilizado com <span className="text-[#bfdbf7] font-semibold">Tailwind CSS</span> e preparado para integração com o banco <span className="text-[#bfdbf7] font-semibold">MySQL</span>.
        </p>

        {/* Cards de Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-4 rounded-xl bg-[#011d27] border border-[#1f7a8c]/30">
            <div className="flex items-center gap-2 text-[#bfdbf7] font-bold text-sm mb-1">
              <Terminal className="w-4 h-4 text-[#1f7a8c]" />
              Frontend
            </div>
            <p className="text-xs text-[#e1e5f2]">Vite + React 18 + TS rodando com HMR ativo.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#011d27] border border-[#1f7a8c]/30">
            <div className="flex items-center gap-2 text-[#bfdbf7] font-bold text-sm mb-1">
              <Shield className="w-4 h-4 text-[#1f7a8c]" />
              Estilização
            </div>
            <p className="text-xs text-[#e1e5f2]">Tailwind CSS + shadcn/ui com a paleta oficial.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#011d27] border border-[#1f7a8c]/30">
            <div className="flex items-center gap-2 text-[#bfdbf7] font-bold text-sm mb-1">
              <Database className="w-4 h-4 text-[#1f7a8c]" />
              Backend & Banco
            </div>
            <p className="text-xs text-[#e1e5f2]">MySQL via XAMPP (porta 3306) e API Node.js.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1f7a8c]/30 flex flex-wrap justify-center gap-4 text-xs text-[#bfdbf7]">
          <span>Pronto para os próximos passos pedagógicos</span>
          <span>•</span>
          <span>Nível 1 ao 50 (Júnior)</span>
        </div>

      </div>
    </div>
  )
}

export default App
