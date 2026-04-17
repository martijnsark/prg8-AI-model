import express from "express"
import { callOpenAI, getHistory } from "./chat.js"


const app = express()
app.use(express.json())
app.use(express.static("public"))

app.get("/api/test", async(req,res) => {
    const result = await callOpenAI("make a joke about a hamster")
    res.json({response:result})
})

app.post("/api/chat", async(req,res) => {
    const { userId, prompt } = req.body 
    const response = await callOpenAI(userId, prompt)
    res.json(response)
})

app.post("/api/getHistory", async(req,res) => {
    const { userId } = req.body 
    const history = getHistory(userId)
    res.json(history)
})

app.listen(3000, ()=> console.log("server started"))