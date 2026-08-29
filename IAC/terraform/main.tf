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
  name         = var.image_name
  keep_locally = true
}

resource "docker_container" "app" {
  count = var.app_replicas
  name  = "${var.container_name}-${count.index + 1}"
  image = docker_image.app.image_id

  ports {
    internal = 8080
    external = var.app_port + count.index
  }

  restart = "unless-stopped"
}
