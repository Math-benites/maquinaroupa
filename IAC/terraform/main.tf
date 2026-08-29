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

resource "docker_container" "app" {
  count = var.app_replicas
  name  = "${var.container_name}-${count.index + 1}"
  image = var.image_name

  ports {
    internal = 80
    external = var.app_port + count.index
  }

  restart = "unless-stopped"
}
