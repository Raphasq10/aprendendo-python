# 🐍 Python Masterclass - Guia Completo da Disciplina de Programação

Este repositório contém uma aplicação interativa moderna desenvolvida sob medida para a revisão completa da disciplina de **Linguagem de Programação (Python)**. 

Todo o material foi estruturado diretamente a partir dos conteúdos oficiais ministrados em sala de aula e nos cadernos do **Google Colab**, cobrindo desde a sintaxe básica até bancos de dados, Pandas, aplicações Web, Mobile e Inteligência Artificial.

---

## 🎯 O que foi melhorado em relação aos slides tradicionais?
- **Linguagem Didática e Descontraída:** Explicações claras e diretas que mostram o *porquê* de cada conceito através de analogias do mundo real (como a regra da peneira no `if/elif` e a forma de bolo na POO).
- **🚨 Alertas de "Cai na Prova":** Destaque visual para as pegadinhas clássicas cobradas pelas bancas e plataformas de faculdade (ex: sintaxe de funções lambda sem corpo definido formal, conversão de dicionário em Series do Pandas, SQLite serverless em arquivo único, parâmetro `estimator` no Seaborn e `MDTabs` no KivyMD).
- **📋 Integração com Google Colab:** Botão rápido com 1 clique para copiar o código testado direto para as células do seu notebook.
- **▶️ Execução de Código Interativa:** Veja a saída real do terminal de cada exemplo sem precisar sair da página.
- **🧠 Quizzes Interativos com Gabarito:** Questões de fixação ao final de cada tópico com explicações detalhadas na hora.
- **📽️ Modo Apresentação vs. 📖 Modo Apostila:** Alterne entre slides interativos e uma apostila contínua com scroll completo para leitura rápida antes da prova.

---

## 📚 Ementa Oficial Coberta (4 Unidades / 20 Aulas)

### **Unidade 1: Introdução à Linguagem Python**
1. **Aula 1:** Origem, filosofia de legibilidade de Guido van Rossum, PEP 8, ambientes (Google Colab vs IDEs) e primeiro programa.
2. **Aula 1 (cont.):** Variáveis fundamentais (`int`, `float`, `str`, `bool`), o cuidado com `input()`, conversão de tipos (casting) e f-strings.
3. **Aula 2:** Operadores relacionais (`==`, `!=`, `<`, `>`) e operadores lógicos (`and`, `or`, `not`).
4. **Aula 2 (cont.):** Estruturas condicionais (`if`, `elif`, `else`) e a regra de ouro da condição mais restritiva primeiro.
5. **Aula 3:** Laços de repetição (`for`, `range()`, `while`), controle de fluxo com `break` e `continue`.
6. **Aula 4/5:** Funções com `def`, parâmetros, retorno com `return`, escopo e funções anônimas (`lambda`).

### **Unidade 2: Recursos do Python, Coleções e POO**
7. **Aula 1:** Sequências: Listas (`[]` mutáveis, `.append()`, `.pop()`, slicing) vs. Tuplas (`()` imutáveis).
8. **Aula 2:** Conjuntos (`set`, eliminação automática de duplicatas) e Dicionários (`dict`, chave: valor).
9. **Aula 2 (cont.):** *List Comprehension* (`[c.lower() for c in cores]`) e boas práticas Pythônicas.
10. **Aula 2 (cont.):** Computação com **NumPy**: Vetorização, `np.array` e operações matemáticas de alta performance.
11. **Aula 3:** Programação Orientada a Objetos: Classes, Objetos, o construtor `__init__(self)` e atributos/métodos.
12. **Aula 4/5:** Herança de classes, polimorfismo e criação/importação de módulos e pacotes com `pip`.

### **Unidade 3: Análise de Dados e Banco de Dados com Python**
13. **Aula 1:** **SQLite** e o seu diferencial: banco relacional embutido, *serverless* e armazenado em arquivo único `.db`. Comandos DML (CRUD) vs. DDL.
14. **Aula 2:** Biblioteca **Pandas**: Estrutura `Series` (chaves de dicionário viram índices!) e `DataFrame`.
15. **Aula 3:** Manipulação e higienização de dados: Filtros condicionais, tratamento de valores nulos e remoção de duplicados com `drop_duplicates()`.
16. **Aula 4/5:** Visualização de dados com **Matplotlib** e **Seaborn**: tipos de gráficos e o parâmetro `estimator` no `sns.barplot()`.

### **Unidade 4: Aplicações com Python**
17. **Aula 1:** Programação Web: Arquitetura Cliente/Servidor, HTTP, rotas com o microframework **Flask** vs. o full-stack **Django**.
18. **Aula 2:** Programação Mobile: Desenvolvimento de apps para Android/iOS com **Kivy** e **KivyMD**, ciclo de vida do app e navegação por abas com `MDTabs`.
19. **Aula 3:** Qualidade de Software: Testes em docstrings com `doctest` e testes formais com `unittest` (`if __name__ == '__main__': unittest.main()`).
20. **Aula 4/5:** Inteligência Artificial: Os 3 tipos de aprendizado (Supervisionado, Não Supervisionado e por Reforço) e introdução a Redes Neurais com **TensorFlow / Keras** (`Sequential`, `Flatten`, `Dense`).

---

## 🚀 Como Rodar o Projeto

### Opção 1: Direto pelo Navegador (Sem servidor)
1. Dê um duplo clique no arquivo `index.html`.
2. O material abrirá imediatamente no seu navegador padrão (Chrome, Edge, Firefox, etc.).

### Opção 2: Pelo XAMPP (Apache)
Como os arquivos já estão na pasta `htdocs` do seu XAMPP:
1. Abra o painel do **XAMPP Control Panel** e inicie o serviço **Apache**.
2. Abra seu navegador e acerte a URL:
   ```text
   http://localhost/python-aula/
   ```

---

## ⌨️ Atalhos de Navegação nos Slides
- **Seta para Direita (`→`) ou Barra de Espaço:** Próxima aula / slide
- **Seta para Esquerda (`←`):** Aula / slide anterior
- **Barra de Busca Superior:** Digite qualquer termo (ex: `lambda`, `sqlite`, `pandas`, `tupla`) para saltar imediatamente para o tópico correspondente.
