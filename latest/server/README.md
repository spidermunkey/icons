Project Server for learning to interact with databases

this code relies heavily on how you orgainize your icons into the icons target directory

set icons/local/fsconfig.js -- targetDirectory 
    to location with icons

run Local.init(<true>) 
    // update needed flag --true
    to scan folder with icon directories

[todo] [
    -- auto create fsmap.json | fsdb.json on update
    -- auto sync local to remote on update/scan
        *(scan remote db to see if there are collections still in there that local needs to know about)

    -- scan via ui instead of Local.init to trigger updates
        * so as to not manually need to reset database

    -- send back 404/redirect for empty remote db
]