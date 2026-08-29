terraform {
  required_version = ">= 1.6.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.6"
    }
  }
}

provider "docker" {}

resource "docker_image" "app" {
  count        = var.pull_image ? 1 : 0
  name         = var.image_name
  keep_locally = true
}

data "docker_image" "app" {
  count = var.pull_image ? 0 : 1
  name  = var.image_name
}

locals {
  app_image_id = var.pull_image ? docker_image.app[0].image_id : data.docker_image.app[0].id
}

resource "docker_container" "app" {
  count = var.app_replicas
  name  = "${var.container_name}-${count.index + 1}"
  image = local.app_image_id

  env = [
    "VITE_SUPABASE_URL=${var.vite_supabase_url}",
    "VITE_SUPABASE_ANON_KEY=${var.vite_supabase_anon_key}",
  ]

  ports {
    internal = 8080
    external = var.app_port + count.index
  }

  restart = "unless-stopped"
}

