# Plano de segurança SSH e whitelist de IPs

**Objetivo:** Controle de quais IPs podem acessar o servidor (SSH), com opção de ligar/desligar, e correção dos problemas de segurança já identificados.

**IPs que você confirmou como seus (liberar no whitelist):**
- `177.81.72.67`
- `179.217.93.11` (acesso atual)

**Nenhuma alteração foi feita no servidor; este documento é apenas o plano.**

---

## 1. Visão geral do que foi revelado no chat

| Problema | Situação |
|----------|----------|
| Varredura/ataque | Centenas de tentativas "Invalid user" por dia; SSH na mira. |
| Muitos IPs autenticando como root | Dezenas de IPs diferentes com login root bem-sucedido (por chave). |
| Risco de chave vazada | Uma única chave em `authorized_keys` usada de muitos IPs; possível vazamento ou uso em vários sistemas. |
| Root direto + porta 22 aberta | `PermitRootLogin yes`; SSH exposto em `0.0.0.0:22`. |
| Sem proteção por IP | Qualquer IP pode tentar (e quem tem a chave pode entrar). |

---

## 2. Mecanismo “liberar apenas IPs” (ligar/desligar)

### 2.1 O que você pediu

- Poder **habilitar ou não** o acesso apenas para IPs permitidos.
- “Acesso que seja para apenas liberar os IPs” = whitelist: só os IPs na lista acessam; os demais são bloqueados quando o mecanismo está **ligado**.
- Quando **desligado**, volta ao comportamento atual (qualquer IP pode tentar).

### 2.2 Opções técnicas (escolher uma)

**Opção A – Firewall (UFW) com script de ligar/desligar (recomendada)**  
- Lista de IPs permitidos em um arquivo (ex.: `/etc/ssh-allowed-ips.conf`).  
- Script “modo whitelist”:  
  - **Ligar:** regra “allow” só para esses IPs na porta 22; depois “deny” (ou política default deny) para o resto.  
  - **Desligar:** remover essas regras e deixar a porta 22 aberta como hoje (ou seguir política default do UFW).  
- Vantagem: simples, visível (`ufw status`), fácil reverter; não mexe no SSH daemon.

**Opção B – Firewall (iptables) com script**  
- Mesma ideia: conjunto de regras ACCEPT para IPs da lista na porta 22; DROP para o resto quando “ligado”. Script para aplicar/remover regras.  
- Útil se não usar UFW ou quiser controle mais fino.

**Opção C – `sshd_config` com `Match Address`**  
- Bloquear por padrão e permitir só em “Match Address <lista de IPs>”. Para “desligar” seria preciso alterar config e reiniciar sshd (ou ter dois arquivos de config e trocar).  
- Menos flexível para “ligar/desligar” rápido; qualquer erro pode trancar o acesso.

**Recomendação:** Opção A (UFW + script), com arquivo de lista de IPs e dois comandos ou scripts: `whitelist-ssh-on` e `whitelist-ssh-off`.

### 2.3 Conteúdo do “mecanismo”

- **Arquivo de lista de IPs** (ex.: `/etc/ssh-allowed-ips.conf`): um IP por linha; comentários com `#` permitidos.  
  - Inicial: `177.81.72.67`, `179.217.93.11`.
- **Script “ligar whitelist”:**  
  - Garantir que você está no servidor (ou que sua sessão não cai ao aplicar).  
  - Ler a lista; para cada IP: `ufw allow from <IP> to any port 22`.  
  - Depois: `ufw deny 22` (ou usar default deny e permitir só esses IPs).  
  - `ufw reload` (ou `ufw enable` se ainda não estiver ativo).  
  - **Cuidado:** fazer primeiro `allow` dos seus IPs e só depois deny/restrict na 22, para não se trancar.
- **Script “desligar whitelist”:**  
  - Remover as regras específicas da whitelist e a regra de deny na 22 (ou voltar a permitir 22 globalmente, conforme política desejada).  
  - `ufw reload`.
- **Documentação:** comando para adicionar/remover IP da lista (editar arquivo + rodar “ligar” de novo, ou script que já faça isso).

### 2.4 Segurança antes de ligar o whitelist

- Garantir que **179.217.93.11** (e, se quiser, 177.81.72.67) está na lista **antes** de ativar.  
- Manter uma sessão SSH aberta de um IP já permitido enquanto aplica as regras, para reverter em caso de erro.  
- Opcional: cron ou systemd timer que, após X minutos, desliga o whitelist se você não confirmar (evitar lockout permanente); só se fizer sentido para você.

---

## 3. Demais ações de segurança (reveladas no chat)

### 3.1 Rotação da chave SSH de root

- Gerar novo par de chaves (ex.: `ssh-keygen -t ed25519 -C "root-novo"`).  
- Colocar **só** a nova chave pública em `/root/.ssh/authorized_keys`.  
- Remover a chave antiga de todos os lugares (outros servidores, CI, bastion, laptops).  
- Testar login com a nova chave antes de fechar a sessão antiga.  
- **Ordem no plano:** depois de ter whitelist ativo (para reduzir risco durante a troca).

