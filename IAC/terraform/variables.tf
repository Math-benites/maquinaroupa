variable "image_name" {
  description = "Imagem Docker local ou publicada em um registry. Para deploys, prefira uma tag imutável pelo SHA do commit."
  type        = string
  default     = "ghcr.io/math-benites/maquinaroupa:latest"
}

variable "pull_image" {
  description = "Baixa a imagem do registry. Use false para consumir uma imagem que já existe no Docker local."
  type        = bool
  default     = true
}

variable "container_name" {
  description = "Nome do container Docker criado pelo Terraform."
  type        = string
  default     = "maquinaroupa-terraform-app"
}

variable "app_port" {
  description = "Porta local exposta no host."
  type        = number
  default     = 8081
}


variable "vite_supabase_url" {
  description = "URL pública do Supabase injetada quando o container inicia."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^https://[a-z0-9-]+\\.supabase\\.co$", var.vite_supabase_url))
    error_message = "vite_supabase_url deve ser uma URL válida do Supabase."
  }
}

variable "vite_supabase_anon_key" {
  description = "Chave anon/publishable pública do Supabase injetada quando o container inicia. Nunca use service_role."
  type        = string
  sensitive   = true


  validation {
    condition     = !startswith(var.vite_supabase_anon_key, "http") && length(var.vite_supabase_anon_key) > 20
    error_message = "vite_supabase_anon_key deve conter uma chave anon/publishable, não uma URL."
  }
}

variable "app_replicas" {
  description = "Número de réplicas do container Docker."
  type        = number
  default     = 1

  validation {
    condition     = var.app_replicas >= 1
    error_message = "O número de réplicas deve ser maior que zero."
  }
}
