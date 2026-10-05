import React from 'react'
import { Trophy, Backpack, Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CONQUISTAS_MOCK, type Jogador } from '@/data/mockData'

interface ProfileScreenProps {
  jogador: Jogador;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ jogador }) => {
  const progressoJunior = Math.min(100, Math.round((jogador.nivel / 50) * 100))

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* CARD PRINCIPAL DO JOGADOR */}
      <div className="bg-[#033649] border-2 border-[#1f7a8c] rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar Grande */}
          <div className="w-24 h-24 rounded-2xl bg-[#011d27] border-2 border-[#1f7a8c] flex items-center justify-center text-5xl shadow-xl">
            {jogador.avatar}
          </div>

          {/* Dados do Aprendiz */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-white">{jogador.apelido}</h1>
              <Badge className="bg-[#1f7a8c] text-white font-bold">
                {jogador.patente} • Nível {jogador.nivel}
              </Badge>
              <Badge variant="outline" className="border-amber-400 text-amber-300 font-mono">
                {jogador.bits_moedas} Bits 🪙
              </Badge>
            </div>
            <p className="text-xs text-[#bfdbf7]">
              E-mail vinculado: {jogador.email} • Cadastro no Banco MySQL Local
            </p>

            {/* Barra de Meta: Caminho até o Nível 50 (Engenheiro Júnior Formado) */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs text-[#bfdbf7] font-semibold mb-1">
                <span>Rumo ao Nível 50 (Promoção Pleno)</span>
                <span>{jogador.nivel} / 50</span>
              </div>
              <Progress value={progressoJunior} className="h-2.5 bg-[#011d27]" indicatorClassName="bg-gradient-to-r from-[#1f7a8c] to-emerald-400" />
            </div>
          </div>

          {/* Box de Resumo de XP */}
          <div className="bg-[#011d27] border border-[#1f7a8c]/40 rounded-xl p-4 text-center min-w-[140px]">
            <div className="text-[11px] text-[#bfdbf7] uppercase font-bold tracking-wider">XP ACUMULADO</div>
            <div className="text-2xl font-black text-white mt-1">{jogador.xp_atual}</div>
            <div className="text-[10px] text-[#e1e5f2]/70 mt-1">Próximo Nível: {jogador.xp_proximo_nivel} XP</div>
          </div>

        </div>
      </div>

      {/* GRID DE DUAS COLUNAS: CONQUISTAS E INVENTÁRIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUNA 1: MEDALHAS & CONQUISTAS */}
        <Card className="bg-[#033649] border-2 border-[#1f7a8c] text-white shadow-xl">
          <CardHeader className="pb-3 border-b border-[#1f7a8c]/30">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Distintivos e Conquistas ({CONQUISTAS_MOCK.filter(c => c.desbloqueada).length}/{CONQUISTAS_MOCK.length})</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {CONQUISTAS_MOCK.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  c.desbloqueada
                    ? 'bg-[#011d27] border-emerald-500/50 shadow-md'
                    : 'bg-[#011d27]/40 border-[#1f7a8c]/20 opacity-50'
                }`}
              >
                <div className="text-2xl p-2 rounded-lg bg-[#022b3a] border border-[#1f7a8c]/40">
                  {c.icone}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{c.titulo}</span>
                    <Badge variant="outline" className="text-[10px] border-amber-400/50 text-amber-300">
                      +{c.bits_bonus} Bits
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#e1e5f2]/80 mt-0.5">{c.descricao}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* COLUNA 2: DIAGNÓSTICO ADAPTATIVO & MOCHILA */}
        <div className="space-y-6">
          
          {/* Diagnóstico de Habilidades */}
          <Card className="bg-[#033649] border-2 border-[#1f7a8c] text-white shadow-xl">
            <CardHeader className="pb-3 border-b border-[#1f7a8c]/30">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#bfdbf7]" />
                <span>Diagnóstico Adaptativo de Habilidades</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#bfdbf7]">
                  <span>Variáveis e Tipos Primitivos (float, int)</span>
                  <span className="font-bold text-emerald-400">100% Dominado</span>
                </div>
                <Progress value={100} className="h-2 bg-[#011d27]" indicatorClassName="bg-emerald-400" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#bfdbf7]">
                  <span>Condicionais & Regra da Peneira (if/elif)</span>
                  <span className="font-bold text-emerald-400">85% Dominado</span>
                </div>
                <Progress value={85} className="h-2 bg-[#011d27]" indicatorClassName="bg-emerald-400" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#bfdbf7]">
                  <span>Laços de Repetição & Limites do range</span>
                  <span className="font-bold text-amber-300">60% (Requer Treino)</span>
                </div>
                <Progress value={60} className="h-2 bg-[#011d27]" indicatorClassName="bg-amber-400" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#bfdbf7]">
                  <span>Funções Reutilizáveis (def & return)</span>
                  <span className="font-bold text-[#e1e5f2]/60">Em Aprendizado</span>
                </div>
                <Progress value={40} className="h-2 bg-[#011d27]" indicatorClassName="bg-[#1f7a8c]" />
              </div>
            </CardContent>
          </Card>

          {/* Mochila de Itens Coletados */}
          <Card className="bg-[#033649] border-2 border-[#1f7a8c] text-white shadow-xl">
            <CardHeader className="pb-3 border-b border-[#1f7a8c]/30">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Backpack className="w-5 h-5 text-amber-300" />
                <span>Mochila de Itens de Valedados</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#011d27] border border-[#1f7a8c]/40 flex items-center gap-2">
                <span className="text-xl">📟</span>
                <div>
                  <div className="font-bold text-white">Datapad MK-1</div>
                  <div className="text-[10px] text-[#bfdbf7]">Console Portátil</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#011d27] border border-[#1f7a8c]/40 flex items-center gap-2">
                <span className="text-xl">📖</span>
                <div>
                  <div className="font-bold text-white">Guia do Leigo</div>
                  <div className="text-[10px] text-[#bfdbf7]">Livro de Consulta</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  )
}
