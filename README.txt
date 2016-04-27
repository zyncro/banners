#Banner v1.1.0 - 12/12/2015

----------------------
SQL
----------------------

El script se encuentra en:

```
 src/
  |- banners/
     |- Install/
       |- consum.sql
```

Este script crea la tabla intermedia para guardar la información los banners por organización.

Se deberá crear la base de datos 'banners' y modificar los datos de conexión en el archivo:

```
 src/
  |- banners/
     |- Config/
        |- config.yml
```
Ej:
  database:
    driver: pdo_mysql
    host: docker-sql
    user: root
    password: ******
    dbname: banners