### 3.2 Restringir login root

- Criar usuário administrativo com `sudo` (ex.: `admin` ou seu usuário).  
- Configurar SSH para esse usuário (chave em `~/.ssh/authorized_keys`).  
- Em `sshd_config`: `PermitRootLogin no` (ou `prohibit-password` e sem chave para root).  
- Fazer isso **após** ter whitelist e nova chave, e após validar que o novo usuário entra e faz sudo.

### 3.3 Fail2ban (ou similar)

- Instalar e configurar para o serviço SSH.  
- Ação: banir IP após N tentativas (ex.: “Invalid user” ou “Failed password”).  
- Tempo de ban e janela de tentativas configuráveis.  
- Complementa o whitelist: mesmo com whitelist ligado, protege se você desligar temporariamente ou se houver outro serviço exposto.

### 3.4 Revisão de portas e serviços

- Manter apenas o necessário exposto (ex.: 22 com whitelist; 80/443 conforme aplicação).  
- Revisar `ss -tulpn` (já feito no chat) e regras de firewall para não abrir portas desnecessárias.

### 3.5 Logs e monitoramento

- Manter logs de SSH (journal + auth.log) e, se possível, enviar para um SIEM ou servidor de log.  
- Alertas (opcional): muitos “authenticating user root” de IP novo; ou muitos “Invalid user” por IP.

### 3.6 Auditoria de onde a chave atual está

- Listar todos os sistemas que usam a chave que hoje está em `authorized_keys` (CI, bastion, outros servidores, laptops).  
- Decidir quais continuarão com acesso; para esses, migrar para a nova chave na etapa 3.1.

---

## 4. Ordem sugerida de execução

1. **Preparar o mecanismo de whitelist (sem ligar)**  
   - Criar `/etc/ssh-allowed-ips.conf` com `177.81.72.67` e `179.217.93.11`.  
   - Escrever scripts “whitelist-ssh-on” e “whitelist-ssh-off” (e, se quiser, “adicionar-ip” / “remover-ip”).  
   - Documentar como ligar/desligar e como recuperar acesso (console do provedor, se houver).

2. **Testar em janela de baixo risco**  
   - Com sessão ativa a partir de 179.217.93.11 (ou 177.81.72.67): ligar o whitelist.  
   - Confirmar que você continua entrando e que outros IPs são bloqueados.  
   - Deixar whitelist ligado daqui em diante (a não ser que precise desligar por motivo operacional).

3. **Rotação da chave SSH de root**  
   - Gerar nova chave; atualizar `authorized_keys`; revogar a antiga em todos os lugares.  
   - Validar login com a nova chave.

4. **Fail2ban**  
   - Instalar e configurar para SSH; ajustar bantime/maxretry.

5. **Criar usuário admin e desabilitar root via SSH**  
   - Criar usuário com sudo; configurar chave; testar; depois `PermitRootLogin no`.

6. **Revisão de firewall e portas**  
   - Garantir que só o necessário está acessível; alinhar com whitelist (ex.: 22 só para IPs da lista).

7. **Auditoria e monitoramento**  
   - Listar onde a chave (nova) está; definir política de logs/alertas.

---

## 5. Checklist rápido

- [ ] Arquivo de lista de IPs criado (`177.81.72.67`, `179.217.93.11`).  
- [ ] Script “ligar whitelist” (firewall) escrito e testado em dry-run ou em ambiente de teste.  
- [ ] Script “desligar whitelist” escrito.  
- [ ] Procedimento de recuperação (console do provedor) anotado.  
- [ ] Whitelist ligada com sucesso; acesso validado a partir dos seus IPs.  
- [ ] Nova chave SSH gerada; `authorized_keys` atualizado; chave antiga revogada.  
- [ ] Fail2ban instalado e ativo para SSH.  
- [ ] Usuário admin com sudo criado; root via SSH desabilitado.  
- [ ] Portas e firewall revisados.  
- [ ] Onde a chave (nova) está documentado; alertas/logs definidos (se aplicável).

---

## 6. Resumo

- **Mecanismo de “apenas liberar IPs”:** whitelist no firewall (UFW recomendado) com dois scripts (ligar/desligar) e um arquivo de lista; seus IPs iniciais: 177.81.72.67 e 179.217.93.11.  
- **Nada foi alterado no servidor;** este plano incorpora tudo o que foi revelado no chat (ataque, muitos IPs autenticando como root, risco de chave, root direto, falta de restrição por IP) e a ordem em que fazer cada passo para não se trancar e corrigir os riscos de forma segura.

Quando quiser implementar, pode seguir este plano passo a passo; se quiser, posso detalhar os comandos exatos dos scripts (ainda sem alterar nada no servidor).
