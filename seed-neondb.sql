-- ============================================================
-- Seed para NeonDB (PostgreSQL)
-- Criação do usuário Admin inicial
-- Login: admin@cursinho.com / Senha: Pac4Finaly321!
-- IMPORTANTE: Altere a senha após o primeiro login!
-- ============================================================
-- NOTA: As tabelas são criadas automaticamente pelo Hibernate
-- (hbm2ddl.auto=update). Este script só insere os dados iniciais.
-- Execute DEPOIS que o backend subir pela primeira vez.

INSERT INTO tipo_usuario (id, tipo) VALUES
(1, 'Admin'),
(2, 'Educador popular'),
(3, 'Aluno')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tipo_frequencia (id, tipo) VALUES
(11, 'F'),
(12, 'FJ'),
(13, 'P')
ON CONFLICT (id) DO NOTHING;

INSERT INTO usuario (id, tipo, nome, email, senha, ativo) VALUES
(1, 1, 'Administrador', 'admin@cursinho.com', '$2a$12$2rjEbFAiKo8FhXRXt2vdGu0VfAlTdd8uUPixb9MtW4pd0XO3umpP2', true)
ON CONFLICT (id) DO NOTHING;
