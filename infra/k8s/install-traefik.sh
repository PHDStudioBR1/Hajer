#!/usr/bin/env bash
# Instala Traefik no cluster com portas 80 e 443 no host (single node).
# Uso: ./infra/k8s/install-traefik.sh
# Execute no servidor onde está o Kubernetes (ex.: 15.228.225.121).

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

echo "=== Verificando Helm ==="
if ! command -v helm &>/dev/null; then
  echo "Helm não encontrado. Instale: https://helm.sh/docs/intro/install/"
  exit 1
fi

echo "=== Repositório Traefik ==="
helm repo add traefik https://traefik.github.io/charts 2>/dev/null || true
helm repo update

echo "=== Criando namespace traefik ==="
kubectl create namespace traefik --dry-run=client -o yaml | kubectl apply -f -

echo "=== Instalando/atualizando Traefik (hostPort 80/443) ==="
helm upgrade --install traefik traefik/traefik \
  -n traefik \
  -f infra/k8s/traefik-system/values-hostport.yaml

echo "=== Criando namespace phdstudio e middlewares ==="
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/middlewares/ -n phdstudio

echo "=== Aplicando Deployment e Ingress do Hajer ==="
kubectl apply -f infra/k8s/frontend-deployment.yaml -n phdstudio
kubectl apply -f infra/k8s/ingress-route-frontend.yaml -n phdstudio

echo ""
echo "Pronto. Aguarde o Traefik subir e libere as portas 80/443 no firewall."
echo "Teste: curl -v http://localhost  e  https://hajir.drahaabdalla.com"
