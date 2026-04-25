import {micromark} from 'https://esm.sh/micromark@3?bundle'

//client app.js

//get dom elements from the frontend
const btn = document.querySelector("button")
const input = document.querySelector("#input")
const chatDiv = document.querySelector(".chat")
const scoreDiv = document.querySelector(".score")
const resetBtn = document.querySelector("#reset")


//save user id and score in local storage for load history
let userId = localStorage.getItem("userid");
let score = Number(localStorage.getItem("score")) || 0
scoreDiv.textContent = `Score: ${score}`



//check if the user has a user id otherwise make one
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("userid", userId);
}


//console.log to check frontend
console.log("starting frontend")



//load history function
async function loadHistory() {
  const res = await fetch("/api/getHistory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })

  const history = await res.json()

  //load history for each user, and ai message
  history.forEach((msg) => {
    if (msg.role === "user") {
      addMessage("user", msg.content)
    }

    if (msg.role === "ai") {
      addMessage("ai", msg.content)
    }
  })
}



//create message in chat logic + conversion to micromark
function addMessage(type, text) {
  const message = document.createElement("div")
  message.className = `message ${type}`
  //console.log(text)

  const converted = micromark(text)
  //console.log(converted)

  message.innerHTML = converted

  chatDiv.appendChild(message)
  chatDiv.scrollTop = chatDiv.scrollHeight
  //render converted markdown content into the message element
  return message
}



//call history function
loadHistory()



//send prompt event 
btn.addEventListener("click", async (e) => {
  //prevent reload
  e.preventDefault() 
  
  //remove whitespace from user input
  const prompt = input.value.trim()
  if (!prompt) return

  //add user input in chat
  addMessage("user", prompt)
  input.value = ""
  btn.disabled = true
  resetBtn.disabled = true

  try {
    //get data
    //send userid and prompt to backend
    const data = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, prompt })
    })

    //save data
    const result = await data.json()


   //score is the score from the json, and otherwise the local storage score
   score = result.score ?? score
   //save score to local storage
   localStorage.setItem("score", score)
   //display score
   scoreDiv.textContent = `Score: ${score}`
   //display AI response with token usage
   addMessage("ai", `${result.question}\n\n_Tokens used: ${result.tokens}_`)

  } catch (error) {
    addMessage("ai", "````_something went wrong_````")
    console.error(error)
  } finally {
    btn.disabled = false
    resetBtn.disabled = false
  }
})


//reset button event empties chat and resets score to 0
resetBtn.addEventListener("click", async () => {
  await fetch("/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })

  //clear UI
  chatDiv.innerHTML = ""

  //reset score
  score = 0
  localStorage.setItem("score", score)
  scoreDiv.textContent = `Score: ${score}`
})







