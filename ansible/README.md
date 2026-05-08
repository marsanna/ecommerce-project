# Ecommerce Fullstack App Deployment (Vagrant & Ansible)

This project provides automated deployment for a fullstack e-commerce application (Node.js & React) on two different Linux distributions — Ubuntu 22.04 and AlmaLinux 9 — using Vagrant and Ansible.

---

## Architecture Overview

| Component        | Ubuntu Server (Debian-based) | AlmaLinux Server (RedHat-based) |
| ---------------- | ---------------------------- | ------------------------------- |
| Vagrant Hostname | `ubuntu-node`                | `almalinux-node`                |
| SSH Port (Host)  | `2222`                       | `2224`                          |
| Frontend Port    | `8081`                       | `8082`                          |
| Webserver        | `Nginx (www-data)`           | `Nginx (nginx)`                 |
| OS Specifics     | APT Package Manager          | DNF + SELinux Policies          |

---

## Prerequisites

Before starting, make sure the following tools and files are available:

- Vagrant installed
- VirtualBox installed
- Ansible installed on the host system
- `.env.production.local` files available in both:
  - `backend/`
  - `frontend/`

> The playbook reads environment variables from these files using Ansible `lookup`.

---

## Quickstart

### 1. Start the Infrastructure

Navigate to the project root directory (where the `Vagrantfile` is located) and start the virtual machines:

```bash
vagrant up
```

---

### 2. Verify Connectivity

Before running the playbook, ensure Ansible can reach both VMs:

```bash
ansible all -m ping -i ansible/inventory.yml
```

---

### 3. Run Syntax Check

Validate the Ansible playbook for syntax errors:

```bash
ansible-playbook -i ansible/inventory.yml ansible/ecommerce-playbook.yml --syntax-check
```

---

## Deployment Commands

You can deploy the application to both servers simultaneously or target a specific node.

### Full Deployment

```bash
ansible-playbook -i ansible/inventory.yml ansible/ecommerce-playbook.yml
```

---

### Step-by-Step Deployment (Debugging Mode)

This mode is especially useful during development and debugging.

#### Deploy to Ubuntu Only

```bash
ansible-playbook -i ansible/inventory.yml ansible/ecommerce-playbook.yml --limit ubuntu_server --step
```

#### Deploy to AlmaLinux Only

```bash
ansible-playbook -i ansible/inventory.yml ansible/ecommerce-playbook.yml --limit almalinux_server --step
```

---

## Project Structure (Ansible)

```text
ansible/
├── ansible.cfg
├── inventory.yml
├── ecommerce-playbook.yml
└── roles/
    └── group_vars/
        ├── all.yml
    └── ecommerce/
        ├── handlers/
            ├── main.yml
        ├── tasks/
        │   ├── main.yml
        │   ├── backend_tasks.yml
        │   └── frontend_tasks.yml
        ├── templates/
        │   ├── nginx.conf.j2
        │   └── backend.service.j2
        └── vars/
            ├── Debian.yml
            └── RedHat.yml
```

### Description

#### `inventory.yml`

Defines VM connection details (`127.0.0.1` with forwarded SSH ports).

#### `roles/ecommerce/tasks/main.yml`

Main workflow that loads OS-specific variables.

#### `vars/Debian.yml` & `vars/RedHat.yml`

Distribution-specific paths and package names.

#### `templates/`

Contains:

- `nginx.conf.j2`
- `backend.service.j2`

#### `tasks/backend_tasks.yml` & `tasks/frontend_tasks.yml`

Modular task files for backend and frontend deployment.

---

### File Synchronization

The playbook uses the Ansible `synchronize` module (`rsync`).

Make sure `rsync` is installed on your host system.

---

## Accessing the Applications

After successful deployment, the applications are available at:

| Environment       | URL                   |
| ----------------- | --------------------- |
| Ubuntu Version    | http://localhost:8081 |
| AlmaLinux Version | http://localhost:8082 |

---

## Technologies Used

- Vagrant
- VirtualBox
- Ansible
- Nginx
- Systemd
- Ubuntu 22.04
- AlmaLinux 9

---

## Notes

This project was created for learning and demonstration purposes.
