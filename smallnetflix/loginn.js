const express = require('express')
const pro = express()
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')

pro.use(express.static('public'))
pro.set('view engine', 'ejs')
pro.set('views', path.join(__dirname,'views'))
pro.use(bodyParser.urlencoded({ extended: false }))

let msg = "";


let loadUsers = function(){
    try {
        let bufferedData = fs.readFileSync('user.json')
        let dataString = bufferedData.toString()
        let usersArray = JSON.parse(dataString)
        return usersArray
    } catch (error) {
        return []
    }
   
}

// let addUser = function(user){
//     //load tasks array
//     let users = loadUsers()
//     //push new task in array
//     users.push(user)
//     //save array back in file
//     fs.writeFileSync('user.json', JSON.stringify(users))
// }

pro.get('/', function(req,res){
    res.render('login',{
       msg : msg
    })
})
pro.get('/registration', function(req,res){
    res.render('registration',{
       msg : msg
    })
})

pro.post('/log', function(req,res){
    
    var exist=false
    var pass=false;
    let users = loadUsers()
    if(req.body.username.length==0){
        
        msg = "you should enter a username"
        
       
    }
    if(req.body.password.length==0){
       
       msg = "you should enter a password"
       
    }
    else {
    for(let i = 0; i < users.length&& !exist; i+=2){
        if (users[i]==req.body.username){

        exist=true;  
        if(users[i+1]!=req.body.password){
            msg="password is incorrect"
            
            break;
        }
        else{
            pass=true;
            
        }
        }
        
     
     }
     if(!exist){
         msg="this username doesn't exist"
         
     }
     
    if(exist && msg=="password is correct"){
        res.render('home');
    }
}

   
   //res.redirect('/')
   res.render('login',{msg:msg})
})

pro.listen(3000, ()=>{
    console.log('server is running')
})
