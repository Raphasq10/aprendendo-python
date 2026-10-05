-- =====================================================================
-- PYQUEST: AS CRÔNICAS DOS DADOS (SCHEMA DO BANCO DE DADOS RELACIONAL)
-- Fundamentado nas referências teóricas:
-- - Pense em Python (Allen B. Downey)
-- - Começando a Programar em Python Para Leigos (John Paul Mueller)
-- - Python: Escreva seus primeiros programas (Felipe Cruz - Casa do Código)
-- - Data Science do Zero (Joel Grus - O'Reilly)
-- =====================================================================

PRAGMA foreign_keys = ON;

-- 1. TABELA DE JOGADORES (PERFIS E PROGRESSÃO GERAL)
CREATE TABLE IF NOT EXISTS jogadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    apelido TEXT NOT NULL UNIQUE,
    avatar TEXT NOT NULL DEFAULT 'aprendiz_mago',
    patente TEXT NOT NULL DEFAULT 'Júnior',
    nivel INTEGER NOT NULL DEFAULT 1,
    xp_atual INTEGER NOT NULL DEFAULT 0,
    xp_proximo_nivel INTEGER NOT NULL DEFAULT 100,
    bateria_atual INTEGER NOT NULL DEFAULT 100,
    bits_moedas INTEGER NOT NULL DEFAULT 50,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE MUNDOS / REGIÕES DO JOGO
CREATE TABLE IF NOT EXISTS mundos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chave TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    patente_exigida TEXT NOT NULL,
    descricao TEXT NOT NULL,
    icone TEXT NOT NULL
);

-- 3. TABELA DE MISSÕES PEDAGÓGICAS (BASEADAS NOS LIVROS)
CREATE TABLE IF NOT EXISTS missoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mundo_id INTEGER NOT NULL,
    ordem INTEGER NOT NULL,
    chave TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    npc_nome TEXT NOT NULL,
    npc_dialogo TEXT NOT NULL,
    objetivo_historia TEXT NOT NULL,
    codigo_inicial TEXT NOT NULL,
    codigo_solucao TEXT NOT NULL,
    assert_teste TEXT NOT NULL,
    dica_teorica TEXT NOT NULL,
    referencia_livro TEXT NOT NULL,
    xp_recompensa INTEGER NOT NULL DEFAULT 100,
    bits_recompensa INTEGER NOT NULL DEFAULT 25,
    FOREIGN KEY (mundo_id) REFERENCES mundos(id) ON DELETE CASCADE
);

-- 4. TABELA DE PROGRESSO DO JOGADOR NAS MISSÕES
CREATE TABLE IF NOT EXISTS progresso_missoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jogador_id INTEGER NOT NULL,
    missao_id INTEGER NOT NULL,
    concluida BOOLEAN NOT NULL DEFAULT 0,
    tentativas INTEGER NOT NULL DEFAULT 0,
    codigo_usuario TEXT,
    concluida_em DATETIME,
    FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    FOREIGN KEY (missao_id) REFERENCES missoes(id) ON DELETE CASCADE,
    UNIQUE(jogador_id, missao_id)
);

-- 5. TABELA DE INVENTÁRIO (ITENS COLETADOS / MOCHILA)
CREATE TABLE IF NOT EXISTS inventario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jogador_id INTEGER NOT NULL,
    item_chave TEXT NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'ferramenta', 'tema', 'pocao', 'livro'
    descricao TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    UNIQUE(jogador_id, item_chave)
);

-- 6. TABELA DE CONQUISTAS E DISTINTIVOS
CREATE TABLE IF NOT EXISTS conquistas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chave TEXT NOT NULL UNIQUE,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    icone TEXT NOT NULL,
    bits_bonus INTEGER NOT NULL DEFAULT 50
);

-- 7. TABELA ASSOCIATIVA DE CONQUISTAS DESBLOQUEADAS
CREATE TABLE IF NOT EXISTS jogador_conquistas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jogador_id INTEGER NOT NULL,
    conquista_id INTEGER NOT NULL,
    desbloqueada_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    FOREIGN KEY (conquista_id) REFERENCES conquistas(id) ON DELETE CASCADE,
    UNIQUE(jogador_id, conquista_id)
);

-- 8. TABELA DE LOGS DE EXECUÇÃO (MÉTRICAS E DEPURAÇÃO)
CREATE TABLE IF NOT EXISTS log_execucoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jogador_id INTEGER NOT NULL,
    missao_id INTEGER NOT NULL,
    sucesso BOOLEAN NOT NULL,
    erro_tipo TEXT,
    mensagem_erro TEXT,
    executado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    FOREIGN KEY (missao_id) REFERENCES missoes(id) ON DELETE CASCADE
);

