import { BatteryCharging, BatteryWarning, Coins, Map, Terminal, Wrench, User, LogOut } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Jogador } from '@/data/mockData'

interface NavbarProps {
  jogador: Jogador;
  abaAtiva: 'mapa' | 'missao' | 'oficina' | 'perfil';
  onMudarAba: (aba: 'mapa' | 'missao' | 'oficina' | 'perfil') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ jogador, abaAtiva, onMudarAba, onLogout }) => {
  const pctXp = Math.min(100, Math.round((jogador.xp_atual / jogador.xp_proximo_nivel) * 100))
  const bateriaBaixa = jogador.bateria_atual <= 25

  return (
    <header className="sticky top-0 z-50 bg-[#022b3a]/95 backdrop-blur-md border-b border-[#1f7a8c]/40 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Marca & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f7a8c] to-[#022b3a] border border-[#bfdbf7]/40 flex items-center justify-center text-xl shadow-md">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-wide">PyQuest</span>
              <Badge variant="outline" className="text-[10px] bg-[#1f7a8c]/20 border-[#1f7a8c] text-[#bfdbf7]">
                Mundo 1: Júnior
              </Badge>
            </div>
            <p className="text-xs text-[#bfdbf7]/70">As Crônicas dos Dados</p>
          </div>
        </div>

        {/* HUD do Jogador (XP, Bateria, Bits) */}
        <div className="flex items-center gap-4 bg-[#011d27] border border-[#1f7a8c]/30 rounded-2xl px-4 py-2">
          
          {/* Avatar e Patente */}
          <div className="flex items-center gap-2 pr-3 border-r border-[#1f7a8c]/30">
            <span className="text-2xl" role="img" aria-label="Avatar do Jogador">{jogador.avatar}</span>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">{jogador.apelido}</div>
              <div className="text-[11px] text-[#bfdbf7]">Nv. {jogador.nivel} • {jogador.patente}</div>
            </div>
          </div>

          {/* Barra de XP */}
          <div className="w-28 sm:w-36">
            <div className="flex justify-between text-[10px] font-semibold text-[#bfdbf7] mb-1">
              <span>XP</span>
              <span>{jogador.xp_atual}/{jogador.xp_proximo_nivel}</span>
            </div>
            <Progress value={pctXp} className="h-2 bg-[#022b3a]" indicatorClassName="bg-gradient-to-r from-[#1f7a8c] to-[#bfdbf7]" />
          </div>

          {/* Bateria do Datapad */}
          <div className="w-24 sm:w-28">
            <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
              <span className={`flex items-center gap-1 ${bateriaBaixa ? 'text-red-400 font-bold' : 'text-[#e1e5f2]'}`}>
                {bateriaBaixa ? <BatteryWarning className="w-3 h-3 text-red-400 animate-pulse" /> : <BatteryCharging className="w-3 h-3 text-emerald-400" />}
                DATAPAD
              </span>
              <span className={bateriaBaixa ? 'text-red-400 font-bold' : 'text-[#bfdbf7]'}>{jogador.bateria_atual}%</span>
            </div>
            <Progress 
              value={jogador.bateria_atual} 
              className="h-2 bg-[#022b3a]" 
              indicatorClassName={bateriaBaixa ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'} 
            />
          </div>

          {/* Moedas Bits */}
          <div className="flex items-center gap-1 pl-2 border-l border-[#1f7a8c]/30 text-amber-300 font-bold text-xs sm:text-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{jogador.bits_moedas}</span>
          </div>

        </div>

        {/* Navegação Entre Telas */}
        <nav aria-label="Menu Principal do Jogo" className="flex items-center gap-1 sm:gap-2">
          <Button
            variant={abaAtiva === 'mapa' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onMudarAba('mapa')}
            className={`text-xs gap-1.5 ${abaAtiva === 'mapa' ? 'bg-[#1f7a8c] hover:bg-[#1f7a8c]/80 text-white font-bold' : 'text-[#bfdbf7] hover:bg-[#033649]'}`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Vilarejo</span>
          </Button>

          <Button
            variant={abaAtiva === 'missao' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onMudarAba('missao')}
            className={`text-xs gap-1.5 ${abaAtiva === 'missao' ? 'bg-[#1f7a8c] hover:bg-[#1f7a8c]/80 text-white font-bold' : 'text-[#bfdbf7] hover:bg-[#033649]'}`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Datapad</span>
          </Button>

          <Button
            variant={abaAtiva === 'oficina' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onMudarAba('oficina')}
            className={`text-xs gap-1.5 ${abaAtiva === 'oficina' ? 'bg-[#1f7a8c] hover:bg-[#1f7a8c]/80 text-white font-bold' : 'text-[#bfdbf7] hover:bg-[#033649]'}`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Oficina</span>
          </Button>

          <Button
            variant={abaAtiva === 'perfil' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onMudarAba('perfil')}
            className={`text-xs gap-1.5 ${abaAtiva === 'perfil' ? 'bg-[#1f7a8c] hover:bg-[#1f7a8c]/80 text-white font-bold' : 'text-[#bfdbf7] hover:bg-[#033649]'}`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Perfil</span>
          </Button>

          {/* Sair / Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            title="Sair do Perfil"
            aria-label="Sair do Perfil"
            className="text-[#bfdbf7] hover:bg-red-500/20 hover:text-red-400 ml-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </nav>

      </div>
    </header>
  )
}
