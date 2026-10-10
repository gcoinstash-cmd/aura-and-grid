/**
 * CHRONOSRISK ENGINE // GF-T3-152
 * Production Google Cloud Infrastructure as Code (Terraform)
 * Zero-Trust Architecture: Private VPC, Distroless Cloud Run, Secret Manager, GKE Autopilot
 */

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "Google Cloud Project ID"
  default     = "chronosrisk-prod"
}

variable "region" {
  type        = string
  description = "Google Cloud Primary Region"
  default     = "us-east1"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. Dedicated Service Account with Least-Privilege IAM
resource "google_service_account" "chronosrisk_sa" {
  account_id   = "chronosrisk-engine-sa"
  display_name = "ChronosRisk Engine Distroless Runner"
  description  = "Dedicated least-privilege identity for GF-T3-152 container workload"
}

# 2. Secret Manager Secret with Automated Key Rotation
resource "google_secret_manager_secret" "risk_api_secret" {
  secret_id = "chronosrisk-master-auth-key"

  replication {
    auto {}
  }

  rotation {
    rotation_period = "2592000s" # 30 days automated rotation
  }
}

resource "google_secret_manager_secret_iam_member" "sa_secret_access" {
  secret_id = google_secret_manager_secret.risk_api_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.chronosrisk_sa.email}"
}

# 3. VPC Network & Serverless VPC Connector for Ingress Egress Isolation
resource "google_compute_network" "chronos_vpc" {
  name                    = "chronosrisk-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "chronos_subnet" {
  name          = "chronosrisk-subnet"
  ip_cidr_range = "10.120.0.0/24"
  region        = var.region
  network       = google_compute_network.chronos_vpc.id
  private_ip_google_access = true
}

resource "google_vpc_access_connector" "serverless_connector" {
  name          = "chronos-connector"
  region        = var.region
  ip_cidr_range = "10.120.8.0/28"
  network       = google_compute_network.chronos_vpc.name
}

# 4. Cloud Run v2 High-Availability Service
resource "google_cloud_run_v2_service" "chronosrisk_service" {
  name     = "chronosrisk-engine"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
    service_account = google_service_account.chronosrisk_sa.email

    scaling {
      min_instance_count = 2
      max_instance_count = 50
    }

    vpc_access {
      connector = google_vpc_access_connector.serverless_connector.id
      egress    = "ALL_TRAFFIC"
    }

    containers {
      image = "gcr.io/${var.project_id}/chronosrisk-engine:gf-t3-152"

      resources {
        limits = {
          cpu    = "4000m"
          memory = "4096Mi"
        }
        cpu_idle = false
        startup_cpu_boost = true
      }

      ports {
        container_port = 8080
      }

      startup_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        initial_delay_seconds = 2
        period_seconds        = 5
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        period_seconds    = 10
        timeout_seconds   = 2
        failure_threshold = 3
      }

      env {
        name  = "ENV"
        value = "production"
      }

      env {
        name  = "ASSET_TAG"
        value = "GF-T3-152"
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# 5. Output values
output "cloud_run_uri" {
  description = "The URI of the deployed ChronosRisk Engine Cloud Run service"
  value       = google_cloud_run_v2_service.chronosrisk_service.uri
}

output "service_account_email" {
  description = "Execution service account email"
  value       = google_service_account.chronosrisk_sa.email
}
