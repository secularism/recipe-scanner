# HTTPS Domain Readiness

**Domain:** `978978978.xyz`
**API prefix:** `/api`
**Created:** 2026-07-01

## Current Smoke Test Result

As of 2026-07-01, the existing backend API is reachable over HTTP but not yet over HTTPS.

Passing HTTP checks:

```bash
curl -i http://978978978.xyz/api/health
curl -i http://978978978.xyz/api/recipes
curl -i http://978978978.xyz/api/recipes/mapo-tofu
curl -i "http://978978978.xyz/api/recipes?include=matchFields"
```

Observed results:

| URL | Result |
|---|---|
| `http://978978978.xyz/api/health` | 200, `{"status":"ok","service":"recipe-scanner-api"}` |
| `http://978978978.xyz/api/recipes` | 200, 20 lightweight recipes |
| `http://978978978.xyz/api/recipes?include=matchFields` | 200, 26 match-ready recipes |
| `http://978978978.xyz/api/recipes/mapo-tofu` | 200, title `麻婆豆腐` |

Failing HTTPS checks:

```bash
curl -i https://978978978.xyz/api/health
curl -i https://47.96.36.31/api/health
```

Observed failure:

- TCP 443 is reachable.
- TLS/HTTPS does not complete successfully.
- Windows curl reported `schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS`.
- PowerShell `Invoke-WebRequest` reported that the underlying connection was closed during receive.

This points to HTTPS server configuration, certificate, SNI, or reverse proxy setup rather than the NestJS route handlers.

SSH access check from the local Codex environment:

```bash
ssh -o BatchMode=yes root@47.96.36.31 "hostname"
```

Current result: no non-interactive SSH access is available (`Permission denied (publickey,password)`). Server-side Nginx or certificate changes therefore require a user-provided SSH session, deployment channel, or manual execution on the server.

## Release Gate

Do not change `apps/miniapp/src/config/api.ts` to `https://978978978.xyz/api` until all HTTPS smoke checks pass.

Required passing checks:

```bash
curl -i https://978978978.xyz/api/health
curl -i https://978978978.xyz/api/recipes
curl -i https://978978978.xyz/api/recipes/mapo-tofu
curl -i "https://978978978.xyz/api/recipes?include=matchFields"
```

Expected:

- All four return HTTP 200.
- `health` response contains `recipe-scanner-api`.
- recipes list and detail response shapes match the current HTTP API.
- No fallback to `http://47.96.36.31/api` is used to mask HTTPS failures.

Only after this gate passes:

1. Update `apps/miniapp/src/config/api.ts` to `https://978978978.xyz/api`.
2. Update `apps/miniapp/tests/recipes-api.test.ts` expected default URL.
3. Add `https://978978978.xyz` to the WeChat Mini Program request legal domain list.
4. Run the miniapp verification gate before committing.

## Server-Side Checklist

1. Confirm public DNS resolves to the intended server or CDN/reverse-proxy entry.
2. Install a valid certificate for `978978978.xyz`.
3. Configure Nginx 443 server block with `server_name 978978978.xyz`.
4. Proxy `/api` to the NestJS service, currently expected on `127.0.0.1:3000`.
5. Reload Nginx and confirm there are no config errors.
6. Run HTTPS smoke checks from a machine outside the server.

Example Nginx shape:

```nginx
server {
    listen 80;
    server_name 978978978.xyz;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name 978978978.xyz;

    ssl_certificate /etc/letsencrypt/live/978978978.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/978978978.xyz/privkey.pem;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

If HTTP should redirect to HTTPS, add the redirect only after certificate issuance and HTTPS smoke tests pass:

```nginx
return 301 https://$host$request_uri;
```

## Notes for v1.2

HTTPS readiness is Phase 12 because WeChat Mini Program production requests require HTTPS and a legal request domain. Auth and sync work can continue locally with injectable clients and fake request tests, but production miniapp configuration should not move to the domain until this document's release gate passes.
