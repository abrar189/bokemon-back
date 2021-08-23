'use strict'

require('dotenv').config();
const express =require('express')
const cors =require('cors')
const mongoose =require('mongoose')
const PORT= process.env.PORT
const server=express();
const axios=require('axios')
server.use(cors());
server.use(express.json());
mongoose.connect(process.env.MONGODB,{ useNewUrlParser: true, useUnifiedTopology: true });

// http://localhost:3006/
server.get('/',(req,res)=>{
    res.send('hiiiiiii')
})

const bokemonSchema = new mongoose.Schema({
    name:  String,
    img:  String,
    level:  String,
  });

  const userSchema = new mongoose.Schema({
   email:String,
   data:[bokemonSchema]
  });

  const user = mongoose.model('user', userSchema);

  function seedUser(){
      let userData=new user({
          email:'abrar123@gmail.com',
          data:[

            {
                "name": "Koromon",
                "img": "https://digimon.shadowsmith.com/img/koromon.jpg",
                "level": "In Training"
                },
                {
                "name": "Tsunomon",
                "img": "https://digimon.shadowsmith.com/img/tsunomon.jpg",
                "level": "In Training"
                },
                {
                "name": "Yokomon",
                "img": "https://digimon.shadowsmith.com/img/yokomon.jpg",
                "level": "In Training"
                },
          ]
      
      })
      
      userData.save();
  }
// seedUser();

// http://localhost:3006/dataDB?email=
server.get('/dataDB',dataDBfun)

function dataDBfun(req, res) {
    let email=req.query.email
    user.find({email:email}, (error, dataUser) => {
        if (error) {
            res.send(error)
        } else {
            res.send(dataUser[0].data)
        }
    })
}

// http://localhost:3006/dataAPI
server.get('/dataAPI',dataAPIfun)

let memory={};
async function dataAPIfun(req,res){

    const url='https://digimon-api.vercel.app/api/digimon'
if (memory['api']!== undefined){
    res.send(memory['api'])
}else{
    const apiData=await axios.get(url);
    const apiMap=apiData.data.map(item=>{
        return new objData(item)
    })
    memory['api']=apiMap;
    res.send(apiMap);
}

}
class objData{
    constructor(data){
        this.name=data.name;
        this.img=data.img;
        this.level=data.level;

    }
}

// http://localhost:3006/addtofav
server.post('/addtofav',addtofavFun)

function addtofavFun(req,res){
const {email,name,img,level}=req.body;
user.find({email:email},(error,userData)=>{
    if (error){
        res.send(error)
    }else{
        const fav={
            name:name,
            img:img,
            level:level,
        }
        userData[0].data.push(fav);
    }
    userData[0].save();
    res.send(userData[0]);
})
}

// http://localhost:3006/delete/idx
server.delete('/delete/:idx',deleteFun)

function deleteFun(req,res){
    let idx=req.params.idx;
    let email=req.query.email;
   
    user.findOne({email:email}, (error, dataUser) => {
        if (error) {
            res.send(error)
        } else {
            dataUser.data.splice(idx,1);
            dataUser.save();
            res.send(dataUser.data)
        }
    })

}

// http://localhost:3006/update/idx
server.put('/update/:idx',updateFun)

function updateFun(req,res){
    let idx=req.params.idx;
    let {email,name,img,level}=req.body;
   console.log(req.body);
    user.findOne({email:email}, (error, dataUser) => {
        if (error) {
            res.send(error)
        } else {
            dataUser.data.splice(idx,1,{
                name:name,
                img:img,
                level:level,
            });
            dataUser.save();
            res.send(dataUser.data)
        }
console.log(dataUser);
    })
    

}
server.listen(PORT,()=>{
    console.log(`listen to ${PORT}`);
})