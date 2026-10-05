export interface Missao {
  id: number;
  ordem: number;
  chave: string;
  titulo: string;
  npc_nome: string;
  npc_avatar: string;
  npc_dialogo: string;
  construcao_nome: string;
  posicao_mapa: { x: number; y: number }; // Coordenadas percentuais no mapa em pixel art
  objetivo_historia: string;
  codigo_inicial: string;
  assert_teste: string;
  dica_teorica: string;
  referencia_livro: string;
  topico_chave: string;
  xp_recompensa: number;
  bits_recompensa: number;
  concluida: boolean;
  bloqueada: boolean;
}

export interface TreinoReforco {
  id: number;
  titulo: string;
  topico_chave: string;
  enunciado: string;
  codigo_com_erro: string;
  codigo_correto: string;
  explicacao: string;
  dica_livro: string;
  xp_recompensa: number;
  bateria_restaurada: number;
}

export interface Conquista {
  id: number;
  chave: string;
  titulo: string;
  descricao: string;
  icone: string;
  bits_bonus: number;
  desbloqueada: boolean;
}

export interface Jogador {
  id: number;
  apelido: string;
  email: string;
  avatar: string;
  patente: 'Júnior' | 'Pleno' | 'Sênior';
  nivel: number;
  xp_atual: number;
  xp_proximo_nivel: number;
  bateria_atual: number;
  bits_moedas: number;
}

export const JOGADOR_INICIAL: Jogador = {
  id: 1,
  apelido: "MagoDoPython",
  email: "aprendiz@valedados.dev",
  avatar: "🧙‍♂️",
  patente: "Júnior",
  nivel: 3,
  xp_atual: 240,
  xp_proximo_nivel: 350,
  bateria_atual: 80,
  bits_moedas: 125,
};

