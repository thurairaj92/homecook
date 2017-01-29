DB Info
------

db.createUser({user:"home_cook_user", pwd:"thurai92", roles :[{role: "readWrite", db: "home_cook_dev"}]})
db.createUser(
  {
    user: "home_cook_db_admin",
    pwd: "home_cook_db_admin",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, { role: "readWriteAnyDatabase", db: "admin" }  ]
  }
)

db.updateUser(
   "home_cook_db_admin",
   {
     roles : [
                { role: "userAdminAnyDatabase", db: "admin" } ,
                { role: "readWriteAnyDatabase", db: "admin" } 
             ],
     pwd: "home_cook_db_admin"
    }
)

db.auth( "home_cook_db_admin", "home_cook_db_admin" )
mongo --port 27017 -u home_cook_db_admin -p home_cook_db_admin --authenticationDatabase admin


//check if category exist
db.getCollection('user_food').find(
    {
        $and : [
            { products : 
                {$elemMatch : { category : "indian" } }
            },
            { _id : "Tim Cook"}
        ]
    }
)

//push into category
db.getCollection('user_food').update(
    {
        "name" : "Tim Cook", 
        "products.category" : "indian" 
    }, 
    {
        $push : 
            {'products.$.food' : 
                {
                   "title" : "roti canai",
                   "price" : 10 
                }
             }
    })

 