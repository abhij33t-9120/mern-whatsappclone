import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors'
//config of app
const app=express()
const port = process.env.PORT || 9000
const pusher = new Pusher({
    appId: "1218082",
    key: "6f1796ce33425886756a",
    secret: "f4be9067a044bf334498",
    cluster: "ap2",
    useTLS: true
  })
  const db=mongoose.connection
  db.once('open',() =>{
      console.log('DB is connected')
      const msgCollection=db.collection('messagecontents')
      const changeStream=msgCollection.watch()
      
      changeStream.on('change',(change) => {
          console.log(change)
    if(change.operationType=='insert'){
        const messageDetails=change.fullDocument;
        pusher.trigger('messages','inserted',
        {
            name: messageDetails.name,
            message: messageDetails.message,
            timestamp: messageDetails.timestamp,
            received: messageDetails.received
        })
    }else{
        console.log('Error trigerring pusher')
    }
      })
  })


//middlewares
app.use(express.json())
app.use(cors())


//DB configuration
const connection_url='mongodb://abhij33t:Chillam9120@cluster0-shard-00-00.npzdz.mongodb.net:27017,cluster0-shard-00-01.npzdz.mongodb.net:27017,cluster0-shard-00-02.npzdz.mongodb.net:27017/whatsappdb?ssl=true&replicaSet=atlas-7p390t-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
})
//api routes
app.get('/',(req,res) =>{
    res.status(200).send('hello world')
})

app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new',(req,res) =>{
    const dbMessage=req.body

    Messages.create(dbMessage,(err,data) =>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

//heroku config
if (process.env.NODE_ENV=='production'){
    app.use(express.static('./whatsapp-mern/build'))
}

//listen
app.listen(port,()=>console.log(`Listening on local host ${port}`))