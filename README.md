pet project for managing svg files all inside of web ui. 
persisted changes in mongo db for use with multiple workspaces.

it's messy (first real project)
scanner.js parses and serves files in [target directory]
monitor.js watches for changes
model.js uploads and servers uploaded files for use with editor

cd ./latest; npm run windows

cd ./latest/server; npm start

localhost:2222

[TODO]
-- fix upload function
-- fix add to collection/create collection functions
-- color editor works but setting default colors doesn't
-- create new user flow
