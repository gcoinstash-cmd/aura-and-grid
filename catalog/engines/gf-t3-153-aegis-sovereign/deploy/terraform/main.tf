# ==============================================================================
# GF-T3-153: AegisSovereign Engine // Terraform Infrastructure Manifest
# Multi-Region High-Availability Cloud Run, Cloud Armor WAF, and KMS Hardware Secrets
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20"
    }
  }
}

variable "project_id" {
  type        = string
  description = "Target GCP Project ID for AegisSovereign settlement enclaves"
}

variable "regions" {
  type        = list(string)
  default     = ["us-east1", "us-central1", "europe-west1"]
  description = "Multi-region low-latency global settlement nodes"
}

# Cloud KMS Keyring for Hardware Security Module (HSM) TSS Root Keys
resource "google_kms_key_ring" "tss_keyring" {
  name     = "aegis-tss-keyring"
  location = "global"
}

resource "google_kms_crypto_key" "tss_root_key" {
  name            = "aegis-tss-root-key"
  key_ring        = google_kms_key_ring.tss_keyring.id
  rotation_period = "7776000s" # 90 days

  version_template {
    algorithm        = "GOOGLE_SYMMETRIC_ENCRYPTION"
    protection_level = "HSM"
  }
}

# Cloud Run Service for Each Region (High-Availability Cluster)
resource "google_cloud_run_v2_service" "aegis_service" {
  for_each = toset(var.regions)
  name     = "aegis-sovereign-engine-${each.key}"
  location = each.key

  template {
    scaling {
      min_instance_count = 3
      max_instance_count = 100
    }

    containers {
      image = "gcr.io/${var.project_id}/aegis-sovereign-engine:latest"

      resources {
        limits = {
          cpu    = "4000m"
          memory = "8Gi"
        }
        cpu_idle = false
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
      }

      liveness_probe {
        http_get {
          path = "/healthz"
          port = 8080
        }
        period_seconds = 10
      }
    }
  }
}
