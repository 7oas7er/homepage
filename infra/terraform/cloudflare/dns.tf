locals {
  zone_id = var.zone_id
}

# Homepage owns www + www-stg CNAMEs. Apex redirect stays in platform shared-edge.
# Prod CNAME is optional until aws/envs/prod is applied (stg-first).
resource "cloudflare_dns_record" "homepage" {
  count = var.prod_cloudfront_domain_name == null ? 0 : 1

  zone_id = local.zone_id
  name    = "www.7oas7er.com"
  type    = "CNAME"
  content = var.prod_cloudfront_domain_name
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "homepage_stg" {
  zone_id = local.zone_id
  name    = "www-stg.7oas7er.com"
  type    = "CNAME"
  content = var.stg_cloudfront_domain_name
  proxied = true
  ttl     = 1
}
