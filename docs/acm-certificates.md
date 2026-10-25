# ACM certificates (CloudFront)

CloudFront custom domains need an ACM certificate in **`us-east-1`** (not `eu-north-1`).

## Hostnames

| Env | Domain | Tag suggestion |
|-----|--------|----------------|
| stg | `www-stg.7oas7er.com` | `Project=homepage`, `Environment=stg` |
| prod | `www.7oas7er.com` | `Project=homepage`, `Environment=prod` |

## Create + DNS validate

```bash
export AWS_PROFILE=7oas7er

aws acm request-certificate \
  --region us-east-1 \
  --domain-name www-stg.7oas7er.com \
  --validation-method DNS \
  --tags Key=Project,Value=homepage Key=Environment,Value=stg \
  --query CertificateArn --output text

# Print the CNAME ACM needs (add this in Cloudflare DNS for zone 7oas7er.com):
aws acm describe-certificate --region us-east-1 --certificate-arn "$CERT_ARN" \
  --query 'Certificate.DomainValidationOptions[0].ResourceRecord' --output table
```

In Cloudflare → DNS → Add record:

- Type: **CNAME**
- Name: the `_….www-stg` (or `_….www`) validation host (Cloudflare may show it without the zone suffix)
- Target: the `acm-validations.aws` value (proxy **DNS only** / grey cloud)
- TTL: Auto

Wait until status is `ISSUED`, then set `site_certificate_arn` in `infra/terraform/aws/envs/stg/terraform.tfvars`.

Repeat for `www.7oas7er.com` before prod apply.
