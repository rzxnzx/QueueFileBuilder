
# Get Started

QueueBuilderFile es un proyecto realizado en [NestJS](https://nestjs.com/) como Framework y [TypeScript](https://www.typescriptlang.org/) como lenguaje de programación. La idea principal de este proyecto es que pueda ser completamente modular y que no hayan complicaciones al momento de agregar mayores funcionalidades. El proyecto se compone de una base de datos [MySQL]() como motor principal de persistencia de datos y una base de datos no relacional, la cual es [Redis](https://docs.nestjs.com/microservices/redis).

### Initial Setup

Para poder realizar la inicialización del proyecto se requieren diferentes datos que deben ser agregados a nuestras variables de entorno. Para ello primeramente clonaremos nuestro archivo `.env.example` y lo llamaremos `.env`, el cual contiene los siguientes campos:
```
#TOKEN KEYS
JwtSecretKey=
JWT_TOKEN=

#DB MYSQL
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=

#REDIS DB
REDIS_PORT=
REDIS_HOST=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```
Los campos ya vienen comentados para tener un mayor contexto de que se debe colocar en cada caompo, sin embargo, los más importantes para poder proteger la ruta de la petición para generar nuestro archivo excel se encuentra en el campo `JwtSecretKey`, la cual debe ser una Key en la cual se debe basar `JWT` para poder firmar el token y corroborar su validez. Personalmente recomendaria usar un comando como `openssl rand -base64 64` el cual generará una Key de 64 bits la cual podemos usar para que JWT pueda firmar el token y confirmar su veracidad.

Para poder generar el token debemos correr el script `token.js`, para ello utilizamos el comando `node token.js` desde el directorio raíz del proyecto. Con ello nos generará un token el cual debemos entonces colocar en nuestras variables de entorno, especificamente el campo `JWT_TOKEN`. Luego los demás campos simplemente nos piden credenciales, como los credenciales de conexión a nuestras bases de datos [MySQL](https://www.npmjs.com/package/mysql2) y [Redis](https://docs.nestjs.com/microservices/redis) y por último las credenciales del `SMTP` que son las que nos permitirán enviar los archivos generados por correo. Una vez con todos los campos inicializados, podemos entonces proceder a arrancar nuestro proyecto con los siguientes comandos 
```bash
$ npm run start:dev
``` 
En caso de realizar cambios y entorno de desarrollo, este script tiene como particularidad que viene configurado con un `--watch` lo cual permite evitar instalar librerias como `nodemon` para poder visualizar cada cambio en la consola, por ello es una buena practica iniciar el proyecto durante el desarrollo, para poder ir viendo los logs y así evitar errores mayores. Si todo está correcto, procedemos entonces con los comandos

```bash
$ npm run build
```
El cual se utilizará para poder transpilar el código de `TypeScript` a `JavaScript`.

y ya por último para inicializar un entorno de producción.
```bash
$ npm run start:prod
```
Luego simplemente podemos hacer nuestras peticiones, agregando el ya mencionado Token a los header de la petición y las rutas que se muestran en la consola una vez inicializada la aplicación como `[RouterExplorer]`. 

### Structure

El proyecto está estructurado con la siguiente organización de carpetas. Está diseñado de esta forma para poder dar un mayor enfoque modular y que sea escalable a corto o largo plazo.
```
└── 📁QueueBuilderFile
    └── .env.example
    └── docker-compose.yml
    └── nest-cli.json
    └── package.json
    └── README.md
    └── 📁src
        └── app.module.ts
        └── 📁guards
            └── 📁jwt
                └── jwt.guard.ts
        └── main.ts
        └── 📁modules
            └── 📁core
                └── 📁database
                    └── 📁mysql
                        └── database.module.ts
                        └── database.service.ts
                    └── 📁redis
                        └── redis.module.ts
                └── 📁queue
                    └── queue.module.ts
            └── 📁Excel
                └── excel.controller.ts
                └── excel.module.ts
                └── 📁processors
                    └── excel.processor.ts
                └── 📁services
                    └── excel.builder.service.ts
                    └── excel.service.ts
                └── 📁utils
                    └── excel.dto.ts
        └── 📁services
            └── 📁colors
                └── color.service.ts
            └── 📁email
                └── email.service.ts
                └── 📁utils
                    └── email.dto.ts
            └── 📁time
                └── 📁time
                    └── time.service.ts
            └── 📁zip
                └── zip.service.ts
        └── settings.ts
        └── 📁utils
            └── 📁constants
                └── 📁Queues
                    └── excelQueue.constants.ts
    └── token.js
    └── tsconfig.build.json
    └── tsconfig.json
```

La idea principal es que al momento de agregar un modulo adicional sea solo agregarlo con la estructura que lleva el proyecto. Cada módulo tiene su propio servicio interno que se encarga de llevar la lógica, sin embargo, en la carpeta `Services` 
```
    └── 📁services
        └── 📁colors
            └── color.service.ts
        └── 📁email
            └── email.service.ts
            └── 📁utils
                └── email.dto.ts
        └── 📁time
            └── 📁time
                └── time.service.ts
        └── 📁zip
               └── zip.service.ts
```
Hay servicios generales que pueden ser reutilizados en todos los demás módulos que se vayan a realizar como el servicio de `Email` o el servicio de `Zip`, a demás de módulos necesarios, como los que están en la carpeta `Core` la cual contiene los modulos de `Database` y `Queue`. 
```
        └── 📁modules
            └── 📁core
                └── 📁database
                    └── 📁mysql
                        └── database.module.ts
                    └── 📁redis
                        └── redis.module.ts
                └── 📁queue
                    └── queue.module.ts
            └── 📁Excel
                └── excel.module.ts
``` 
La idea es no modificar estos módulos a menos que sea para mejoras sustanciales, ya que se encargan de gran parte del funcionamiento general de la aplicación, principlamente el modulo `Queue` el cual contiene la configuración con [Redis](https://docs.nestjs.com/microservices/redis). En esta primera parte del proyecto hemos implementado el módulo `Excel` el cual se encargará de las siguientes funciones:

- Obtener datos de la base de datos
- Dividir los datos en conjuntos mas pequeños (Este valor es ajustable, revisar el archivo `settings.ts`)
- Escribir los datos en un archivo de Excel y generar hojas de cálculo en base a la cantidad de datos requeridos.
- Comprimir el archivo excel para evitar problemas mayores.
- Enviar por correo al usuario solicitado (Estos datos se obtienen en el campo `payload` de la petición)