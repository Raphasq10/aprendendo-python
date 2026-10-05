import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { AuthScreen } from '@/components/screens/AuthScreen'
import { VillageMapScreen } from '@/components/screens/VillageMapScreen'
import { MissionDatapadScreen } from '@/components/screens/MissionDatapadScreen'
import { RepairStationScreen } from '@/components/screens/RepairStationScreen'
import { ProfileScreen } from '@/components/screens/ProfileScreen'
import { JOGADOR_INICIAL, MISSOES_MOCK, type Jogador, type Missao } from '@/data/mockData'

export function App() {
  // Estado de Autenticação
  const [estaAutenticado, setEstaAutenticado] = useState(true)
  const [jogador, setJogador] = useState<Jogador>(JOGADOR_INICIAL)

  // Estado de Navegação do Jogo
  const [abaAtiva, setAbaAtiva] = useState<'mapa' | 'missao' | 'oficina' | 'perfil'>('mapa')
  
  // Estado das Missões
  const [missoes, setMissoes] = useState<Missao[]>(MISSOES_MOCK)
  const [missaoAtivaId, setMissaoAtivaId] = useState<number>(MISSOES_MOCK[2].id) // Missão 3 por padrão

  const missaoAtiva = missoes.find(m => m.id === missaoAtivaId) || missoes[0]

  // Handlers de Ações Pedagógicas
  const handleLogin = (dados: { apelido: string; email: string; avatar: string }) => {
    setJogador(prev => ({
      ...prev,
      apelido: dados.apelido,
      email: dados.email,
      avatar: dados.avatar,
    }))
    setEstaAutenticado(true)
    setAbaAtiva('mapa')
  }

  const handleLogout = () => {
    setEstaAutenticado(false)
  }

  const handleConcluirMissao = (missaoId: number) => {
    setMissoes(prev => prev.map(m => m.id === missaoId ? { ...m, concluida: true } : m))
    setJogador(prev => {
      const novoXp = prev.xp_atual + 100
      let novoNivel = prev.nivel
      let proxXp = prev.xp_proximo_nivel

      if (novoXp >= proxXp) {
        novoNivel += 1
        proxXp = Math.round(proxXp * 1.3)
      }

      return {
        ...prev,
        xp_atual: novoXp,
        nivel: novoNivel,
        xp_proximo_nivel: proxXp,
        bits_moedas: prev.bits_moedas + 30,
      }
    })
  }

  const handleFalharMissao = () => {
    setJogador(prev => ({
      ...prev,
      bateria_atual: Math.max(0, prev.bateria_atual - 10),
    }))
  }

  const handleConcluirTreino = (xpGanho: number, bateriaRecarregada: number) => {
    setJogador(prev => ({
      ...prev,
      xp_atual: prev.xp_atual + xpGanho,
      bateria_atual: Math.min(100, prev.bateria_atual + bateriaRecarregada),
    }))
  }

  // 1. Layout Público (Sem Login)
  if (!estaAutenticado) {
    return <AuthScreen onLoginSucesso={handleLogin} />
  }

  // 2. Layout Autenticado (Com HUD Persistente e Navegação)
  return (
    <div className="min-h-screen bg-[#022b3a] text-white flex flex-col font-sans selection:bg-[#1f7a8c] selection:text-white">
      
      {/* Top Navbar com HUD de Status */}
      <Navbar
        jogador={jogador}
        abaAtiva={abaAtiva}
        onMudarAba={setAbaAtiva}
        onLogout={handleLogout}
      />

      {/* Área Principal de Conteúdo das Telas */}
      <main className="flex-1 pb-12">
        {abaAtiva === 'mapa' && (
          <VillageMapScreen
            missoes={missoes}
            missaoAtivaId={missaoAtivaId}
            onSelecionarMissao={(id) => setMissaoAtivaId(id)}
            onIrParaDatapad={() => setAbaAtiva('missao')}
          />
        )}

        {abaAtiva === 'missao' && (
          <MissionDatapadScreen
            missao={missaoAtiva}
            bateriaAtual={jogador.bateria_atual}
            onConcluirMissao={handleConcluirMissao}
            onFalharMissao={handleFalharMissao}
          />
        )}

        {abaAtiva === 'oficina' && (
          <RepairStationScreen
            bateriaAtual={jogador.bateria_atual}
            onConcluirTreino={handleConcluirTreino}
          />
        )}

        {abaAtiva === 'perfil' && (
          <ProfileScreen
            jogador={jogador}
          />
        )}
      </main>

      {/* Footer com Links Úteis & Referências dos Livros */}
      <footer className="border-t border-[#1f7a8c]/30 bg-[#01161e] py-6 px-4 text-center text-xs text-[#bfdbf7]/70 space-y-2">
        <p>
          ⚔️ <strong>PyQuest: As Crônicas dos Dados</strong> • Metodologia baseada em <em>A Theory of Fun</em> (Raph Koster) e nos 5 livros de referência.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-[#e1e5f2]/60">
          <a href="slides.html" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
            📖 Acessar Slides Originais
          </a>
          <span>•</span>
          <span>Banco de Dados: MySQL (XAMPP Porta 3306)</span>
          <span>•</span>
          <span>Ambiente: React 18 + Vite + Tailwind CSS</span>
        </div>
      </footer>

    </div>
  )
}

export default App
