import express from "express"
import { callOpenAI, getHistory, resetUser } from "./chat.js"

//variable to use express
const app = express()
//variable to use json in express
app.use(express.json())
//make files in public (HTML, CSS, JS) available directly to the browser
app.use(express.static("public"))

//test route
//app.get("/api/test", async(req,res) => {
//    const result = await callOpenAI("make a joke about a hamster")
//    res.json({response:result})
//})

//chat route with ai response userid, and prompt
app.post("/api/chat", async(req,res) => {
    const { userId, prompt } = req.body 
    const response = await callOpenAI(userId, prompt)
    res.json(response)
})

//history route to fetch old chat history
app.post("/api/getHistory", async(req,res) => {
    const { userId } = req.body 
    const history = getHistory(userId)
    res.json(history)
})

//reset chat and score route
app.post("/api/reset", (req, res) => {
  const { userId } = req.body
  resetUser(userId)
  res.json({ success: true })
})

//start server
app.listen(3000, ()=> console.log("server started"))