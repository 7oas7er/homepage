resource "grafana_folder" "homepage" {
  provider = grafana.stack

  title = "Homepage"
}

locals {
  homepage_dashboard_files = {
    prod = "${path.module}/dashboards/homepage-prod.json"
    stg  = "${path.module}/dashboards/homepage-stg.json"
  }

  homepage_dashboards = {
    for env, path in local.homepage_dashboard_files :
    env => merge(jsondecode(file(path)), { id = null })
  }

  # Inject CF zoneTag + GitHub owner/repo into dashboard textbox variables.
  homepage_dashboards_with_zone = {
    for env, dash in local.homepage_dashboards :
    env => merge(
      dash,
      {
        templating = {
          list = [
            for v in dash.templating.list : (
              v.name == "cf_zone" && var.cloudflare_zone_tag != null ? merge(v, {
                query   = var.cloudflare_zone_tag
                current = { text = var.cloudflare_zone_tag, value = var.cloudflare_zone_tag }
                }) : v.name == "gh_owner" ? merge(v, {
                query   = var.github_owner
                current = { text = var.github_owner, value = var.github_owner }
                }) : v.name == "gh_repo" ? merge(v, {
                query   = var.github_repository
                current = { text = var.github_repository, value = var.github_repository }
              }) : v
            )
          ]
        }
      },
    )
  }
}

resource "grafana_dashboard" "homepage_env" {
  for_each = local.homepage_dashboards_with_zone

  provider = grafana.stack

  folder      = grafana_folder.homepage.uid
  config_json = jsonencode(each.value)
  overwrite   = true
}
