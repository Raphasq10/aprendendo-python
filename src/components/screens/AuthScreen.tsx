import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Sparkles, Shield, User, Key, ArrowRight, Play, BookOpen } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// 1. Esquema de validação seguro com Zod (Regra de segurança #1 e #4)
const authSchema = z.object({
  apelido: z.string().min(3, "O apelido deve ter no mínimo 3 caracteres").max(50, "O apelido não pode ultrapassar 50 caracteres"),
  email: z.string().email("Digite um e-mail válido").max(120, "O e-mail não pode ultrapassar 120 caracteres"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").max(60, "A senha não pode ultrapassar 60 caracteres"),
})

type AuthFormData = z.infer<typeof authSchema>

interface AuthScreenProps {
  onLoginSucesso: (dados: { apelido: string; email: string; avatar: string }) => void;
}

const AVATARES_DISPONIVEIS = [
  { id: 'mago', icone: '🧙‍♂️', nome: 'Mago dos Dados' },
  { id: 'alquimista', icone: '🧪', nome: 'Alquimista do Python' },
  { id: 'artesa', icone: '👩‍💻', nome: 'Artesã de Algoritmos' },
  { id: 'cavaleiro', icone: '🛡️', nome: 'Guardião dos Bits' },
]

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSucesso }) => {
  const [modo, setModo] = useState<'login' | 'cadastro'>('cadastro')
  const [avatarSelecionado, setAvatarSelecionado] = useState('🧙‍♂️')

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      apelido: 'MagoDoPython',
      email: 'aprendiz@valedados.dev',
      senha: 'segredo_python',
    }
  })

  const onSubmit = (dados: AuthFormData) => {
    onLoginSucesso({
      apelido: dados.apelido,
      email: dados.email,
      avatar: avatarSelecionado,
    })
  }

  const entrarComoVisitante = () => {
    onLoginSucesso({
      apelido: 'AprendizConvidado',
      email: 'convidado@pyquest.local',
      avatar: avatarSelecionado,
    })
  }

  return (
    <div className="min-h-screen bg-[#022b3a] flex flex-col justify-center items-center p-4 py-12 relative overflow-hidden">
      
      {/* Luzes de fundo atmosféricas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1f7a8c]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Cabeçalho do App */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f7a8c]/20 border border-[#1f7a8c]/50 text-[#bfdbf7] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#bfdbf7]" />
            Aprenda Programando de Verdade
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>⚔️ PyQuest</span>
          </h1>
          <p className="text-sm text-[#e1e5f2]/80">
            As Crônicas dos Dados • Do Zero ao Nível 50 no Vilarejo
          </p>
        </div>

        {/* Card de Autenticação */}
        <Card className="bg-[#033649] border-[#1f7a8c]/60 shadow-2xl text-white">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-white">
                {modo === 'cadastro' ? 'Criar Novo Aprendiz' : 'Retomar Jornada'}
              </CardTitle>
              <Badge variant="outline" className="border-[#1f7a8c] text-[#bfdbf7] text-xs">
                {modo === 'cadastro' ? 'Nível 1' : 'Login'}
              </Badge>
            </div>
            <CardDescription className="text-xs text-[#e1e5f2]/80">
              {modo === 'cadastro' 
                ? 'Escolha seu avatar e crie seu perfil seguro no banco local.'
                : 'Entre com seus dados para continuar suas missões.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            
            {/* Seletor de Avatar */}
            <div>
              <Label className="text-xs font-semibold text-[#bfdbf7] block mb-2">
                1. Escolha seu Avatar de Aprendiz
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARES_DISPONIVEIS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatarSelecionado(av.icone)}
                    aria-label={`Selecionar avatar ${av.nome}`}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      avatarSelecionado === av.icone
                        ? 'bg-[#1f7a8c] border-white shadow-lg scale-105'
                        : 'bg-[#011d27] border-[#1f7a8c]/30 hover:border-[#bfdbf7]/50'
                    }`}
                  >
                    <span className="text-2xl" role="img" aria-hidden="true">{av.icone}</span>
                    <span className="text-[10px] text-white/90 font-medium mt-1 truncate max-w-full">
                      {av.nome.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulário com Validação Zod */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" id="auth-form" noValidate>
              
              {/* Campo Apelido */}
              <div className="space-y-1">
                <Label htmlFor="apelido" className="text-xs font-semibold text-[#bfdbf7] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1f7a8c]" />
                  Apelido de Programador
                </Label>
                <Input
                  id="apelido"
                  type="text"
                  placeholder="Ex: MagoDoPython"
                  maxLength={50}
                  className="bg-[#011d27] border-[#1f7a8c]/40 text-white placeholder:text-[#e1e5f2]/40 text-sm focus-visible:ring-[#1f7a8c]"
                  {...register('apelido')}
                  aria-invalid={errors.apelido ? 'true' : 'false'}
                />
                {errors.apelido && (
                  <p className="text-[11px] text-red-400 font-medium" role="alert">{errors.apelido.message}</p>
                )}
              </div>

              {/* Campo E-mail */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-[#bfdbf7] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#1f7a8c]" />
                  E-mail do Aluno
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="aluno@pyquest.dev"
                  maxLength={120}
                  className="bg-[#011d27] border-[#1f7a8c]/40 text-white placeholder:text-[#e1e5f2]/40 text-sm focus-visible:ring-[#1f7a8c]"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400 font-medium" role="alert">{errors.email.message}</p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="space-y-1">
                <Label htmlFor="senha" className="text-xs font-semibold text-[#bfdbf7] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#1f7a8c]" />
                  Senha de Proteção
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  maxLength={60}
                  className="bg-[#011d27] border-[#1f7a8c]/40 text-white placeholder:text-[#e1e5f2]/40 text-sm focus-visible:ring-[#1f7a8c]"
                  {...register('senha')}
                  aria-invalid={errors.senha ? 'true' : 'false'}
                />
                {errors.senha && (
                  <p className="text-[11px] text-red-400 font-medium" role="alert">{errors.senha.message}</p>
                )}
              </div>

              {/* Botão de Envio */}
              <Button
                type="submit"
                className="w-full bg-[#1f7a8c] hover:bg-[#1f7a8c]/80 text-white font-bold py-2.5 mt-2 gap-2 shadow-lg"
              >
                <span>{modo === 'cadastro' ? 'Começar Aventura' : 'Entrar no Jogo'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#1f7a8c]/30"></div>
              <span className="flex-shrink mx-3 text-[10px] text-[#bfdbf7]/70 uppercase tracking-widest font-semibold">ou</span>
              <div className="flex-grow border-t border-[#1f7a8c]/30"></div>
            </div>

            {/* Entrada Rápida Convidado */}
            <Button
              type="button"
              variant="outline"
              onClick={entrarComoVisitante}
              className="w-full border-[#1f7a8c]/50 bg-[#011d27] hover:bg-[#011d27]/70 text-[#bfdbf7] text-xs gap-2"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Jogar Imediatamente como Convidado</span>
            </Button>

          </CardContent>

          <CardFooter className="pt-0 justify-between text-xs border-t border-[#1f7a8c]/20 p-4">
            <button
              type="button"
              onClick={() => setModo(modo === 'cadastro' ? 'login' : 'cadastro')}
              className="text-[#bfdbf7] hover:underline focus:outline-none"
            >
              {modo === 'cadastro' ? 'Já possui perfil? Entrar' : 'Novo por aqui? Criar perfil'}
            </button>

            <a
              href="slides.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e1e5f2]/70 hover:text-white flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Slides da Aula</span>
            </a>
          </CardFooter>
        </Card>

      </div>
    </div>
  )
}