-- 9. TABELA DE DIAGNÓSTICO ADAPTATIVO (MAPEAMENTO DE DIFICULDADES E ERROS)
CREATE TABLE IF NOT EXISTS habilidades_jogador (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jogador_id INTEGER NOT NULL,
    topico_chave TEXT NOT NULL, -- ex: 'sintaxe_dois_pontos', 'comparacao_vs_atribuicao', 'conversao_tipos', 'limites_range', 'retorno_funcao', 'indentacao'
    topico_nome TEXT NOT NULL,
    erros_cometidos INTEGER NOT NULL DEFAULT 0,
    acertos_consecutivos INTEGER NOT NULL DEFAULT 0,
    percentual_dominio REAL NOT NULL DEFAULT 0.0,
    precisa_reforco BOOLEAN NOT NULL DEFAULT 0,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    UNIQUE(jogador_id, topico_chave)
);

-- 10. TABELA DE TREINOS DE REFORÇO ADAPTATIVO (PARA RECUPERAR BATERIA E GANHAR XP EXTRA)
CREATE TABLE IF NOT EXISTS treinos_reforco (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topico_chave TEXT NOT NULL,
    titulo TEXT NOT NULL,
    enunciado TEXT NOT NULL,
    codigo_com_erro TEXT NOT NULL,
    codigo_correto TEXT NOT NULL,
    explicacao_erro TEXT NOT NULL,
    dica_livro TEXT NOT NULL,
    xp_recompensa INTEGER NOT NULL DEFAULT 40,
    bateria_restaurada INTEGER NOT NULL DEFAULT 35
);

-- =====================================================================
-- POPULAÇÃO INICIAL: MUNDOS E MISSÕES BASEADAS NAS REFERÊNCIAS
-- =====================================================================

INSERT OR IGNORE INTO mundos (id, chave, nome, patente_exigida, descricao, icone) VALUES
(1, 'mundo_1_junior', 'Vilarejo de Valedados', 'Júnior', 'Fundamentos de programação, tipos primitivos, condicionais e laços cotidianos.', '🏡'),
(2, 'mundo_2_pleno', 'Distrito dos Arquivos', 'Pleno', 'Coleções estruturadas, Programação Orientada a Objetos e manipulação com SQLite e Pandas.', '🏛️'),
(3, 'mundo_3_senior', 'Metrópole Algorítmica', 'Sênior', 'Arquitetura de software, Clean Code, testes automatizados e Ciência de Dados.', '🏙️');

