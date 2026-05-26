-- ============================================================
-- Seed: Criação do usuário Admin inicial
-- Login: admin@cursinho.com / Senha: Pac4Finaly321!
-- IMPORTANTE: Altere a senha após o primeiro login!
-- ============================================================

-- Atualiza tipo_usuario com os 3 papéis (se ainda não existir)
INSERT IGNORE INTO `tipo_usuario` (`id`, `tipo`) VALUES
(1, 'Admin'),
(2, 'Educador popular'),
(3, 'Aluno');

-- Cria o usuário Admin (tipo=1, ativo=1)
INSERT IGNORE INTO `usuario` (`id`, `tipo`, `nome`, `email`, `senha`, `ativo`) VALUES
(1, 1, 'Administrador', 'admin@cursinho.com', '$2a$12$2rjEbFAiKo8FhXRXt2vdGu0VfAlTdd8uUPixb9MtW4pd0XO3umpP2', 1);
