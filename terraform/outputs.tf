output "container_id" {
  value = proxmox_virtual_environment_container.herb_pusher.vm_id
}

output "next_steps" {
  value = <<-EOT
    Container created. Next steps:

    1. Find the container IP in the Proxmox web UI or with:
       ssh -i ~/.ssh/octo_scrape_deploy root@<ip> "ip addr show eth0"

    2. Copy provision script to container:
       scp -i ~/.ssh/octo_scrape_deploy scripts/provision.sh root@<ip>:/root/provision.sh

    3. SSH in and run the provision script:
       ssh -i ~/.ssh/octo_scrape_deploy root@<ip> "bash /root/provision.sh"

    4. Visit http://<ip>:3000 to confirm the app is running.

    5. Set up Cloudflare Tunnel to expose the app publicly.
  EOT
}
