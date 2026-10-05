import os
import sys

# Garante carregamento das DLLs do SQLite no Windows/Anaconda
for path_cand in [
    os.path.join(sys.prefix, 'Library', 'bin'),
    os.path.join(sys.prefix, 'DLLs'),
]:
    if os.path.exists(path_cand):
        os.environ['PATH'] = path_cand + os.pathsep + os.environ.get('PATH', '')
        if hasattr(os, 'add_dll_directory'):
            try:
                os.add_dll_directory(path_cand)
            except Exception:
                pass

import sqlite3

DB_NAME = "pyquest.db"
SCHEMA_FILE = "database_schema.sql"

def init_db():
    print(f"[*] Inicializando banco de dados '{DB_NAME}'...")
    
    if not os.path.exists(SCHEMA_FILE):
        print(f"[!] Erro: Arquivo de schema '{SCHEMA_FILE}' não encontrado.")
        return False

    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    conn = sqlite3.connect(DB_NAME)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    # Executa todo o script SQL
    cursor.executescript(schema_sql)
    conn.commit()

    # Validação e Consulta de Teste
    print("[+] Schema executado com sucesso!")
    
    cursor.execute("SELECT COUNT(*) FROM mundos;")
    total_mundos = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM missoes;")
    total_missoes = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM conquistas;")
    total_conquistas = cursor.fetchone()[0]

    print(f"[i] Mundos cadastrados: {total_mundos}")
    print(f"[i] Missões pedagógicas cadastradas: {total_missoes}")
    print(f"[i] Conquistas cadastradas: {total_conquistas}")

    print("\n--- Lista de Missões Pedagógicas do Mundo Júnior ---")
    cursor.execute("SELECT ordem, titulo, npc_nome, referencia_livro FROM missoes ORDER BY ordem;")
    for row in cursor.fetchall():
        print(f"  Fase {row[0]}: {row[1]} (NPC: {row[2]}) -> Ref: {row[3][:45]}...")

    conn.close()
    print("\n[OK] Banco de dados 'pyquest.db' pronto e validado com sucesso!")
    return True

if __name__ == "__main__":
    init_db()
