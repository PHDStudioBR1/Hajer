#!/usr/bin/env bash
# Restaura o Traefik do K3s em kube-system ao estado anterior (replicas=1 e svclb).
# Uso: ./infra/k8s/scripts/rollback-kube-system-traefik.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_FILE="$SCRIPT_DIR/.traefik-kube-system-state"
BACKUP_YAML="$SCRIPT_DIR/.svclb-traefik-daemonsets-backup.yaml"

echo "=== Restaurando Traefik em kube-system ==="
if [[ -f "$STATE_FILE" ]]; then
  source "$STATE_FILE"
  kubectl scale deployment traefik -n kube-system --replicas="${TRAEFIK_KUBE_SYSTEM_REPLICAS:-1}"
  echo "Deployment traefik kube-system: replicas=${TRAEFIK_KUBE_SYSTEM_REPLICAS:-1}"
else
  kubectl scale deployment traefik -n kube-system --replicas=1
  echo "Deployment traefik kube-system: replicas=1 (estado padrão)"
fi

# O K3s recria os DaemonSets svclb quando o Service traefik é LoadBalancer; não é necessário reaplicar o YAML.
echo "Os DaemonSets svclb-traefik serão recriados pelo K3s se o Service for LoadBalancer."
echo ""
echo "Opcional: remover o Traefik do Hajer (namespace traefik):"
echo "  helm uninstall traefik -n traefik"
