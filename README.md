# SkillSyncAI
An AI-Driven Labor Market Intelligence and Curriculum Alignment System

# Installation Guide
install the latest node.js on
```bash

https://nodejs.org/en/download


```

after installing set up your Heidisql for the schema of the database.

```bash

https://www.heidisql.com/download.php

&&

https://dev.mysql.com/downloads/mysql/

```

after the installation set up heidi first then set the database name in .env file.

### Frontend
check the node and npm first in the terminal. 
use the ctrl + ` <- telda
```bash
node -v
npm -v
```

if npm doesn't show up,
Open powershell and run this following command.
``` bash

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

```

after running it should show you to type 'y' to agree.

### Continue..
after everything is done, go to Fronend and run this command

```bash

npm install

```

that should install all the independencies we put on the frontend.

next would be running the command

```bash

npm run dev


```

that should be the frontend side.

# BACKEND
before we begin the running phase, please check in the heidi app if you can enter inside.

after you enter the credentials, you should able to see the actual schema like on the left side.

set the database name into skillsyncaiv2,
then go back to the vs code.

# SETTING UP THE MIGRATION AND SEEDER
run this following command for the migration but first change the directory to source or src

```bash
cd Backend
cd src
```

Then, 

```bash
npx sequelize-cli db:migrate
```

after that run this seeder command

```bash
npx sequelize-cli db:seed:all
```
