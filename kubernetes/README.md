# Ecommerce Fullstack App Deployment (Minikube & Kubernetes)

This guide describes how to deploy the e-commerce application locally inside a **Minikube** cluster. It covers building the Docker images directly into Minikube's Docker daemon, configuring local DNS mapping, injecting environment variables using templates, and deploying the Kubernetes resources.

---

## Prerequisites

Before starting, make sure the following tools and files are available:

- docker & docker compose installed

- minikube & kubectl installed

- Minikube configured to use the Docker driver (`minikube config set driver docker`)

- Ingress addon is enabled (`minikube addons enable ingress`)

- `.env.production.local` files available in both:
  - `backend/`
  - `frontend/`

> The Docker Compose build command reads environment variables from these files using the --env-file flag, while envsubst uses them to generate the Kubernetes manifests.

---

## Deployment Steps

### Step 1: Point Docker CLI to Minikube's Docker Daemon

To avoid pushing images to a remote registry (like Docker Hub), reuse Minikube's internal Docker daemon:

```bash
minikube start
eval $(minikube docker-env)
```

> Note: This only affects your current terminal session.

---

### Step 2: Build the Docker Images

Build the production Docker images using your local environment configuration files. The images will be built directly inside Minikube:

```bash
docker compose -f docker-compose.prod.yml --env-file ./frontend/.env.production.local --env-file ./backend/.env.production.local build
```

You can verify that the images are available inside Minikube by listing them:

```bash
docker images

# Example output:
# IMAGE ID DISK USAGE CONTENT SIZE EXTRA
# shop-backend:prod1 c0cb64e39d3a 238MB 0B
# shop-frontend:prod1 6af276734074 62.8MB 0B
```

---

### Step 3: Configure Local DNS Host Mapping

Get the IP address of your Minikube cluster:

```bash
minikube ip

# Example output:
# 192.168.xxx.xxx
```

Open your local /etc/hosts file with root privileges:

```bash
sudo nano /etc/hosts
```

Add the following entry matching your Minikube IP address so you can access the app via a domain name:

```bash
192.168.xxx.xxxx shop.local
```

---

### Step 4: Inject Environment Variables and Apply Kubernetes Manifests

Load the backend environment variables into your current session:

```bash
export $(xargs < ./backend/.env.production.local)
```

Convert the sensitive environment variables into base64 formats required by Kubernetes secrets:

```bash
export BASE64_MONGO_URI=$(echo -n "$MONGO_URI" | base64 -w 0)
export BASE64_RESEND_API_KEY=$(echo -n "$RESEND_API_KEY" | base64 -w 0)
export BASE64_TURNSTILE_SECRET_KEY=$(echo -n "$TURNSTILE_SECRET_KEY" | base64 -w 0)
export BASE64_CONTACT_RECEIVER_EMAIL=$(echo -n "$CONTACT_RECEIVER_EMAIL" | base64 -w 0)
```

Apply the Kubernetes manifests to your Minikube cluster:

```bash
envsubst < ./kubernetes/backend/secrets.yaml | kubectl apply -f -
envsubst < ./kubernetes/backend/configmap.yaml | kubectl apply -f -
kubectl apply -f ./kubernetes/backend/service.yaml
kubectl apply -f ./kubernetes/backend/deployment.yaml
kubectl apply -f ./kubernetes/frontend/
```

---

## Verification

Check if all your pods are up and running successfully:

```bash
kubectl get pods

# Expected output:
# NAME READY STATUS RESTARTS AGE
# backend-64b96d688f-q5qbt 1/1 Running 0 15s
# frontend-6f477c9568-vdsp2 1/1 Running 0 15s
```

## Accessing the Applications

After successful deployment, the applications are available at: http://shop.local

---

## Cleanup

To cleanly shut down and stop the local environment:

1. Delete all deployed resources from the cluster:

```bash
kubectl delete -f ./kubernetes/frontend/
kubectl delete -f ./kubernetes/backend/
```

2. Stop the Minikube container:

```bash
minikube stop
```

---

## Project Structure (Kubernetes)

```text
kubernetes/
├── README.md
├── backend/
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── secrets.yaml
│   └── service.yaml
└── frontend/
    ├── deployment.yaml
    ├── ingress.yaml
    └── service.yaml
```

### Kubernetes Manifests Overview

| Directory       | File              | Description                                                                             |
| :-------------- | :---------------- | :-------------------------------------------------------------------------------------- |
| **`backend/`**  | `configmap.yaml`  | Non-sensitive application configurations                                                |
|                 | `secrets.yaml`    | Encrypted sensitive data                                                                |
|                 | `service.yaml`    | Internal cluster network endpoint for the API (maps container port 3000)                |
|                 | `deployment.yaml` | Defines backend pod replicas and environment variables injection                        |
| **`frontend/`** | `service.yaml`    | Internal cluster network endpoint for the UI (maps container port 8080)                 |
|                 | `deployment.yaml` | Manages the web UI application pods running the client-side code                        |
|                 | `ingress.yaml`    | Central external entry point that routes public traffic (Minikube IP) into the cluster. |

---

## Notes

This project was created for learning and demonstration purposes.
