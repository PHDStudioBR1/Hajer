# Restaurar portas 80 e 443 (sites 546digitalservices.com)

## O que aconteceu

1. Foi escalado para 0 o Traefik em `kube-system` e removidos os DaemonSets **svclb-traefik**.
2. Com isso, **ninguém ficou escutando nas portas 80 e 443** do servidor, e os sites pararam de responder.

## O que já foi feito (rollback)

- Traefik em **kube-system** foi escalado de volta para **1 réplica** (rollback).
- Foi criado o DaemonSet **svclb-traefik-restore** em `kube-system` para voltar a escutar em 80/443 e encaminhar para o Service do Traefik.

## Se os sites continuarem fora

**Confirme em qual servidor está o cluster que atende os domínios:**

- Os domínios `*.546digitalservices.com` costumam apontar para **173.249.40.118**.
- O trabalho de rollback e o arquivo `svclb-traefik-restore.yaml` podem ter sido aplicados em outro cluster (por exemplo em **15.228.225.121**).

**Se o cluster que serve os sites estiver em 173.249.40.118**, faça **nesse servidor** (com `kubeconfig` apontando para esse cluster):

```bash
# 1. Ajustar o IP no YAML (ClusterIP do Service traefik nesse cluster)
TRAEFIK_IP=$(kubectl get svc traefik -n kube-system -o jsonpath='{.spec.clusterIP}')
echo "Traefik ClusterIP: $TRAEFIK_IP"
# Se for diferente de 10.43.160.14, edite svclb-traefik-restore.yaml e troque DEST_IPS

# 2. Aplicar o DaemonSet de restauro
kubectl apply -f /root/Hajer/infra/k8s/scripts/svclb-traefik-restore.yaml

# 3. Conferir
kubectl get pods -n kube-system -l app=svclb-traefik-restore
# Deve ficar Running. Depois teste: curl -I http://localhost
```

**Firewall:** libere 80 e 443 no servidor que recebe o tráfego (173.249.40.118 ou o que for):

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### Regra iptables obsoleta (tráfego indo para pod inexistente)

Se o pod **svclb-traefik-restore** está Running mas os sites continuam indisponíveis, pode haver uma **regra iptables antiga** encaminhando 80/443 para um pod que já não existe (IP antigo). O tráfego precisa ir para o pod do restore.

**Diagnóstico:**

```bash
# Ver regras que encaminham 80/443
sudo iptables -t nat -L CNI-HOSTPORT-DNAT -n -v --line-numbers
```

Se existir mais de uma regra para 80,443 e a **primeira** apontar para um IP de pod que não existe mais (ex.: `kubectl get pods -A -o wide` não mostra esse IP), remova essa regra:

```bash
# Remover a primeira regra (ajuste o número 1 se for outra posição)
sudo iptables -t nat -D CNI-HOSTPORT-DNAT 1
```

Depois teste: `curl -I http://127.0.0.1` deve retornar resposta do Traefik (ex.: 404 ou redirect). **Nota:** essa alteração em iptables não persiste após reboot; se o problema voltar, repita o comando ou investigue o que recria a regra obsoleta.

## Arquivos usados

- **Rollback (Traefik kube-system):** `scripts/rollback-kube-system-traefik.sh`
- **Restauro 80/443 (DaemonSet tipo svclb):** `scripts/svclb-traefik-restore.yaml`
