pet project for managing svg files all inside of web ui. 
persisted changes in mongo db for use with multiple workspaces.

it's messy (first real project)


server/icons/scanner.js parses and serves files in [target directory]

server/icons/monitor.js watches for changes

server/icons/model.js uploads and servers uploaded files for use with editor

cd ./latest; npm run windows

cd ./latest/server; npm start

localhost:2222

[TODO]

-- fix upload function

-- fix add to collection/create collection functions

-- color editor works but setting default colors doesn't

-- create new user flow

-- setup guest flow for demo with default icon set

[SIDENOTE]
if your reading this. I have no idea what i'm doing, i just know it works on my machine... venture futher if you dare.


![collection_settings_menu](https://github.com/user-attachments/assets/1dcc7811-c2f2-46cc-b720-84be1ec93dc9)
