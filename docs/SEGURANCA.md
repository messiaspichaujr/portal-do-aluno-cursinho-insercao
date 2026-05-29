# 🔒 Guia de Segurança — Portal do Aluno (Cursinho Inserção)

> Documento de referência para evitar erros críticos ao modificar o sistema.
> Leia antes de qualquer alteração em rotas, autenticação ou endpoints.

---

## 1. 🏗️ Arquitetura de Segurança

### Stack
| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Autenticação | JWT (HS256) | Geração e validação de tokens |
| Filtro | `AuthenticationFilter.java` | Intercepta requisições com `@Seguranca` |
| Autorização | `@AdminOnly`, `@ProfessorOnly` | Restringe por tipo de usuário |
| Frontend | JWT armazenado em `localStorage` | Enviado via header `Authorization: Bearer` |
| CORS | Configurado no `ServerConfigurator.java` | Liberado para origens configuradas via env |

### Mapa de Perfis
| Tipo | Nome | Acesso |
|------|------|--------|
| `tipo=1` | Admin | Tudo (CRUD completo) |
| `tipo=2` | Professor | Portal do Aluno (notas, frequência, recados, conteúdos) |
| `tipo=3` | Aluno | Visualização de notas, frequência, recados, conteúdos |

⚠️ **CRÍTICO:** Admin (`tipo=1`) e Professor (`tipo=2`) têm permissões DIFERENTES.
NUNCA tratar `tipo=1` e `tipo=2` como equivalentes.

---

## 2. 🚦 Rotas da API e Níveis de Acesso

### `/api/usuarios`
| Método | Path | Acesso | Arquivo |
|--------|------|--------|---------|
| POST | `/` | Público (cadastro) | `UsuarioResource.java:24` |
| POST | `/login` | Público | `UsuarioResource.java:37` |
| GET | `/professores/pendentes` | AdminOnly | `UsuarioResource.java:52` |
| GET | `/professores/ativos` | AdminOnly | `UsuarioResource.java:62` |
| PUT | `/{id}/aprovar` | AdminOnly | `UsuarioResource.java:71` |
| DELETE | `/{id}` | AdminOnly | `UsuarioResource.java:157` — **unificado!** |
| GET | `/alunos/pendentes` | AdminOnly | `UsuarioResource.java:81` |
| GET | `/nomes` | Seguranca (qualquer logado) | `UsuarioResource.java:90` |
| GET | `/alunos/matriculados` | AdminOnly | `UsuarioResource.java:115` |
| PUT | `/alunos/{id}/aprovar` | AdminOnly | `UsuarioResource.java:124` |
| DELETE | `/alunos/{id}` | AdminOnly | `UsuarioResource.java:133` |
| PUT | `/{id}` | AdminOnly | `UsuarioResource.java:142` |
| GET | `/{id}/dependencias` | AdminOnly | `UsuarioResource.java:170` |

### `/api/avaliacoes`, `/api/notas`, `/api/frequencias`, `/api/recados`, `/api/conteudos`
Gerenciados por Professor (`@ProfessorOnly`) e visualizados por Aluno (filtro interno).

### `/api/banners`, `/api/secoes`, `/api/redes-sociais`, `/api/disciplinas`
Público (GET) / AdminOnly (POST, PUT, DELETE).

### `/api/relatorio-unis`
Público (GET) / AdminOnly (PUT).

### `/api/uploads`
Upload de arquivos — autenticado via `@Seguranca`.

---

## 3. ⚠️ REGRAS DE OURO (Leia ANTES de mexer)

### 🔴 NUNCA:
1. **Criar dois métodos com mesmo verbo HTTP e mesmo @Path** no mesmo resource — causa `ModelValidationException` no Jersey (erro que derrubou o Railway).
2. **Remover a anotação `@Seguranca`** de um endpoint que deveria ser protegido — expõe dados sensíveis.
3. **Trocar `@AdminOnly` por `@ProfessorOnly`** sem entender o fluxo — Admin é tipo=1, Professor é tipo=2.
4. **Modificar o `AuthenticationFilter.java`** sem testar exaustivamente — ele protege TODOS os endpoints com `@Seguranca`.
5. **Mexer no `TokenService.java`** sem verificar compatibilidade com tokens existentes — usuários logados seriam forçados a refazer login.

