terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.76"
    }
  }
}

provider "proxmox" {
  endpoint  = var.proxmox_endpoint
  api_token = var.proxmox_api_token
  insecure  = true
}

resource "proxmox_virtual_environment_download_file" "ubuntu_2404" {
  content_type = "vztmpl"
  datastore_id = "local"
  node_name    = "pm01"
  url          = "http://download.proxmox.com/images/system/ubuntu-24.04-standard_24.04-2_amd64.tar.zst"
  overwrite    = false
}

resource "proxmox_virtual_environment_container" "herb_pusher" {
  description = "The Herb Pusher — Next.js + Payload CMS + PostgreSQL + Meilisearch"
  node_name   = "pm01"
  vm_id       = var.container_id
  tags        = ["herb-pusher", "production"]

  start_on_boot = true
  started       = true
  unprivileged  = true

  features {
    nesting = true
  }

  cpu {
    cores = 2
  }

  memory {
    dedicated = 4096
    swap      = 512
  }

  disk {
    datastore_id = "local-lvm"
    size         = 30
  }

  network_interface {
    name   = "eth0"
    bridge = "vmbr0"
  }

  operating_system {
    template_file_id = proxmox_virtual_environment_download_file.ubuntu_2404.id
    type             = "ubuntu"
  }

  initialization {
    hostname = "herb-pusher"
    dns {
      servers = ["1.1.1.1", "8.8.8.8"]
    }
    user_account {
      keys = [var.ssh_public_key]
    }
  }

  depends_on = [proxmox_virtual_environment_download_file.ubuntu_2404]
}