-- Missões do Mundo 1 (Patente Júnior)
INSERT OR IGNORE INTO missoes 
(id, mundo_id, ordem, chave, titulo, npc_nome, npc_dialogo, objetivo_historia, codigo_inicial, codigo_solucao, assert_teste, dica_teorica, referencia_livro, xp_recompensa, bits_recompensa)
VALUES
(
    1,
    1,
    1,
    'm1_balanca_mercearia',
    'A Balança da Mercearia',
    'Seu Zé do Armazém',
    'Ô criatura! Chegaram três caixas de laranjas e preciso registrar o peso em quilos e o preço unitário para não tomar prejuízo!',
    'Crie as variáveis `peso_kg` (float) com 12.5 e `preco_por_kg` (float) com 4.20. Calcule o `total_compra` multiplicando os dois valores.',
    '# Ajude o Seu Zé a definir as variáveis da balança:\npeso_kg = 12.5\npreco_por_kg = 4.20\n\n# Calcule o total_compra:\ntotal_compra = peso_kg * preco_por_kg\nprint(f"Total: R$ {total_compra:.2f}")',
    'peso_kg = 12.5\npreco_por_kg = 4.20\ntotal_compra = peso_kg * preco_por_kg\nprint(f"Total: R$ {total_compra:.2f}")',
    'assert abs(total_compra - 52.5) < 0.01, "O total da compra deve ser R$ 52.50!"',
    'Uma variável é como uma gaveta etiquetada na memória. Valores com casas decimais usam ponto (.) e são do tipo float.',
    'Começando a Programar em Python Para Leigos, Cap. 5 ("Armazenando e Modificando Informações")',
    100,
    25
),
(
    2,
    1,
    2,
    'm2_cofrinho_turma',
    'O Cofrinho da Turma',
    'Bia da Pipoca',
    'Juntamos nossas moedas para comprar os ingressos do cinema! Mas precisamos calcular quanto sobra de troco certinho.',
    'Calcule o troco: guarde o `valor_pago` (50.0) e o `custo_ingresso` (38.50). Calcule o `troco` e exiba com uma f-string formatada com duas casas decimais.',
    'valor_pago = 50.0\ncusto_ingresso = 38.50\n\n# Calcule o troco:\ntroco = valor_pago - custo_ingresso\nprint(f"Troco a devolver: R$ {troco:.2f}")',
    'valor_pago = 50.0\ncusto_ingresso = 38.50\ntroco = valor_pago - custo_ingresso\nprint(f"Troco a devolver: R$ {troco:.2f}")',
    'assert abs(troco - 11.5) < 0.01, "O troco exato deve ser R$ 11.50!"',
    'F-strings (PEP 498) permitem injetar variáveis dentro de textos com facilidade: f"Texto {variavel:.2f}" formata com 2 casas decimais.',
    'Python: Escreva seus primeiros programas, Cap. 2 ("Aprendendo Python na prática: números e strings")',
    100,
    25
),
(
    3,
    1,
    3,
    'm3_catraca_parque',
    'A Catraca Justa do Parque',
    'Fiscal Roberto',
    'A catraca do parque precisa de regras claras: menores de 5 anos não pagam nada (Gratuito), de 5 a 12 anos pagam meia (Meia-Entrada), e os demais pagam Inteira!',
    'Use if/elif/else aplicando a regra da peneira para a variável `idade = 8`. Salve o resultado na variável `tipo_ingresso`.',
    'idade = 8\n\n# Aplique a regra da peneira:\nif idade < 5:\n    tipo_ingresso = "Gratuito"\nelif idade <= 12:\n    tipo_ingresso = "Meia-Entrada"\nelse:\n    tipo_ingresso = "Inteira"\n\nprint(f"Ingresso: {tipo_ingresso}")',
    'idade = 8\nif idade < 5:\n    tipo_ingresso = "Gratuito"\nelif idade <= 12:\n    tipo_ingresso = "Meia-Entrada"\nelse:\n    tipo_ingresso = "Inteira"\nprint(f"Ingresso: {tipo_ingresso}")',
    'assert tipo_ingresso == "Meia-Entrada", "Para idade 8, o tipo deve ser Meia-Entrada!"',
    'Na regra da peneira, condições mais restritivas devem vir primeiro para evitar que filtros maiores capturem o dado antes da hora.',
    'Pense em Python, Cap. 5 ("Condicionais e Recursividade")',
    120,
    30
),
(
    4,
    1,
    4,
    'm4_robo_regador',
    'O Robô Regador da Praça',
    'Jardineira Dona Flor',
    'Nosso robô jardineiro precisa regar exatamente 5 canteiros numerados de 1 a 5. Sem um loop for, ele fica parado!',
    'Crie um laço `for` com `range(1, 6)` que acumule o número total de canteiros regados em uma variável `canteiros_regados`.',
    'canteiros_regados = 0\n\n# Use o for com range para regar os canteiros de 1 a 5:\nfor canteiro in range(1, 6):\n    print(f"Regando canteiro {canteiro}...")\n    canteiros_regados += 1\n\nprint(f"Total regado: {canteiros_regados}")',
    'canteiros_regados = 0\nfor canteiro in range(1, 6):\n    canteiros_regados += 1\nprint(f"Total regado: {canteiros_regados}")',
    'assert canteiros_regados == 5, "Devem ser regados exatamente 5 canteiros!"',
    'A função range(inicio, fim) é exclusiva no final: range(1, 6) percorre 1, 2, 3, 4 e 5.',
    'Começando a Programar em Python Para Leigos, Cap. 7 ("Realizando Ações Repetitivas")',
    120,
    30
),
(
    5,
    1,
    5,
    'm5_detector_nulos',
    'O Detector de Livros Perdidos',
    'Bibliotecário Arquimedes',
    'Alguém desarrumou a estante e colocou registros vazios (None) na lista de livros emprestados!',
    'Dada a lista `registros = ["Dom Casmurro", None, "O Alquimista", None, "Capitães da Areia"]`, percorra a lista e crie uma nova lista `livros_validos` contendo apenas os títulos reais (descartando os None).',
    'registros = ["Dom Casmurro", None, "O Alquimista", None, "Capitães da Areia"]\nlivros_validos = []\n\n# Filtre os elementos que não são None:\nfor item in registros:\n    if item is not None:\n        livros_validos.append(item)\n\nprint("Livros válidos:", livros_validos)',
    'registros = ["Dom Casmurro", None, "O Alquimista", None, "Capitães da Areia"]\nlivros_validos = [item for item in registros if item is not None]\nprint("Livros válidos:", livros_validos)',
    'assert len(livros_validos) == 3 and None not in livros_validos, "A lista deve conter apenas os 3 livros válidos!"',
    'Em ciência de dados, higienizar dados nulos é a primeira tarefa fundamental antes de qualquer análise séria.',
    'Data Science do Zero, Cap. 2 ("Um Curso Intensivo de Python")',
    150,
    40
),
(
    6,
    1,
    6,
    'm6_mestre_junior',
    'O Desafio do Mestre Júnior',
    'Mestre Ada da Torre',
    'Chegou a hora de provar que você é um Engenheiro Júnior de verdade. Crie uma função completa para a cidade!',
    'Defina uma função chamada `calcular_desconto(preco, percentual)` que retorne o preço final com desconto. Se o percentual for menor que 0 ou maior que 100, retorne None.',
    'def calcular_desconto(preco, percentual):\n    # Valide o percentual (entre 0 e 100):\n    if percentual < 0 or percentual > 100:\n        return None\n    desconto = preco * (percentual / 100)\n    return preco - desconto\n\n# Testando a função:\nresultado = calcular_desconto(100.0, 15)\nprint("Preço com desconto:", resultado)',
    'def calcular_desconto(preco, percentual):\n    if percentual < 0 or percentual > 100:\n        return None\n    return preco - (preco * (percentual / 100))\nresultado = calcular_desconto(100.0, 15)',
    'assert calcular_desconto(100.0, 20) == 80.0 and calcular_desconto(100.0, 150) is None, "A função deve calcular o desconto e validar os limites!"',
    'Funções empacotam regras de negócio reutilizáveis através do comando def e da cláusula return.',
    'Pense em Python, Cap. 3 ("Funções")',
    200,
    50
);

