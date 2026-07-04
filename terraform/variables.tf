variable "proxmox_endpoint" {
  type    = string
  default = "https://192.168.4.223:8006"
}

variable "proxmox_api_token" {
  type      = string
  sensitive = true
}

variable "container_id" {
  type    = number
  default = 201
}

variable "ssh_public_key" {
  type      = string
  sensitive = true
}
