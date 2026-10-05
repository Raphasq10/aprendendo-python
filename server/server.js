const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { pool, checkDatabaseConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'pyquest_secret_token_default';

app.use(cors());
app.use(express.json());

// Middleware de autenticação opcional/obrigatória
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Acesso não autorizado. Token ausente.' });

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ erro: 'Token inválido ou expirado.' });
        req.usuario = usuario;
        next();
    });
}

// --------------------------------------------------------------------
// ROTAS DE STATUS E MIGRAÇÃO
// --------------------------------------------------------------------
app.get('/api/status', async (req, res) => {
    const conectado = await checkDatabaseConnection();
    res.json({
        sistema: 'PyQuest API Backend',
        status: 'online',
        banco: conectado ? 'conectado' : 'desconectado (inicie o MySQL no XAMPP)',
        versao: '1.0.0-mvp'
    });
});

// Endpoint para inicializar tabelas e seeds automaticamente se o banco foi criado
app.post('/api/migrar-schema', async (req, res) => {
    try {
        const sqlPath = path.join(__dirname, '..', 'database_schema_mysql.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Divide instruções separando por ponto e vírgula
        const statements = sqlContent
            .split(/;\s*$/m)
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
            await pool.query(statement);
        }

        res.json({ sucesso: true, mensagem: 'Schema e dados iniciais do MySQL importados com sucesso!' });
    } catch (error) {
        console.error('Erro na migração:', error);
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// --------------------------------------------------------------------
// AUTENTICAÇÃO
// --------------------------------------------------------------------
app.post('/api/auth/registrar', async (req, res) => {
    const { apelido, email, senha, avatar } = req.body;

    if (!apelido || !email || !senha) {
        return res.status(400).json({ erro: 'Preencha apelido, email e senha.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);

        const [resultado] = await pool.query(
            `INSERT INTO jogadores (apelido, email, senha_hash, avatar, patente, nivel, xp_atual, xp_proximo_nivel, bateria_atual, bits_moedas)
             VALUES (?, ?, ?, ?, 'Júnior', 1, 0, 100, 100, 50)`,
            [apelido, email, senha_hash, avatar || 'aprendiz_mago']
        );

        const novoId = resultado.insertId;
        const token = jwt.sign({ id: novoId, apelido, email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            sucesso: true,
            token,
            jogador: {
                id: novoId,
                apelido,
                email,
                avatar: avatar || 'aprendiz_mago',
                patente: 'Júnior',
                nivel: 1,
                xp_atual: 0,
                xp_proximo_nivel: 100,
                bateria_atual: 100,
                bits_moedas: 50
            }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Este apelido ou email já está cadastrado.' });
        }
        res.status(500).json({ erro: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { emailOuApelido, senha } = req.body;

    if (!emailOuApelido || !senha) {
        return res.status(400).json({ erro: 'Informe apelido/email e senha.' });
    }

    try {
        const [linhas] = await pool.query(
            `SELECT * FROM jogadores WHERE email = ? OR apelido = ? LIMIT 1`,
            [emailOuApelido, emailOuApelido]
        );

        if (linhas.length === 0) {
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        }

        const jogador = linhas[0];
        const senhaCorreta = await bcrypt.compare(senha, jogador.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        }

        const token = jwt.sign({ id: jogador.id, apelido: jogador.apelido, email: jogador.email }, JWT_SECRET, { expiresIn: '7d' });

        delete jogador.senha_hash;

        res.json({
            sucesso: true,
            token,
            jogador
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// --------------------------------------------------------------------
// DADOS DO JOGADOR E INVENTÁRIO
// --------------------------------------------------------------------
app.get('/api/jogador/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [jogadores] = await pool.query(`SELECT * FROM jogadores WHERE id = ?`, [id]);
        if (jogadores.length === 0) return res.status(404).json({ erro: 'Jogador não encontrado.' });

        const jogador = jogadores[0];
        delete jogador.senha_hash;

        // Conquistas
        const [conquistas] = await pool.query(`
            SELECT c.*, jc.desbloqueada_em 
            FROM conquistas c 
            JOIN jogador_conquistas jc ON jc.conquista_id = c.id 
            WHERE jc.jogador_id = ?
        `, [id]);

        // Habilidades e Fraquezas (Diagnóstico Adaptativo)
        const [habilidades] = await pool.query(`
            SELECT * FROM habilidades_jogador WHERE jogador_id = ?
        `, [id]);

        res.json({
            ...jogador,
            conquistas,
            habilidades
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// --------------------------------------------------------------------
// MUNDOS E MISSÕES
// --------------------------------------------------------------------
app.get('/api/mundos', async (req, res) => {
    try {
        const [mundos] = await pool.query(`SELECT * FROM mundos ORDER BY id ASC`);
        res.json(mundos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/api/mundos/:mundoId/missoes', async (req, res) => {
    const { mundoId } = req.params;
    const jogadorId = req.query.jogador_id || 1;

    try {
        const [missoes] = await pool.query(`
            SELECT m.*, 
                   COALESCE(pm.concluida, 0) as concluida,
                   COALESCE(pm.tentativas, 0) as tentativas,
                   pm.codigo_usuario
            FROM missoes m
            LEFT JOIN progresso_missoes pm 
                ON pm.missao_id = m.id AND pm.jogador_id = ?
            WHERE m.mundo_id = ?
            ORDER BY m.ordem ASC
        `, [jogadorId, mundoId]);

        res.json(missoes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// --------------------------------------------------------------------
// EXECUÇÃO E SUBMISSÃO DE CÓDIGO
// --------------------------------------------------------------------
app.post('/api/missoes/submeter', async (req, res) => {
    const { jogador_id, missao_id, codigo_usuario, sucesso, erro_tipo, mensagem_erro, topico_chave } = req.body;

    try {
        // 1. Registra no log de execuções
        await pool.query(`
            INSERT INTO log_execucoes (jogador_id, missao_id, sucesso, erro_tipo, mensagem_erro)
            VALUES (?, ?, ?, ?, ?)
        `, [jogador_id, missao_id, sucesso ? 1 : 0, erro_tipo || null, mensagem_erro || null]);

        // Busca dados da missão e do jogador
        const [[missao]] = await pool.query(`SELECT * FROM missoes WHERE id = ?`, [missao_id]);
        const [[jogador]] = await pool.query(`SELECT * FROM jogadores WHERE id = ?`, [jogador_id]);

        if (!missao || !jogador) {
            return res.status(404).json({ erro: 'Missão ou jogador não encontrado.' });
        }

        let novaBateria = jogador.bateria_atual;
        let novoXp = jogador.xp_atual;
        let novoNivel = jogador.nivel;
        let novosBits = jogador.bits_moedas;
        let mensagemFeedback = '';
        let subiuNivel = false;

        if (sucesso) {
            // Sucesso: ganha XP e Bits
            novoXp += missao.xp_recompensa;
            novosBits += missao.bits_recompensa;

            // Lógica de Level Up (Níveis 1 a 50 no MVP Júnior, 51+ Pleno, 111+ Sênior)
            let xpNecessario = jogador.xp_proximo_nivel;
            while (novoXp >= xpNecessario) {
                novoXp -= xpNecessario;
                novoNivel += 1;
                xpNecessario = Math.floor(xpNecessario * 1.25);
                subiuNivel = true;
            }

            // Atualiza patente
            let novaPatente = 'Júnior';
            if (novoNivel >= 111) novaPatente = 'Sênior';
            else if (novoNivel >= 51) novaPatente = 'Pleno';

            // Atualiza progresso da missão
            await pool.query(`
                INSERT INTO progresso_missoes (jogador_id, missao_id, concluida, tentativas, codigo_usuario, concluida_em)
                VALUES (?, ?, 1, 1, ?, NOW())
                ON DUPLICATE KEY UPDATE 
                    concluida = 1,
                    tentativas = tentativas + 1,
                    codigo_usuario = VALUES(codigo_usuario),
                    concluida_em = NOW()
            `, [jogador_id, missao_id, codigo_usuario]);

            // Atualiza o jogador
            await pool.query(`
                UPDATE jogadores 
                SET xp_atual = ?, nivel = ?, xp_proximo_nivel = ?, bits_moedas = ?, patente = ?
                WHERE id = ?
            `, [novoXp, novoNivel, xpNecessario, novosBits, novaPatente, jogador_id]);

            // Se havia habilidade mapeada, registra acerto consecutivo
            if (topico_chave) {
                await pool.query(`
                    INSERT INTO habilidades_jogador (jogador_id, topico_chave, topico_nome, acertos_consecutivos, percentual_dominio, precisa_reforco)
                    VALUES (?, ?, ?, 1, 100.0, 0)
                    ON DUPLICATE KEY UPDATE
                        acertos_consecutivos = acertos_consecutivos + 1,
                        percentual_dominio = LEAST(100.0, percentual_dominio + 15.0),
                        precisa_reforco = IF(percentual_dominio >= 70, 0, precisa_reforco)
                `, [jogador_id, topico_chave, topico_chave]);
            }

            mensagemFeedback = `🎉 Incrível! Você concluiu "${missao.titulo}"! (+${missao.xp_recompensa} XP, +${missao.bits_recompensa} Bits)`;

        } else {
            // Falha: Drena bateria em 10% (mínimo 0%)
            novaBateria = Math.max(0, novaBateria - 10);

            await pool.query(`
                UPDATE jogadores SET bateria_atual = ? WHERE id = ?
            `, [novaBateria, jogador_id]);

            // Atualiza progresso com tentativa falha
            await pool.query(`
                INSERT INTO progresso_missoes (jogador_id, missao_id, concluida, tentativas, codigo_usuario)
                VALUES (?, ?, 0, 1, ?)
                ON DUPLICATE KEY UPDATE 
                    tentativas = tentativas + 1,
                    codigo_usuario = VALUES(codigo_usuario)
            `, [jogador_id, missao_id, codigo_usuario]);

            // Registra ponto fraco em habilidades_jogador
            if (topico_chave) {
                await pool.query(`
                    INSERT INTO habilidades_jogador (jogador_id, topico_chave, topico_nome, erros_cometidos, percentual_dominio, precisa_reforco)
                    VALUES (?, ?, ?, 1, 20.0, 1)
                    ON DUPLICATE KEY UPDATE
                        erros_cometidos = erros_cometidos + 1,
                        acertos_consecutivos = 0,
                        percentual_dominio = GREATEST(0.0, percentual_dominio - 20.0),
                        precisa_reforco = 1
                `, [jogador_id, topico_chave, topico_chave]);
            }

            mensagemFeedback = novaBateria === 0
                ? '⚡ Alerta! Sua bateria esgotou. Faça um Treino de Reforço para recarregar o Datapad e continuar jogando!'
                : `⚡ Ops! Algo falhou no código. Sua bateria reduziu para ${novaBateria}%. Veja a dica teórica e tente novamente!`;
        }

        res.json({
            sucesso,
            bateria_atual: novaBateria,
            xp_atual: novoXp,
            nivel: novoNivel,
            subiuNivel,
            bits_moedas: novosBits,
            mensagemFeedback,
            precisaRecarregar: novaBateria === 0
        });

    } catch (error) {
        console.error('Erro ao submeter missão:', error);
        res.status(500).json({ erro: error.message });
    }
});

// --------------------------------------------------------------------
// TREINOS DE REFORÇO ADAPTATIVO
// --------------------------------------------------------------------
app.get('/api/reforco', async (req, res) => {
    try {
        const [treinos] = await pool.query(`SELECT * FROM treinos_reforco ORDER BY RAND() LIMIT 5`);
        res.json(treinos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.post('/api/reforco/concluir', async (req, res) => {
    const { jogador_id, treino_id } = req.body;

    try {
        const [[treino]] = await pool.query(`SELECT * FROM treinos_reforco WHERE id = ?`, [treino_id]);
        const [[jogador]] = await pool.query(`SELECT * FROM jogadores WHERE id = ?`, [jogador_id]);

        if (!treino || !jogador) {
            return res.status(404).json({ erro: 'Treino ou jogador não localizado.' });
        }

        const novaBateria = Math.min(100, jogador.bateria_atual + treino.bateria_restaurada);
        const novoXp = jogador.xp_atual + treino.xp_recompensa;

        await pool.query(`
            UPDATE jogadores 
            SET bateria_atual = ?, xp_atual = ?
            WHERE id = ?
        `, [novaBateria, novoXp, jogador_id]);

        // Alivia status em habilidades_jogador
        await pool.query(`
            UPDATE habilidades_jogador 
            SET precisa_reforco = 0, acertos_consecutivos = acertos_consecutivos + 1
            WHERE jogador_id = ? AND topico_chave = ?
        `, [jogador_id, treino.topico_chave]);

        res.json({
            sucesso: true,
            bateria_atual: novaBateria,
            xp_atual: novoXp,
            mensagem: `🔋 Datapad restaurado em +${treino.bateria_restaurada}% de bateria e +${treino.xp_recompensa} XP!`
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.listen(PORT, async () => {
    console.log(`\n==================================================`);
    console.log(`🚀 [PyQuest Server] Rodando na porta http://localhost:${PORT}`);
    console.log(`==================================================`);
    await checkDatabaseConnection();
});
