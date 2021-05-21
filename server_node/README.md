# devtwins.js server-side REST API (8/15/20)

## node.js

`npm start`

## API example

* `/pagelist`
	* Array: `["First Gallery", "First Page", "Home"]`
* `/pagedata/First%20Gallery'`
	* Object: `{"type":"collage", "images":["IMG_8667.jpg","IMG_8671.jpg"]}`
* `/pagecontent/First%20Gallery/IMG_8671.jpg`
	* File: *IMG_8671.jpg*
	* Acts like a static file server, subdirectories are allowed
 
* `/help`
	* File: (README.md)
 
