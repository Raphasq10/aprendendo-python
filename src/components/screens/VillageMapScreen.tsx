import { useState } from 'react'
import { BookOpen, ChevronRight, AlertCircle, RefreshCw, Star, Lock, Trophy, Flag } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Missao } from '@/data/mockData'

interface VillageMapScreenProps {
  missoes: Missao[];
  missaoAtivaId: number;
  onSelecionarMissao: (missaoId: number) => void;
  onIrParaDatapad: () => void;
}

// Nós expandidos da Trilha Sinuosa estilo Candy Crush / Mario World (Níveis 1 a 12 de demonstração rumo ao Nível 50)
interface NodoTrilha {
  nivel: number;
  missaoId?: number;
  tipo: 'missao' | 'bau' | 'chefe' | 'bloqueado';
  titulo: string;
  subtitulo: string;
  npcAvatar?: string;
  npcNome?: string;
  estrelas?: number;
  bloqueado: boolean;
  concluido: boolean;
  deslocamentoX: number; // Porcentagem horizontal de curvatura (-40 a 40)
}

export const VillageMapScreen: React.FC<VillageMapScreenProps> = ({
  missoes,
  missaoAtivaId,
  onSelecionarMissao,
  onIrParaDatapad,
}) => {
  const [estadoVisual, setEstadoVisual] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal')

  const missaoSelecionada = missoes.find(m => m.id === missaoAtivaId) || missoes[0]

  // Monta a Trilha Sinuosa estilo Candy Crush baseada nas missões e nos marcos rumo ao Nível 50
  const nodosTrilha: NodoTrilha[] = [
    {
      nivel: 1,
      missaoId: 1,
      tipo: 'missao',
      titulo: 'A Balança da Mercearia',
      subtitulo: 'Variáveis & Float',
      npcAvatar: '🧔',
      npcNome: 'Seu Zé',
      estrelas: 3,
      concluido: missoes[0]?.concluida ?? true,
      bloqueado: false,
      deslocamentoX: 0,
    },
    {
      nivel: 2,
      missaoId: 2,
      tipo: 'missao',
      titulo: 'O Cofrinho da Turma',
      subtitulo: 'f-strings & Troco',
      npcAvatar: '🍿',
      npcNome: 'Bia Pipoca',
      estrelas: 3,
      concluido: missoes[1]?.concluida ?? true,
      bloqueado: false,
      deslocamentoX: 25,
    },
    {
      nivel: 3,
      missaoId: 3,
      tipo: 'missao',
      titulo: 'A Catraca Justa do Parque',
      subtitulo: 'Regra da Peneira if/elif',
      npcAvatar: '🎫',
      npcNome: 'Fiscal Roberto',
      estrelas: missoes[2]?.concluida ? 3 : 0,
      concluido: missoes[2]?.concluida ?? false,
      bloqueado: false,
      deslocamentoX: 35,
    },
    {
      nivel: 4,
      tipo: 'bau',
      titulo: 'Baú de Bits & Recarga',
      subtitulo: 'Recompensa de Exploração',
      npcAvatar: '🎁',
      npcNome: 'Tesouro de Valedados',
      concluido: false,
      bloqueado: false,
      deslocamentoX: 15,
    },
    {
      nivel: 5,
      missaoId: 4,
      tipo: 'missao',
      titulo: 'O Robô Regador da Praça',
      subtitulo: 'Laços for & range()',
      npcAvatar: '🌻',
      npcNome: 'Dona Flor',
      estrelas: 0,
      concluido: missoes[3]?.concluida ?? false,
      bloqueado: false,
      deslocamentoX: -20,
    },
    {
      nivel: 6,
      missaoId: 5,
      tipo: 'missao',
      titulo: 'O Detector de Livros',
      subtitulo: 'Tratamento de None',
      npcAvatar: '📚',
      npcNome: 'Arquimedes',
      estrelas: 0,
      concluido: missoes[4]?.concluida ?? false,
      bloqueado: false,
      deslocamentoX: -35,
    },
    {
      nivel: 7,
      tipo: 'bau',
      titulo: 'Biblioteca Oculta',
      subtitulo: 'Dicas de Clean Code',
      npcAvatar: '📜',
      npcNome: 'Pergaminho Raro',
      concluido: false,
      bloqueado: true,
      deslocamentoX: -15,
    },
    {
      nivel: 8,
      missaoId: 6,
      tipo: 'chefe',
      titulo: 'Torre da Mestre Ada',
      subtitulo: 'Grande Desafio de Funções',
      npcAvatar: '🏛️',
      npcNome: 'Mestre Ada',
      estrelas: 0,
      concluido: missoes[5]?.concluida ?? false,
      bloqueado: false,
      deslocamentoX: 10,
    },
    {
      nivel: 10,
      tipo: 'chefe',
      titulo: 'Portal dos 50 Níveis',
      subtitulo: 'Continuação da Trilha Júnior',
      npcAvatar: '🏰',
      npcNome: 'Rumo ao Nível 50',
      concluido: false,
      bloqueado: true,
      deslocamentoX: 0,
    },
  ]

  // 1. Loading State
  if (estadoVisual === 'loading') {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <Skeleton className="h-10 w-80 bg-[#033649]" />
        <Skeleton className="h-[600px] w-full rounded-2xl bg-[#033649]" />
      </div>
    )
  }

  // 2. Error State
  if (estadoVisual === 'error') {
    return (
      <div className="max-w-xl mx-auto p-8 my-12 bg-[#033649] border border-red-500/50 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Falha ao Carregar a Trilha de Missões</h2>
        <p className="text-sm text-[#e1e5f2]/80">Não foi possível carregar os nós da rota do vilarejo.</p>
        <Button onClick={() => setEstadoVisual('normal')} className="bg-[#1f7a8c] text-white gap-2">
          <RefreshCw className="w-4 h-4" /> Tentar Novamente
        </Button>
      </div>
    )
  }

  // 3. Empty State
  if (estadoVisual === 'empty') {
    return (
      <div className="max-w-xl mx-auto p-8 my-12 bg-[#033649] border border-[#1f7a8c]/50 rounded-2xl text-center space-y-4">
        <Trophy className="w-12 h-12 text-[#bfdbf7] mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-white">Nenhum Caminho Desbloqueado</h2>
        <p className="text-sm text-[#e1e5f2]/80">Inicie sua primeira missão para desbloquear a trilha.</p>
        <Button onClick={() => setEstadoVisual('normal')} className="bg-[#1f7a8c] text-white">
          Restaurar Trilha
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Topo Informativo */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>🗺️ A Trilha de Valedados</span>
            </h1>
            <Badge className="bg-[#1f7a8c] text-white border-none font-bold text-xs">
              Estilo Caminho Candy Crush
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#e1e5f2]/80 mt-1">
            Avance pelos nós da trilha de paralelepípedos. Complete cada desafio para abrir o próximo caminho rumo ao Nível 50!
          </p>
        </div>

        {/* Simulador de Estados */}
        <div className="flex items-center gap-1.5 bg-[#011d27] border border-[#1f7a8c]/40 rounded-xl p-1 text-[11px]">
          <span className="text-[#bfdbf7] px-2 font-semibold">Simular Estado:</span>
          <button
            onClick={() => setEstadoVisual('normal')}
            className={`px-2 py-0.5 rounded-lg ${estadoVisual === 'normal' ? 'bg-[#1f7a8c] text-white font-bold' : 'text-[#e1e5f2]/60 hover:text-white'}`}
          >
            Normal
          </button>
          <button
            onClick={() => setEstadoVisual('loading')}
            className="px-2 py-0.5 rounded-lg text-[#e1e5f2]/60 hover:text-white"
          >
            Loading
          </button>
          <button
            onClick={() => setEstadoVisual('empty')}
            className="px-2 py-0.5 rounded-lg text-[#e1e5f2]/60 hover:text-white"
          >
            Vazio
          </button>
          <button
            onClick={() => setEstadoVisual('error')}
            className="px-2 py-0.5 rounded-lg text-[#e1e5f2]/60 hover:text-white"
          >
            Erro
          </button>
        </div>
      </div>

      {/* Grid: Trilha Sinuosa (Esquerda) e Detalhes da Fase (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA 8: A TRILHA SINUOSA ESTILO CANDY CRUSH / MARIO WORLD */}
        <div className="lg:col-span-8 bg-[#011d27] border-2 border-[#1f7a8c] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Fundo Atmosférico de Vilarejo com Estilo Pixel-Art */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundColor: '#022533',
              backgroundImage: `
                radial-gradient(#1f7a8c 1.5px, transparent 1.5px),
                linear-gradient(to right, rgba(31, 122, 140, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(31, 122, 140, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '28px 28px, 56px 56px, 56px 56px',
            }}
          />

          {/* Banner de Topo da Trilha */}
          <div className="relative z-10 flex justify-between items-center mb-6 pb-3 border-b border-[#1f7a8c]/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-[#bfdbf7] font-bold uppercase tracking-wider">
                MUNDO 1: VALEDADOS // TRILHA DOS DADOS
              </span>
            </div>
            <span className="text-xs text-[#e1e5f2]/70 font-semibold flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              Meta: Nível 50 (Promoção Pleno)
            </span>
          </div>

          {/* O CAMINHO SINUOSO (CONTAINER DOS NÓS) */}
          <div className="relative z-10 py-4 flex flex-col items-center space-y-10 sm:space-y-12">
            
            {nodosTrilha.map((nodo, index) => {
              const isAtivo = nodo.missaoId === missaoAtivaId
              const isUltimo = index === nodosTrilha.length - 1

              return (
                <div 
                  key={nodo.nivel}
                  style={{ transform: `translateX(${nodo.deslocamentoX}%)` }}
                  className="relative flex flex-col items-center transition-all duration-300"
                >
                  
                  {/* Linha/Caminho Conector Vertical Curvado para o Próximo Nó */}
                  {!isUltimo && (
                    <div 
                      className={`absolute top-16 w-3 h-12 sm:h-14 -z-10 rounded-full transition-colors ${
                        nodo.concluido
                          ? 'bg-gradient-to-b from-emerald-400 to-[#1f7a8c]'
                          : 'bg-[#022b3a] border border-dashed border-[#1f7a8c]/40'
                      }`}
                    />
                  )}

                  {/* O NÓ CIRCULAR ESTILO CANDY CRUSH / MARIO WORLD */}
                  <div className="relative group">
                    
                    {/* Personagem / Avatar Flutuando no Nó Atual */}
                    {isAtivo && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 animate-bounce">
                        <span className="text-2xl filter drop-shadow-md">🧙‍♂️</span>
                        <span className="bg-[#1f7a8c] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-white tracking-wide shadow-lg whitespace-nowrap">
                          Você Está Aqui!
                        </span>
                      </div>
                    )}

                    {/* Botão do Nó */}
                    <button
                      type="button"
                      disabled={nodo.bloqueado}
                      onClick={() => {
                        if (nodo.missaoId) {
                          onSelecionarMissao(nodo.missaoId)
                        }
                      }}
                      aria-label={`Fase ${nodo.nivel}: ${nodo.titulo}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center relative transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-[#bfdbf7] ${
                        nodo.bloqueado
                          ? 'bg-[#022b3a]/80 border-2 border-[#1f7a8c]/30 text-[#bfdbf7]/40 cursor-not-allowed opacity-60'
                          : isAtivo
                          ? 'bg-gradient-to-tr from-[#1f7a8c] to-[#bfdbf7] border-4 border-white scale-110 shadow-2xl shadow-[#1f7a8c]'
                          : nodo.concluido
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 border-3 border-emerald-300 hover:scale-105'
                          : 'bg-gradient-to-tr from-[#033649] to-[#1f7a8c] border-2 border-[#bfdbf7] hover:scale-105'
                      }`}
                    >
                      {/* Ícone de Cadeado se Bloqueado */}
                      {nodo.bloqueado && (
                        <Lock className="w-5 h-5 text-[#bfdbf7]/60" />
                      )}

                      {/* Conteúdo do Nó (Avatar / Número) */}
                      {!nodo.bloqueado && (
                        <>
                          <span className="text-xl sm:text-2xl filter drop-shadow">
                            {nodo.npcAvatar || '⭐'}
                          </span>
                          <span className="text-[11px] font-mono font-black text-white leading-none mt-0.5">
                            {nodo.nivel}
                          </span>
                        </>
                      )}

                      {/* Estrelas de Conquista Embaixo do Nó (Estilo Candy Crush) */}
                      {nodo.concluido && (
                        <div className="absolute -bottom-2.5 flex items-center gap-0.5 bg-[#011d27] px-1.5 py-0.5 rounded-full border border-amber-400 shadow">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </button>

                  </div>

                  {/* Rótulo da Fase ao Lado do Nó */}
                  <div className="mt-2 text-center max-w-[150px]">
                    <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                      <span>{nodo.titulo}</span>
                    </div>
                    <span className="text-[10px] text-[#bfdbf7]/70 font-mono block">
                      {nodo.subtitulo}
                    </span>
                  </div>

                </div>
              )
            })}

          </div>

          {/* Marco Final da Trilha: Rumo ao Nível 50 */}
          <div className="mt-10 pt-4 border-t border-[#1f7a8c]/40 text-center text-xs text-[#bfdbf7]/80 flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>A trilha continua se desdobrando até a grande formatura no <strong>Nível 50</strong>!</span>
          </div>

        </div>

        {/* COLUNA 4: PAINEL DA MISSÃO SELECIONADA */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          <Card className="bg-[#033649] border-2 border-[#1f7a8c] shadow-2xl text-white">
            <CardHeader className="pb-3 border-b border-[#1f7a8c]/30">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <Badge variant="outline" className="text-[10px] bg-[#1f7a8c]/20 border-[#1f7a8c] text-[#bfdbf7] mb-1">
                    Fase #{missaoSelecionada.ordem} da Trilha
                  </Badge>
                  <CardTitle className="text-lg font-bold text-white leading-snug">
                    {missaoSelecionada.titulo}
                  </CardTitle>
                </div>
                <div className="text-3xl p-2 bg-[#011d27] rounded-xl border border-[#1f7a8c]/40">
                  {missaoSelecionada.npc_avatar}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs sm:text-sm">
              
              {/* Diálogo do Personagem da Parada */}
              <div className="bg-[#011d27] p-3.5 rounded-xl border-l-4 border-[#1f7a8c] space-y-1">
                <div className="font-bold text-[#bfdbf7] text-xs">
                  {missaoSelecionada.npc_nome} diz:
                </div>
                <p className="italic text-[#e1e5f2]/90 leading-relaxed text-xs">
                  "{missaoSelecionada.npc_dialogo}"
                </p>
              </div>

              {/* Objetivo da Fase */}
              <div>
                <span className="font-bold text-[#bfdbf7] block mb-1 text-xs">
                  🎯 Desafio da Parada:
                </span>
                <p className="text-[#e1e5f2] text-xs bg-[#022b3a] p-2.5 rounded-lg border border-[#1f7a8c]/20">
                  {missaoSelecionada.objetivo_historia}
                </p>
              </div>

              {/* Citação Teórica do Livro */}
              <div className="p-2.5 rounded-lg bg-[#1f7a8c]/15 border border-[#1f7a8c]/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#bfdbf7]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Referência Bibliográfica:</span>
                </div>
                <p className="text-[11px] text-white/90">
                  {missaoSelecionada.referencia_livro}
                </p>
              </div>

              {/* Recompensas */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded-lg bg-[#011d27] border border-[#1f7a8c]/30">
                  <div className="text-[10px] text-[#bfdbf7]">RECOMPENSA</div>
                  <div className="text-sm font-bold text-white">+{missaoSelecionada.xp_recompensa} XP</div>
                </div>
                <div className="p-2 rounded-lg bg-[#011d27] border border-[#1f7a8c]/30">
                  <div className="text-[10px] text-amber-300">MOEDAS BITS</div>
                  <div className="text-sm font-bold text-amber-400">+{missaoSelecionada.bits_recompensa} 🪙</div>
                </div>
              </div>

              {/* Botão de Ação: Abrir no Datapad */}
              <Button
                onClick={onIrParaDatapad}
                className="w-full bg-[#1f7a8c] hover:bg-[#1f7a8c]/80 text-white font-bold py-2.5 gap-2 shadow-lg"
              >
                <span>Jogar Fase no Datapad</span>
                <ChevronRight className="w-4 h-4" />
              </Button>

            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
