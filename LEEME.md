# CLUB FITNESS · despliegue

La carpeta `publico/` es **lo que se sirve** en `club.auras.pe`.
No se sube nada a mano: se hace un commit aquí y el servidor lo publica solo.

## Cómo funciona

1. Se hace commit y push a este repositorio.
2. GitHub avisa al servidor (webhook).
3. SPanel trae el cambio y ejecuta `.autodeploy`, que:
   - guarda una copia de la versión que estaba puesta en `respaldo_club/<fecha>`
     (se conservan las últimas 20),
   - copia `publico/` a la carpeta del sitio,
   - comprueba que el número de versión de la app y el de la caché del
     service worker coincidan, y falla si no.

## Reglas

- El número de versión (`CF_VERSION` en `index.html`) y el de la caché
  (`CACHE` en `sw.js`) tienen que ser **el mismo** y **mayor** que el publicado:
  es lo que hace que la app avise «Versión nueva» en el teléfono del socio.
- En `publico/` no va ni un dato del club: el padrón vive en el servidor y la
  app lo pide al entrar.

## Volver atrás

Las versiones anteriores quedan en `/home/auraspe/respaldo_club/`. Para
deshacer, `git revert` del commit y push: el servidor republica solo.
