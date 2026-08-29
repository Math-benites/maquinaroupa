output "app_url" {
  description = "URL local do app provisionado pelo Terraform."
  value       = "http://localhost:${var.app_port}"
}

output "container_name" {
  description = "Nome do container criado."
  value       = docker_container.app[0].name
}