-- Conquistas Iniciais
INSERT OR IGNORE INTO conquistas (id, chave, titulo, descricao, icone, bits_bonus) VALUES
(1, 'primeiro_passo', 'Primeiro Byte', 'Concluiu a primeira missão no Vilarejo de Valedados.', '🌱', 50),
(2, 'mestre_peneira', 'Guardião da Peneira', 'Dominou as estruturas condicionais if/elif/else.', '⚖️', 50),
(3, 'domador_loops', 'Domador de Loops', 'Automatizou tarefas repetitivas com o comando for.', '🔄', 50),
(4, 'limpador_dados', 'Detetive de Dados', 'Filtrou registros nulos como um cientista de dados.', '🔍', 75),
(5, 'junior_formado', 'Engenheiro Júnior', 'Completou todas as 6 missões do Mundo 1.', '🎓', 150);

-- Treinos de Reforço Adaptativo (Para Farmar XP e Curar Bateria)
INSERT OR IGNORE INTO treinos_reforco 
(id, topico_chave, titulo, enunciado, codigo_com_erro, codigo_correto, explicacao_erro, dica_livro, xp_recompensa, bateria_restaurada)
VALUES
(
    1,
    'comparacao_vs_atribuicao',
    'Treino: O Sinal Perdido',
    'Conserte a verificação lógica. O código abaixo está usando atribuição em vez de comparação!',
    'if nivel = 10:\n    print("Parabéns")',
    'if nivel == 10:\n    print("Parabéns")',
    'Um único sinal (=) guarda valor na variável. Dois sinais (==) comparam se os valores são iguais!',
    'Pense em Python, Cap. 2 ("Variáveis, Expressões e Instruções")',
    40,
    35
),
(
    2,
    'conversao_tipos',
    'Treino: O Texto Que Queria Ser Número',
    'O código tenta somar texto com número sem converter! Conserte convertendo a idade para int.',
    'idade_texto = "12"\ntotal = idade_texto + 5',
    'idade_texto = "12"\ntotal = int(idade_texto) + 5',
    'O Python não soma texto com número diretamente. Use int() ou float() para fazer o casting.',
    'Começando a Programar em Python Para Leigos, Cap. 5 ("Conversão de Tipos")',
    40,
    35
),
(
    3,
    'sintaxe_dois_pontos',
    'Treino: O Portão dos Dois Pontos',
    'O programador se esqueceu do caractere obrigatório no final da linha do if!',
    'if pontuacao >= 100\n    print("Recorde!")',
    'if pontuacao >= 100:\n    print("Recorde!")',
    'Em Python, blocos de comando (if, elif, else, for, while, def) SEMPRE terminam com dois pontos (:).',
    'Python: Escreva seus primeiros programas, Cap. 3 ("Estruturas de Controle")',
    40,
    35
),
(
    4,
    'limites_range',
    'Treino: A Contagem Exata',
    'O laço for precisa contar de 1 até 10, mas parou no 9! Ajuste o range.',
    'for i in range(1, 10):\n    print(i)',
    'for i in range(1, 11):\n    print(i)',
    'O segundo argumento da função range(inicio, fim) é exclusivo (não entra na contagem).',
    'Pense em Python, Cap. 4 ("Estudo de Caso: Projeto de Interface")',
    40,
    35
),
(
    5,
    'retorno_funcao',
    'Treino: O Retorno Silencioso',
    'A função apenas imprime com print(), mas precisa devolver o resultado com return!',
    'def dobro(n):\n    print(n * 2)',
    'def dobro(n):\n    return n * 2',
    'print() apenas joga o texto na tela para humanos lerem; return devolve o dado para o programa usar.',
    'Pense em Python, Cap. 3 ("Funções com Resultado")',
    45,
    40
);
