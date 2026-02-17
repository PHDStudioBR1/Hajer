#!/usr/bin/env bash
# Aplica hostNetwork e remove hostPort do deployment do Traefik (namespace traefik).
# Rode após cada "helm upgrade" do Traefik, pois o chart pode repor hostPort.
# Uso: ./infra/k8s/scripts/patch-traefik-hostnetwork.sh

set -e
NAMESPACE="${1:-traefik}"
DEPLOY="${2:-traefik}"

echo "=== Patch deployment $DEPLOY -n $NAMESPACE: hostNetwork=true, remover hostPort ==="

# 1) hostNetwork + dnsPolicy
kubectl patch deployment "$DEPLOY" -n "$NAMESPACE" --type=merge -p '{"spec":{"template":{"spec":{"hostNetwork":true,"dnsPolicy":"ClusterFirstWithHostNet"}}}}'

# 2) Remover hostPort das portas (JSON patch)
kubectl patch deployment "$DEPLOY" -n "$NAMESPACE" --type='json' -p='[
  {"op":"replace","path":"/spec/template/spec/containers/0/ports/0","value":{"containerPort":9100,"name":"metrics","protocol":"TCP"}},
  {"op":"replace","path":"/spec/template/spec/containers/0/ports/1","value":{"containerPort":8080,"name":"traefik","protocol":"TCP"}},
  {"op":"replace","path":"/spec/template/spec/containers/0/ports/2","value":{"containerPort":80,"name":"web","protocol":"TCP"}},
  {"op":"replace","path":"/spec/template/spec/containers/0/ports/3","value":{"containerPort":443,"name":"websecure","protocol":"TCP"}}
]'

echo "Aguardando rollout..."
kubectl rollout status "deployment/$DEPLOY" -n "$NAMESPACE" --timeout=120s || true
echo "Conferir: kubectl get pods -n $NAMESPACE && ss -tulpn | grep -E ':80|:443'"