### 🟡 CUIDADO AO:
1. **Renomear paths** no backend — verificar se o frontend (`api.jsx`, páginas) usa o mesmo path.
2. **Adicionar query params** em endpoints DELETE — o Jersey pode confundir com outro método DELETE no mesmo path.
3. **Alterar o `ServerConfigurator.java`** — CORS, multipart, e o prefixo `/api/*` são configurados lá.
4. **Modificar entidades JPA** — verificar se o `persistence.xml` está atualizado com todas as entidades.

---

## 4. 🔗 Dependências Críticas

### Backend → Frontend
| Backend | Frontend (exemplos) |
|---------|-------------------|
| `POST /api/usuarios/login` | `LoginPage.jsx`, `AdminLogin.jsx` |
| `GET /api/usuarios/nomes?ids=` | Várias páginas do portal |
| `DELETE /api/usuarios/{id}` | `GerirUsuarios.jsx` (com `?excluirDependencias=true`) |
| `GET /api/usuarios/{id}/dependencias` | `GerirUsuarios.jsx` |
| `PUT /api/usuarios/{id}` | `GerirUsuarios.jsx` (edição) |
| `/api/banners`, `/api/secoes` | `Home.jsx`, `Banner.jsx`, `Section.jsx` |

### Anotações
- `@Seguranca` → ativada pelo `AuthenticationFilter.java`
- `@AdminOnly` → exige `tipo == 1`
- `@ProfessorOnly` → exige `tipo == 1 || tipo == 2`

---

## 5. 🧪 Checklist Antes de Deploy

- [ ] Compilação sem erros (`mvn compile`)
- [ ] Nenhum resource tem dois métodos com mesmo verbo + path
- [ ] Endpoints públicos não têm `@Seguranca` acidental
- [ ] Endpoints protegidos têm `@Seguranca` + `@AdminOnly`/`@ProfessorOnly`
- [ ] CORS configurado para a origem de produção (variável de ambiente)
- [ ] Frontend aponta para a URL correta da API (`VITE_API_URL`)
- [ ] `JWT_SECRET` configurado como variável de ambiente no Railway

---

## 6. 🔐 Ambiente e Variáveis Sensíveis

| Variável | Onde usar | Obrigatória? |
|----------|-----------|-------------|
| `JWT_SECRET` | `TokenService.java` (HS256) | Sim (se não, gera aleatória → tokens invalidam no restart) |
| `SERVER_PORT` | `ServerConfigurator.java` | Não (default 8080) |
| `CORS_ALLOWED_ORIGINS` | `ServerConfigurator.java` | Não (default localhost:5173) |
| `DATABASE_URL` | `persistence.xml` / Railway | Sim |
| `VITE_API_URL` | `api.jsx` (frontend) | Não (default localhost:8080) |
| `DB_USER`, `DB_PASSWORD` | Railway / Neon | Sim |

---

## 7. 📁 Arquivos que NUNCA devem ser alterados sem revisão

| Prioridade | Arquivo | Motivo |
|-----------|---------|--------|
| 🔴 | `AuthenticationFilter.java` | Protege TODA a API |
| 🔴 | `TokenService.java` | Geração/validação de tokens JWT |
| 🔴 | `UsuarioResource.java` | Rotas de usuário (+ exclusão com dependências) |
| 🟡 | `ServerConfigurator.java` | CORS, rotas, uploads |
| 🟡 | `UsuarioService.java` | Lógica de exclusão e inativação |
| 🟡 | `api.jsx` | Interceptador de token no frontend |
| 🟢 | Demais Resources/Services | Seguem padrão REST, menor risco |

---

> 📅 Última atualização: 29/05/2026 — Após correção do conflito de rotas DELETE.
