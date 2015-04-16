This framework is divided into 2 major folders
 - `/src/` 
 - `/web/` wish is accessible from the web

#Request handling by example :
Let's see what actions the following request `GET site.com/hello/world` will try  (stop as soon as on of them succeed) :

1. If `/web/hello/world` file exist : send it
2. If `/src/hello.php` script exist : call it `get_world` function (or `post_world` if the request method were POST)
3. If `/src/hello.php` script exist but no `get_world()` function : call the `get_default()` function
4. If `/src/default.php` script exist : call it `get_world` function (or `post_world` if the request method were POST)
5. If `/src/default.php` script exist but no `get_world()` function : call the `get_default()` function
6. return a server error

The 2 to 6 tries are described in the /web/index.php file

#/src
This folder contain every server-side controlers.
Each controler will be call according to they name and the requested URL.
PUF comes with some controlers examples :
## v1.php (handle every `/v1/*` url)
Deliver a RESTFull view of the database see /src/v1.md for API
```
/v1/users => Display information about table column names/size/comment that could be use to generate a dynamic formular
/v1/users/42 => SELECT * FROM users where id = 42
/v1/users/name => List all names<=>number of users with this name
/v1/users/name/john => SELECT * FROM users where name = john
```

## Page.php (equivalent to `default.php` in the request handling example)
Render every requested web pages by sourrounding them with a header/menu/footer
For example requesting `/Page/Just/An/Example.html` will return `/web/public/page/Just/An/Example.html` with a header/menu/footer
### Provided utilities 
- The main menu is automaticaly generated using `/web/public/page/` content and sub-folders.
- The page content can be a .md (markdown) file. The content will be converted to HTML on the client side 

#/web
All the /web folder content is unrestrictivly accessible to any request.
So it's a very bad idea to store any sensitive information (SQL credentials) in this folder. Use the /src/ folder insteate (wich can't be directy accessed)
