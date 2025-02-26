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

![home](https://github.com/user-attachments/assets/e1fd9e9c-f8e7-4e7f-8db2-e3c55c8c6f07)

![upload_dashboard](https://github.com/user-attachments/assets/f53c5adb-0944-4831-acc1-23d9a441146b)

![main_dashboard](https://github.com/user-attachments/assets/806a7032-aad6-4f16-ae30-ff9231af2b20)

![collection_settings_menu](https://github.com/user-attachments/assets/1dcc7811-c2f2-46cc-b720-84be1ec93dc9)

![color_menu](https://github.com/user-attachments/assets/54391653-44ef-4d34-a183-d3d1c232ba20)

![context_menu](https://github.com/user-attachments/assets/824c48fd-e0dc-437f-aed4-9e843e5064b9)

![main_menu](https://github.com/user-attachments/assets/71cdf4db-4d1d-40b4-adad-4d6dbd407ae1)

![preset_menu](https://github.com/user-attachments/assets/1da568e0-0e40-472e-8582-b6bf3f8f638e)