export const MISSOES_MOCK: Missao[] = [
  {
    id: 1,
    ordem: 1,
    chave: "m1_balanca_mercearia",
    titulo: "A Balança da Mercearia",
    npc_nome: "Seu Zé do Armazém",
    npc_avatar: "🧔",
    npc_dialogo: "Ô criatura! Chegaram três caixas de laranjas e preciso registrar o peso em quilos e o preço unitário para não tomar prejuízo!",
    construcao_nome: "Armazém Central",
    posicao_mapa: { x: 22, y: 35 },
    objetivo_historia: "Crie as variáveis `peso_kg = 12.5` e `preco_por_kg = 4.20`. Calcule o `total_compra` multiplicando os dois valores.",
    codigo_inicial: `# Ajude o Seu Zé a definir as variáveis da balança:
peso_kg = 12.5
preco_por_kg = 4.20

# Calcule o total_compra:
total_compra = peso_kg * preco_por_kg
print(f"Total: R$ {total_compra:.2f}")`,
    assert_teste: `assert abs(total_compra - 52.5) < 0.01, "O total deve ser R$ 52.50!"`,
    dica_teorica: "Valores com casas decimais usam ponto (.) e pertencem ao tipo primitivo float.",
    referencia_livro: "Começando a Programar em Python Para Leigos, Cap. 5",
    topico_chave: "variaveis_float",
    xp_recompensa: 100,
    bits_recompensa: 25,
    concluida: true,
    bloqueada: false,
  },
  {
    id: 2,
    ordem: 2,
    chave: "m2_cofrinho_turma",
    titulo: "O Cofrinho da Turma",
    npc_nome: "Bia da Pipoca",
    npc_avatar: "🍿",
    npc_dialogo: "Juntamos nossas moedas para comprar ingressos do cinema! Mas precisamos calcular quanto sobra de troco certinho.",
    construcao_nome: "Estação de Pipoca",
    posicao_mapa: { x: 48, y: 28 },
    objetivo_historia: "Guarde `valor_pago = 50.0` e `custo_ingresso = 38.50`. Calcule o `troco` e exiba com uma f-string com duas casas decimais.",
    codigo_inicial: `valor_pago = 50.0
custo_ingresso = 38.50

# Calcule o troco:
troco = valor_pago - custo_ingresso
print(f"Troco a devolver: R$ {troco:.2f}")`,
    assert_teste: `assert abs(troco - 11.5) < 0.01, "O troco exato deve ser R$ 11.50!"`,
    dica_teorica: "F-strings (PEP 498) permitem injetar variáveis com facilidade: f'Texto {variavel:.2f}'.",
    referencia_livro: "Python: Escreva seus primeiros programas, Cap. 2",
    topico_chave: "fstrings_operacoes",
    xp_recompensa: 100,
    bits_recompensa: 25,
    concluida: true,
    bloqueada: false,
  },
  {
    id: 3,
    ordem: 3,
    chave: "m3_catraca_parque",
    titulo: "A Catraca Justa do Parque",
    npc_nome: "Fiscal Roberto",
    npc_avatar: "🎫",
    npc_dialogo: "A catraca do parque precisa de regras claras: menores de 5 anos não pagam nada (Gratuito), de 5 a 12 anos pagam meia (Meia-Entrada), e os demais pagam Inteira!",
    construcao_nome: "Catraca do Parque",
    posicao_mapa: { x: 74, y: 38 },
    objetivo_historia: "Aplique a regra da peneira usando if/elif/else para a variável `idade = 8` e salve em `tipo_ingresso`.",
    codigo_inicial: `idade = 8

# Aplique a regra da peneira:
if idade < 5:
    tipo_ingresso = "Gratuito"
elif idade <= 12:
    tipo_ingresso = "Meia-Entrada"
else:
    tipo_ingresso = "Inteira"

print(f"Ingresso: {tipo_ingresso}")`,
    assert_teste: `assert tipo_ingresso == "Meia-Entrada", "Para idade 8 deve ser Meia-Entrada!"`,
    dica_teorica: "Na regra da peneira, filtros mais restritivos devem vir primeiro.",
    referencia_livro: "Pense em Python, Cap. 5 ('Condicionais')",
    topico_chave: "condicionais_peneira",
    xp_recompensa: 120,
    bits_recompensa: 30,
    concluida: false,
    bloqueada: false,
  },
  {
    id: 4,
    ordem: 4,
    chave: "m4_robo_regador",
    titulo: "O Robô Regador da Praça",
    npc_nome: "Dona Flor",
    npc_avatar: "🌻",
    npc_dialogo: "Nosso robô jardineiro precisa regar exatamente 5 canteiros numerados de 1 a 5. Sem um laço for, ele fica parado!",
    construcao_nome: "Jardim dos Autômatos",
    posicao_mapa: { x: 30, y: 68 },
    objetivo_historia: "Crie um laço `for` com `range(1, 6)` que acumule o número total de canteiros regados em `canteiros_regados`.",
    codigo_inicial: `canteiros_regados = 0

# Use o for com range para regar os canteiros de 1 a 5:
for canteiro in range(1, 6):
    print(f"Regando canteiro {canteiro}...")
    canteiros_regados += 1

print(f"Total regado: {canteiros_regados}")`,
    assert_teste: `assert canteiros_regados == 5, "Devem ser regados 5 canteiros!"`,
    dica_teorica: "A função range(inicio, fim) é exclusiva no final: range(1, 6) percorre 1 até 5.",
    referencia_livro: "Começando a Programar em Python Para Leigos, Cap. 7",
    topico_chave: "lacos_range",
    xp_recompensa: 120,
    bits_recompensa: 30,
    concluida: false,
    bloqueada: false,
  },
  {
    id: 5,
    ordem: 5,
    chave: "m5_detector_nulos",
    titulo: "O Detector de Livros Perdidos",
    npc_nome: "Arquimedes",
    npc_avatar: "📚",
    npc_dialogo: "Alguém desarrumou a estante e colocou registros vazios (None) na lista de livros emprestados!",
    construcao_nome: "Biblioteca Ancestral",
    posicao_mapa: { x: 62, y: 72 },
    objetivo_historia: "Dada a lista `registros`, crie uma nova lista `livros_validos` contendo apenas os títulos reais (descartando os None).",
    codigo_inicial: `registros = ["Dom Casmurro", None, "O Alquimista", None, "Capitães da Areia"]
livros_validos = []

# Filtre os elementos que não são None:
for item in registros:
    if item is not None:
        livros_validos.append(item)

print("Livros válidos:", livros_validos)`,
    assert_teste: `assert len(livros_validos) == 3 and None not in livros_validos, "Apenas os 3 livros válidos!"`,
    dica_teorica: "Higienizar registros nulos (None) é a primeira regra de ouro na ciência de dados.",
    referencia_livro: "Data Science do Zero, Cap. 2 ('Curso Intensivo')",
    topico_chave: "dados_nulos",
    xp_recompensa: 150,
    bits_recompensa: 40,
    concluida: false,
    bloqueada: false,
  },
  {
    id: 6,
    ordem: 6,
    chave: "m6_mestre_junior",
    titulo: "O Desafio do Mestre Júnior",
    npc_nome: "Mestre Ada",
    npc_avatar: "🏛️",
    npc_dialogo: "Chegou a hora de provar que você domina a construção de funções reutilizáveis! Forme-se Engenheiro Júnior!",
    construcao_nome: "Torre dos Mestres",
    posicao_mapa: { x: 50, y: 50 },
    objetivo_historia: "Crie a função `calcular_desconto(preco, percentual)` com validação de limites (0 a 100).",
    codigo_inicial: `def calcular_desconto(preco, percentual):
    if percentual < 0 or percentual > 100:
        return None
    desconto = preco * (percentual / 100)
    return preco - desconto

resultado = calcular_desconto(100.0, 15)
print("Preço com desconto:", resultado)`,
    assert_teste: `assert calcular_desconto(100.0, 20) == 80.0 and calcular_desconto(100.0, 150) is None`,
    dica_teorica: "Funções empacotam regras com 'def' e devolvem dados ao programa com 'return'.",
    referencia_livro: "Pense em Python, Cap. 3 ('Funções')",
    topico_chave: "funcoes_retorno",
    xp_recompensa: 200,
    bits_recompensa: 50,
    concluida: false,
    bloqueada: false,
  },
];

