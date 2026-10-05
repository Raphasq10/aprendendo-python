import { useState } from 'react'
import { MapPin, BookOpen, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
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

export const VillageMapScreen: React.FC<VillageMapScreenProps> = ({
  missoes,
  missaoAtivaId,
  onSelecionarMissao,
  onIrParaDatapad,
}) => {
  const [missaoHover, setMissaoHover] = useState<Missao | null>(null)
  const [estadoVisual, setEstadoVisual] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal')

  const missaoSelecionada = missoes.find(m => m.id === missaoAtivaId) || missoes[0]
  const missaoEmDestaque = missaoHover || missaoSelecionada

  // 1. Loading State (Requisito #6)
  if (estadoVisual === 'loading') {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64 bg-[#033649]" />
          <Skeleton className="h-8 w-32 bg-[#033649]" />
        </div>
        <Skeleton className="h-[480px] w-full rounded-2xl bg-[#033649]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 bg-[#033649] rounded-xl" />
          <Skeleton className="h-28 bg-[#033649] rounded-xl" />
          <Skeleton className="h-28 bg-[#033649] rounded-xl" />
        </div>
      </div>
    )
  }

  // 2. Error State (Requisito #6)
  if (estadoVisual === 'error') {
    return (
      <div className="max-w-xl mx-auto p-8 my-12 bg-[#033649] border border-red-500/50 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Falha ao Renderizar o Vilarejo</h2>
        <p className="text-sm text-[#e1e5f2]/80">
          Não foi possível sincronizar o mapa de Valedados com o banco de dados.
        </p>
        <Button onClick={() => setEstadoVisual('normal')} className="bg-[#1f7a8c] text-white gap-2">
          <RefreshCw className="w-4 h-4" /> Tentar Novamente
        </Button>
      </div>
    )
  }

  // 3. Empty State (Requisito #6)
  if (estadoVisual === 'empty' || missoes.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 my-12 bg-[#033649] border border-[#1f7a8c]/50 rounded-2xl text-center space-y-4">
        <MapPin className="w-12 h-12 text-[#bfdbf7] mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-white">Nenhuma Missão Descoberta</h2>
        <p className="text-sm text-[#e1e5f2]/80">
          Você ainda não explorou este território do Vilarejo de Valedados.
        </p>
        <Button onClick={() => setEstadoVisual('normal')} className="bg-[#1f7a8c] text-white">
          Restaurar Mapa Completo
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Barra de Título & Alternador de Estados Visuais */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              🏡 Vilarejo de Valedados
            </h1>
            <Badge className="bg-[#1f7a8c] text-white border-none font-bold text-xs">
              Mundo 1: Patente Júnior (Nv. 1 a 50)
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#e1e5f2]/80 mt-1">
            Explore os pontos de interesse no mapa em pixel art. Clique em uma construção para conversar com o cidadão!
          </p>
        </div>

        {/* Simulador de Estados (para validação do aluno) */}
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

      {/* Grid Principal: Mapa 2D à Esquerda e Detalhes da Missão à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* MAPA VISÍVEL EM PIXEL ART (Col 8) */}
        <div className="lg:col-span-8 bg-[#011d27] border-2 border-[#1f7a8c] rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          
          {/* Header do Mapa com Efeito Retrô */}
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#1f7a8c]/30 text-xs">
            <span className="font-mono text-[#bfdbf7] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              GPS: SETOR RURAL DE VALEDADOS (16-BIT TILEMAP)
            </span>
            <span className="text-[#e1e5f2]/70 font-mono text-[11px]">ESCALA: 1 PIXEL = 1 METRO</span>
          </div>

          {/* O CANVAS VISUAL DO MAPA DO VILAREJO */}
          <div 
            className="relative w-full h-[380px] sm:h-[460px] rounded-xl overflow-hidden border border-[#1f7a8c]/40 select-none"
            style={{
              backgroundColor: '#032533',
              backgroundImage: `
                radial-gradient(#1f7a8c 1px, transparent 1px),
                linear-gradient(to right, rgba(31, 122, 140, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(31, 122, 140, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px, 48px 48px, 48px 48px',
            }}
          >
            
            {/* Ruas e Caminhos de Pedra em Pixel Art (Traçados SVG de fundo) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
              {/* Estrada Principal */}
              <path d="M 0 200 Q 200 180 400 240 T 800 220" stroke="#bfdbf7" strokeWidth="24" fill="none" strokeDasharray="4 4" />
              <path d="M 300 0 L 300 480" stroke="#bfdbf7" strokeWidth="18" fill="none" strokeDasharray="4 4" />
              {/* Praça Central */}
              <circle cx="50%" cy="50%" r="65" fill="#022b3a" stroke="#1f7a8c" strokeWidth="4" />
            </svg>

            {/* Chafariz Central de Dados */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
              <div className="text-3xl animate-bounce">⛲</div>
              <span className="text-[10px] font-mono font-bold text-[#bfdbf7] bg-[#022b3a]/90 px-2 py-0.5 rounded border border-[#1f7a8c]">
                Fonte dos Bytes
              </span>
            </div>

            {/* Elementos Decorativos de Vilarejo (Árvores em Pixel) */}
            <div className="absolute top-6 left-6 text-2xl opacity-60">🌲</div>
            <div className="absolute top-14 left-16 text-xl opacity-60">🌳</div>
            <div className="absolute bottom-8 right-12 text-2xl opacity-60">🌲</div>
            <div className="absolute top-8 right-24 text-xl opacity-60">🌳</div>
            <div className="absolute bottom-12 left-1/4 text-xl opacity-60">🌾</div>

            {/* PONTOS DE INTERESSE DAS 6 MISSÕES */}
            {missoes.map((m) => {
              const isAtiva = missaoAtivaId === m.id
              const isHovered = missaoHover?.id === m.id

              return (
                <div
                  key={m.id}
                  style={{ left: `${m.posicao_mapa.x}%`, top: `${m.posicao_mapa.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  onMouseEnter={() => setMissaoHover(m)}
                  onMouseLeave={() => setMissaoHover(null)}
                >
                  <button
                    type="button"
                    onClick={() => onSelecionarMissao(m.id)}
                    aria-label={`Ver missão ${m.ordem}: ${m.titulo}`}
                    className={`relative p-2.5 rounded-2xl flex flex-col items-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbf7] ${
                      isAtiva
                        ? 'bg-[#1f7a8c] border-2 border-white scale-110 shadow-2xl shadow-[#1f7a8c]'
                        : isHovered
                        ? 'bg-[#033649] border-2 border-[#bfdbf7] scale-105'
                        : m.concluida
                        ? 'bg-[#011d27]/90 border border-emerald-400/80 shadow-md'
                        : 'bg-[#011d27]/90 border border-[#1f7a8c]/50'
                    }`}
                  >
                    {/* Balão Indicador de Missão (Estilo Exclamação de RPG) */}
                    {!m.concluida && (
                      <span className="absolute -top-3 -right-1 bg-amber-400 text-black font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                        !
                      </span>
                    )}

                    {/* Status de Conclusão */}
                    {m.concluida && (
                      <span className="absolute -top-2.5 -right-1 bg-emerald-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                        ✓
                      </span>
                    )}

                    {/* Sprite do NPC */}
                    <span className="text-3xl filter drop-shadow-md">{m.npc_avatar}</span>

                    {/* Placa da Construção */}
                    <span className="mt-1 text-[10px] font-bold text-white bg-[#022b3a]/90 px-1.5 py-0.5 rounded border border-[#1f7a8c]/60 max-w-[100px] truncate text-center">
                      {m.construcao_nome}
                    </span>
                  </button>
                </div>
              )
            })}

          </div>

          {/* Legenda do Mapa */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#1f7a8c]/30 text-xs text-[#e1e5f2]/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Concluída
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span> Disponível (!)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#1f7a8c] border border-white inline-block"></span> Selecionada
              </span>
            </div>
            <span className="text-[#bfdbf7] font-semibold">Total: {missoes.filter(m => m.concluida).length}/{missoes.length} Missões Realizadas</span>
          </div>

        </div>

        {/* PAINEL LATERAL: DETALHES DA MISSÃO SELECIONADA (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-[#033649] border-2 border-[#1f7a8c] shadow-xl text-white">
            <CardHeader className="pb-3 border-b border-[#1f7a8c]/30">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <Badge variant="outline" className="text-[10px] bg-[#1f7a8c]/20 border-[#1f7a8c] text-[#bfdbf7] mb-1">
                    Missão #{missaoEmDestaque.ordem}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-white leading-snug">
                    {missaoEmDestaque.titulo}
                  </CardTitle>
                </div>
                <div className="text-3xl p-2 bg-[#011d27] rounded-xl border border-[#1f7a8c]/40">
                  {missaoEmDestaque.npc_avatar}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs sm:text-sm">
              
              {/* Diálogo do NPC */}
              <div className="bg-[#011d27] p-3.5 rounded-xl border-l-4 border-[#1f7a8c] space-y-1">
                <div className="font-bold text-[#bfdbf7] text-xs">
                  {missaoEmDestaque.npc_nome} diz:
                </div>
                <p className="italic text-[#e1e5f2]/90 leading-relaxed text-xs">
                  "{missaoEmDestaque.npc_dialogo}"
                </p>
              </div>

              {/* Objetivo da Missão */}
              <div>
                <span className="font-bold text-[#bfdbf7] block mb-1 text-xs">
                  🎯 Desafio da Cidade:
                </span>
                <p className="text-[#e1e5f2] text-xs bg-[#022b3a] p-2.5 rounded-lg border border-[#1f7a8c]/20">
                  {missaoEmDestaque.objetivo_historia}
                </p>
              </div>

              {/* Citação Teórica do Livro de Referência */}
              <div className="p-2.5 rounded-lg bg-[#1f7a8c]/15 border border-[#1f7a8c]/40 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#bfdbf7]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Referência Bibliográfica:</span>
                </div>
                <p className="text-[11px] text-white/90">
                  {missaoEmDestaque.referencia_livro}
                </p>
              </div>

              {/* Recompensas */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded-lg bg-[#011d27] border border-[#1f7a8c]/30">
                  <div className="text-[10px] text-[#bfdbf7]">XP RECOMPENSA</div>
                  <div className="text-sm font-bold text-white">+{missaoEmDestaque.xp_recompensa} XP</div>
                </div>
                <div className="p-2 rounded-lg bg-[#011d27] border border-[#1f7a8c]/30">
                  <div className="text-[10px] text-amber-300">MOEDAS BITS</div>
                  <div className="text-sm font-bold text-amber-400">+{missaoEmDestaque.bits_recompensa} 🪙</div>
                </div>
              </div>

              {/* Botão de Ação: Abrir no Datapad */}
              <Button
                onClick={() => {
                  onSelecionarMissao(missaoEmDestaque.id)
                  onIrParaDatapad()
                }}
                className="w-full bg-[#1f7a8c] hover:bg-[#1f7a8c]/80 text-white font-bold py-2.5 gap-2 shadow-lg"
              >
                <span>Programar no Datapad</span>
                <ChevronRight className="w-4 h-4" />
              </Button>

            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
