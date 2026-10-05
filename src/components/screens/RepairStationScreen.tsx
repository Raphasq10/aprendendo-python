import { useState } from 'react'
import { Wrench, BatteryCharging, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TREINOS_REFORCO_MOCK, type TreinoReforco } from '@/data/mockData'

interface RepairStationScreenProps {
  bateriaAtual: number;
  onConcluirTreino: (xpGanho: number, bateriaRecarregada: number) => void;
}

export const RepairStationScreen: React.FC<RepairStationScreenProps> = ({
  bateriaAtual,
  onConcluirTreino,
}) => {
  const treinos = TREINOS_REFORCO_MOCK
  const [treinoAtivoId, setTreinoAtivoId] = useState<number>(treinos[0].id)
  const [codigoEdicao, setCodigoEdicao] = useState<string>(treinos[0].codigo_com_erro)
  const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro' | 'idle'; msg: string }>({ tipo: 'idle', msg: '' })

  const treinoAtivo = treinos.find(t => t.id === treinoAtivoId) || treinos[0]

  const handleSelecionarTreino = (t: TreinoReforco) => {
    setTreinoAtivoId(t.id)
    setCodigoEdicao(t.codigo_com_erro)
    setFeedback({ tipo: 'idle', msg: '' })
  }

  const handleValidarConserto = () => {
    const limpoEdicao = codigoEdicao.trim().replace(/\s+/g, ' ')
    const limpoCorreto = treinoAtivo.codigo_correto.trim().replace(/\s+/g, ' ')

    if (limpoEdicao === limpoCorreto) {
      setFeedback({
        tipo: 'sucesso',
        msg: `🎉 Conserto Perfeito! +${treinoAtivo.bateria_restaurada}% de Bateria recuperada e +${treinoAtivo.xp_recompensa} XP!`
      })
      onConcluirTreino(treinoAtivo.xp_recompensa, treinoAtivo.bateria_restaurada)
    } else {
      setFeedback({
        tipo: 'erro',
        msg: `❌ O erro ainda persiste. Dica do livro: ${treinoAtivo.explicacao}`
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Cabeçalho da Oficina */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-7 h-7 text-[#1f7a8c]" />
              <span>Oficina de Reforço Adaptativo</span>
            </h1>
            <Badge className="bg-emerald-600 text-white font-bold">
              Farm de XP & Energia
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#e1e5f2]/80 mt-1">
            Encontre e conserte bugs comuns de sintaxe para regenerar a bateria do seu Datapad e fortalecer suas habilidades!
          </p>
        </div>

        {/* Status de Bateria Atual */}
        <div className="flex items-center gap-2 bg-[#011d27] border border-[#1f7a8c]/40 px-4 py-2 rounded-xl text-xs font-mono">
          <BatteryCharging className="w-4 h-4 text-emerald-400" />
          <span className="text-[#bfdbf7]">Carga do Datapad:</span>
          <span className="text-white font-bold text-sm">{bateriaAtual}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LISTA DE TREINOS DE REFORÇO (Col 4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#bfdbf7] px-1">
            Desafios de Correção Disponíveis
          </div>

          {treinos.map((t) => {
            const isAtivo = t.id === treinoAtivoId
            return (
              <button
                key={t.id}
                onClick={() => handleSelecionarTreino(t)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isAtivo
                    ? 'bg-[#1f7a8c] border-white text-white shadow-lg'
                    : 'bg-[#033649] border-[#1f7a8c]/30 text-[#e1e5f2] hover:bg-[#054861]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{t.titulo}</span>
                  <Badge variant="outline" className={`text-[10px] ${isAtivo ? 'border-white text-white' : 'border-[#1f7a8c] text-[#bfdbf7]'}`}>
                    +{t.bateria_restaurada}% ⚡
                  </Badge>
                </div>
                <p className="text-[11px] opacity-80 truncate">{t.enunciado}</p>
              </button>
            )
          })}
        </div>

        {/* ÁREA DE CONSERTO INTERATIVA (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-[#033649] border-2 border-[#1f7a8c] text-white shadow-xl">
            <CardHeader className="pb-3 border-b border-[#1f7a8c]/30">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <span>🛠️ {treinoAtivo.titulo}</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-emerald-600 text-[11px]">+{treinoAtivo.bateria_restaurada}% Bateria</Badge>
                  <Badge className="bg-[#1f7a8c] text-[11px]">+{treinoAtivo.xp_recompensa} XP</Badge>
                </div>
              </div>
              <CardDescription className="text-xs text-[#e1e5f2]/80 mt-1">
                {treinoAtivo.enunciado}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              
              {/* Dica do Livro */}
              <div className="bg-[#011d27] p-3 rounded-xl border border-[#1f7a8c]/40 flex items-start gap-2.5 text-xs">
                <BookOpen className="w-4 h-4 text-[#bfdbf7] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#bfdbf7] block">Referência: {treinoAtivo.dica_livro}</span>
                  <p className="text-[#e1e5f2]/80 text-[11px] mt-0.5">{treinoAtivo.explicacao}</p>
                </div>
              </div>

              {/* Editor de Correção */}
              <div>
                <label className="text-xs font-semibold text-[#bfdbf7] block mb-1.5 font-mono">
                  CORRIJA O TRECHO DE CÓDIGO ABAIXO:
                </label>
                <div className="bg-[#011218] border border-[#1f7a8c] rounded-xl p-3 font-mono text-sm">
                  <textarea
                    value={codigoEdicao}
                    onChange={(e) => setCodigoEdicao(e.target.value)}
                    rows={4}
                    maxLength={500}
                    aria-label="Área de Correção de Bug"
                    className="w-full bg-transparent text-amber-300 focus:outline-none resize-none leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* Feedback de Validação */}
              {feedback.msg && (
                <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.tipo === 'sucesso'
                    ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                    : 'bg-red-950/80 border border-red-500 text-red-200'
                }`}>
                  {feedback.tipo === 'sucesso' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span>{feedback.msg}</span>
                </div>
              )}

              {/* Botão de Validação */}
              <Button
                onClick={handleValidarConserto}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 gap-2 shadow-lg"
              >
                <Wrench className="w-4 h-4" />
                <span>Validar Conserto & Recuperar Energia</span>
              </Button>

            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
