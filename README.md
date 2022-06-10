# Kruger Backend para la aplicacion de react.
APlicacion realizada con express y desplegada utilizando firebase cloud functions que contiene los siguientes endpoints:
* POST /user: crea un login para un usuario y agrega un hijo en la referencia de la base. 
* GET /user/:uid: Obtiene un usuario dado su uid
* GET  /employees: obtiene todos los empleados de la base 
* POST /employee: crea un nuevo empleado en la base. 
* PUT /employee: actualiza un empleado