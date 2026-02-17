# Traefik no servidor (portas 80 e 443)

Para o site **hajir.drahaabdalla.com** responder neste servidor, o Traefik precisa estar escutando nas portas **80** e **443** do nó.

## Opção A: Cluster sem Traefik – instalar via Helm

Use esta opção se no servidor **não** houver Traefik (ou não houver nada em 80/443).

### 1. Pré-requisitos

- `kubectl` configurado para o cluster
- `helm` 3.x instalado

### 2. Instalar o chart oficial do Traefik

```bash
# No servidor (ex.: 15.228.225.121), a partir da raiz do repositório Hajer
cd /root/Hajer

helm repo add traefik https://traefik.github.io/charts
helm repo update

kubectl create namespace traefik --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install traefik traefik/traefik \
  -n traefik \
  -f infra/k8s/traefik-system/values-hostport.yaml
```

O arquivo `values-hostport.yaml` configura:

- **hostNetwork: true** e **hostPort: 80 / 443** para o tráfego chegar nas portas 80 e 443 do nó
- **certificatesResolvers.le** (Let's Encrypt) para TLS em `hajir.drahaabdalla.com`
- **allowCrossNamespace: true** para as IngressRoutes em `phdstudio` usarem middlewares em `phdstudio`

### 3. Ajustar o e-mail do Let's Encrypt

Edite `infra/k8s/traefik-system/values-hostport.yaml` e altere o `email` em `certificatesResolvers.le.acme.email` para um e-mail válido do domínio (ex.: `admin@drahaabdalla.com`). Depois:

```bash
helm upgrade traefik traefik/traefik -n traefik -f infra/k8s/traefik-system/values-hostport.yaml
```

### 4. Namespace e middlewares do Hajer

```bash
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/middlewares/ -n phdstudio
kubectl apply -f infra/k8s/frontend-deployment.yaml -n phdstudio
kubectl apply -f infra/k8s/ingress-route-frontend.yaml -n phdstudio
```

### 5. Conferir

- No servidor: `curl -v http://localhost` e `curl -v http://$(hostname -I | awk '{print $1}')` devem responder (pode ser 404 ou o site).
- No navegador: `https://hajir.drahaabdalla.com` (DNS apontando para o IP deste servidor).

---

## Rollback (reverter alterações)

Foi feito no servidor:

1. **Estado salvo:** `infra/k8s/scripts/.traefik-kube-system-state` (replicas do Traefik em kube-system).
2. **Backup YAML:** `infra/k8s/scripts/.svclb-traefik-daemonsets-backup.yaml` (DaemonSets svclb-traefik).
3. **Alterações:** Traefik em kube-system foi escalado para 0; os DaemonSets `svclb-traefik-*` foram removidos para liberar as portas 80 e 443.

Para reverter e voltar a usar o Traefik do K3s em 80/443:

```bash
./infra/k8s/scripts/rollback-kube-system-traefik.sh
```

Isso restaura `deployment/traefik` em `kube-system` para 1 réplica. O K3s pode recriar os DaemonSets svclb se o Service for LoadBalancer. Depois, se quiser remover o Traefik do namespace `traefik`: `helm uninstall traefik -n traefik`.

---

## Opção B: K3s com Traefik já instalado

Em clusters **K3s**, o Traefik costuma vir no namespace `kube-system`. Se o serviço for do tipo LoadBalancer, o K3s (servicelb) pode atribuir o IP do nó; nesse caso, confira se as portas 80 e 443 estão liberadas no firewall do servidor e no security group da VPS.

Se mesmo assim nada responder em 80/443, você pode:

1. **Desabilitar o Traefik padrão do K3s** e instalar o Traefik via Helm (Opção A), ou  
2. **Configurar o Traefik do K3s** para usar hostPort 80/443 (ex.: editando o HelmChart do Rancher ou o Deployment do Traefik em `kube-system`).

---

## Firewall

Libere as portas 80 e 443 no servidor, por exemplo:

- **firewalld:** `sudo firewall-cmd --permanent --add-service=http --add-service=https && sudo firewall-cmd --reload`
- **ufw:** `sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw reload`
- **Security group (AWS/cloud):** regras de entrada para TCP 80 e 443 a partir de 0.0.0.0/0 (ou conforme sua política).
