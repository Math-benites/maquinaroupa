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
  description = "URL do projeto Supabase usada no build do Vite. Se null, le VITE_SUPABASE_URL do .env."
  type        = string
  default     = null
  sensitive   = true
}

variable "vite_supabase_anon_key" {
  description = "Anon key publica do Supabase usada no build do Vite. Se null, le VITE_SUPABASE_ANON_KEY do .env."
  type        = string
  default     = null
  sensitive   = true
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
