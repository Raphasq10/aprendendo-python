import { useState } from 'react'
import { Play, RotateCcw, Copy, Check, Terminal as TerminalIcon, BookOpen, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Missao } from '@/data/mockData'

interface MissionDatapadScreenProps {
  missao: Missao;
  bateriaAtual: number;
  onConcluirMissao: (missaoId: number) => void;
  onFalharMissao: () => void;
}

export const MissionDatapadScreen: React.FC<MissionDatapadScreenProps> = ({
  missao,
  bateriaAtual,
  onConcluirMissao,
  onFalharMissao,
}) => {
  const [codigo, setCodigo] = useState(missao.codigo_inicial)
  const [saidaConsole, setSaidaConsole] = useState<string>('>>> Datapad OS v2.4 (Python 3.12 WebAssembly pronto)\n>>> Digite seu código e pressione "Executar" para testar no vilarejo.')
  const [statusExecucao, setStatusExecucao] = useState<'idle' | 'rodando' | 'sucesso' | 'erro'>('idle')
  const [copiado, setCopiado] = useState(false)
  const [simularLoading, setSimularLoading] = useState(false)

  const handleCopiarColab = () => {
    navigator.clipboard.writeText(codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const handleRestaurarCodigo = () => {
    setCodigo(missao.codigo_inicial)
    setStatusExecucao('idle')
    setSaidaConsole('>>> Código restaurado para a versão padrão da missão.')
  }

  const handleExecutarCodigo = () => {
    if (bateriaAtual <= 0) {
      setSaidaConsole('❌ ALERTA DE SISTEMA: Bateria em 0%!\nO Datapad desligou por falta de energia. Vá até a Oficina de Reforço para recuperar a bateria!')
      setStatusExecucao('erro')
      return
    }

    setStatusExecucao('rodando')
    setSaidaConsole('>>> Compilando e executando script no ambiente WebAssembly...')

    setTimeout(() => {
      // Simulação pedagógica de validação do código
      const codigoNormalizado = codigo.replace(/\s+/g, ' ')
      const temVariaveisValidas = codigoNormalizado.length > 25

      if (temVariaveisValidas) {
        setStatusExecucao('sucesso')
        setSaidaConsole(
          `>>> SUCESSO: Todos os testes passaram!\n` +
          `[OK] ${missao.assert_teste}\n` +
          `[OK] Saída do programa: Execução concluída sem falhas.\n` +
          `🎉 Recompensa concedida: +${missao.xp_recompensa} XP e +${missao.bits_recompensa} Moedas Bits!`
        )
        onConcluirMissao(missao.id)
      } else {
        setStatusExecucao('erro')
        setSaidaConsole(
          `>>> ERRO DE EXECUÇÃO: AssertionError!\n` +
          `[FALHA] ${missao.assert_teste}\n` +
          `⚡ Penalidade: A bateria do Datapad foi drenada em -10%!\n` +
          `💡 Dica do Livro: ${missao.dica_teorica}`
        )
        onFalharMissao()
      }
    }, 700)
  }

  if (simularLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
        <Skeleton className="h-10 w-96 bg-[#033649]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-4 h-[550px] bg-[#033649] rounded-2xl" />
          <Skeleton className="lg:col-span-8 h-[550px] bg-[#033649] rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Topo da Missão */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1 bg-[#011d27] rounded-xl border border-[#1f7a8c]/50">
              {missao.npc_avatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Missão #{missao.ordem}: {missao.titulo}
                </h1>
                {missao.concluida && (
                  <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Concluída
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#bfdbf7]">
                Local: {missao.construcao_nome} • Cidadão: {missao.npc_nome}
              </p>
            </div>
          </div>
        </div>

        {/* Botão de Toggle de Teste de Loading */}
        <button
          onClick={() => {
            setSimularLoading(true)
            setTimeout(() => setSimularLoading(false), 800)
          }}
          className="text-[11px] text-[#bfdbf7]/70 hover:text-white underline"
        >
          Testar Loading Skeleton
        </button>
      </div>

      {/* Grid Principal do Ambiente de Missão */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA ESQUERDA: DIÁLOGO DO NPC & TEORIA (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Caixa de Diálogo com NPC */}
          <Card className="bg-[#033649] border-2 border-[#1f7a8c] shadow-xl text-white">
            <CardHeader className="pb-3 border-b border-[#1f7a8c]/30">
              <CardTitle className="text-sm font-bold text-[#bfdbf7] flex items-center gap-2">
                <span>💬 Diálogo com o Cidadão</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs sm:text-sm">
              <div className="bg-[#011d27] p-3 rounded-xl border-l-4 border-[#1f7a8c] text-xs italic text-[#e1e5f2]/90 leading-relaxed">
                "{missao.npc_dialogo}"
              </div>

              <div>
                <span className="font-bold text-[#bfdbf7] block text-xs mb-1">
                  🎯 Meta da Cidade:
                </span>
                <p className="text-xs text-[#e1e5f2] bg-[#022b3a] p-2.5 rounded-lg border border-[#1f7a8c]/30 leading-relaxed">
                  {missao.objetivo_historia}
                </p>
              </div>

              {/* Citação Teórica dos Livros */}
              <div className="p-3 rounded-xl bg-[#1f7a8c]/15 border border-[#1f7a8c]/40 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#bfdbf7] text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-[#bfdbf7]" />
                  <span>Base Teórica & Livro:</span>
                </div>
                <p className="text-xs text-white font-medium">
                  {missao.referencia_livro}
                </p>
                <p className="text-[11px] text-[#e1e5f2]/80 italic pt-1 border-t border-[#1f7a8c]/20">
                  "{missao.dica_teorica}"
                </p>
              </div>

              {/* Critério de Avaliação */}
              <div className="bg-[#011d27] p-2.5 rounded-lg border border-[#1f7a8c]/30 text-xs font-mono">
                <div className="text-[10px] text-[#bfdbf7] font-sans font-bold mb-1">TESTE AUTOMÁTICO EXIGIDO:</div>
                <div className="text-amber-300 text-[11px] truncate">{missao.assert_teste}</div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* COLUNA DIREITA: CONSOLE DATAPAD COM TERMINAL NATIVO (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* GABINETE DO DATAPAD (Hardware Retrô-Futurista) */}
          <div className="bg-[#01161e] border-2 border-[#1f7a8c] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Topbar do Datapad (LEDs e Título) */}
            <div className="bg-[#022533] px-4 py-2.5 border-b border-[#1f7a8c]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="font-mono text-xs font-bold text-[#bfdbf7] tracking-wider ml-2 flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#1f7a8c]" />
                  DATAPAD TERMINAL // PYTHON 3.12 (CLI)
                </span>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestaurarCodigo}
                  className="h-7 text-[11px] text-[#bfdbf7] hover:bg-[#033649] gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Restaurar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopiarColab}
                  className="h-7 text-[11px] text-[#bfdbf7] hover:bg-[#033649] gap-1"
                >
                  {copiado ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiado ? 'Copiado!' : 'Colab'}
                </Button>
              </div>
            </div>

            {/* Editor de Código (Aparência de IDE com Números de Linha) */}
            <div className="relative font-mono text-xs sm:text-sm bg-[#011218] p-4 min-h-[220px]">
              <div className="flex items-start gap-3">
                
                {/* Numeração de Linhas */}
                <div className="select-none text-[#1f7a8c]/60 text-right pr-2 border-r border-[#1f7a8c]/30 font-mono text-xs leading-6">
                  {codigo.split('\n').map((_: string, i: number) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Editor Textarea Estilizado */}
                <textarea
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  spellCheck="false"
                  maxLength={5000}
                  aria-label="Editor de Código Python"
                  className="w-full h-[220px] bg-transparent text-[#bfdbf7] focus:outline-none resize-y leading-6 font-mono text-xs sm:text-sm selection:bg-[#1f7a8c]/40"
                  placeholder="# Escreva seu script Python aqui..."
                />
              </div>
            </div>

            {/* Barra de Disparo da Ação */}
            <div className="bg-[#022533] p-3 border-t border-[#1f7a8c]/40 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#e1e5f2]/70 flex items-center gap-2">
                <span>⚡ Bateria: {bateriaAtual}%</span>
                <span>•</span>
                <span>Atalho: Clique em Executar para rodar no terminal</span>
              </div>

              <Button
                onClick={handleExecutarCodigo}
                disabled={statusExecucao === 'rodando'}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 gap-2 shadow-lg"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{statusExecucao === 'rodando' ? 'Processando...' : '▶ Executar Código'}</span>
              </Button>
            </div>

            {/* TERMINAL CLI REAL COM SCANLINES (Sensação Nativa) */}
            <div className="bg-[#010c10] border-t border-[#1f7a8c]/50 p-4 font-mono text-xs relative">
              
              {/* Efeito Sutil de Scanlines Retrô */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                  backgroundSize: '100% 4px',
                }}
              />

              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1f7a8c]/30 text-[10px] text-[#bfdbf7]/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  CONSOLE STDOUT / STDERR
                </span>
                <span>BUFFER: ATIVO</span>
              </div>

              {/* Saída do Terminal com Linha de Prompt */}
              <pre className={`whitespace-pre-wrap leading-relaxed ${
                statusExecucao === 'sucesso' 
                  ? 'text-emerald-300' 
                  : statusExecucao === 'erro' 
                  ? 'text-red-300' 
                  : 'text-[#bfdbf7]'
              }`}>
                {saidaConsole}
              </pre>

              {/* Cursor Bloco Piscante (Estilo CLI Autêntica) */}
              <div className="inline-block w-2 h-3.5 bg-[#bfdbf7] animate-pulse ml-1 align-middle mt-1" />

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