export const TREINOS_REFORCO_MOCK: TreinoReforco[] = [
  {
    id: 1,
    titulo: "Treino: O Sinal Perdido",
    topico_chave: "comparacao_vs_atribuicao",
    enunciado: "O programador usou o sinal de atribuição (=) no lugar do operador de comparação (==)!",
    codigo_com_erro: "if nivel = 10:\n    print('Parabéns')",
    codigo_correto: "if nivel == 10:\n    print('Parabéns')",
    explicacao: "Em Python, '=' guarda um valor na variável, enquanto '==' compara se dois valores são iguais.",
    dica_livro: "Pense em Python, Cap. 2 ('Expressões e Instruções')",
    xp_recompensa: 40,
    bateria_restaurada: 35,
  },
  {
    id: 2,
    titulo: "Treino: O Portão dos Dois Pontos",
    topico_chave: "sintaxe_dois_pontos",
    enunciado: "O bloco de controle está sem o caractere obrigatório no final da linha!",
    codigo_com_erro: "if pontuacao >= 100\n    print('Recorde!')",
    codigo_correto: "if pontuacao >= 100:\n    print('Recorde!')",
    explicacao: "Em Python, comandos como if, elif, else, for e def SEMPRE terminam com dois pontos (:).",
    dica_livro: "Python: Escreva seus primeiros programas, Cap. 3",
    xp_recompensa: 40,
    bateria_restaurada: 35,
  },
  {
    id: 3,
    titulo: "Treino: A Contagem Exata",
    topico_chave: "limites_range",
    enunciado: "O laço precisa contar de 1 até 10, mas o programador esqueceu que o final é exclusivo!",
    codigo_com_erro: "for i in range(1, 10):\n    print(i)",
    codigo_correto: "for i in range(1, 11):\n    print(i)",
    explicacao: "A função range(1, 10) para no 9. Para incluir o 10, devemos usar range(1, 11).",
    dica_livro: "Começando a Programar em Python Para Leigos, Cap. 7",
    xp_recompensa: 40,
    bateria_restaurada: 35,
  },
];

export const CONQUISTAS_MOCK: Conquista[] = [
  {
    id: 1,
    chave: "primeiro_passo",
    titulo: "Primeiro Byte",
    descricao: "Concluiu sua primeira missão no Vilarejo de Valedados.",
    icone: "🌱",
    bits_bonus: 50,
    desbloqueada: true,
  },
  {
    id: 2,
    chave: "guardiao_peneira",
    titulo: "Guardião da Peneira",
    descricao: "Dominou as estruturas condicionais if/elif/else.",
    icone: "⚖️",
    bits_bonus: 50,
    desbloqueada: true,
  },
  {
    id: 3,
    chave: "domador_loops",
    titulo: "Domador de Loops",
    descricao: "Automatizou tarefas repetitivas com o comando for.",
    icone: "🔄",
    bits_bonus: 50,
    desbloqueada: false,
  },
  {
    id: 4,
    chave: "detetive_dados",
    titulo: "Detetive de Dados",
    descricao: "Filtrou registros nulos como um cientista de dados.",
    icone: "🔍",
    bits_bonus: 75,
    desbloqueada: false,
  },
  {
    id: 5,
    chave: "engenheiro_junior",
    titulo: "Engenheiro Júnior Formado",
    descricao: "Concluiu as 6 missões fundamentais do Mundo 1.",
    icone: "🎓",
    bits_bonus: 150,
    desbloqueada: false,
  },
];
