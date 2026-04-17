import {micromark} from 'https://esm.sh/micromark@3?bundle'

// client app.js
const btn = document.querySelector("button")
const input = document.querySelector("#input")
const chatDiv = document.querySelector(".chat")
const scoreDiv = document.querySelector(".score")
const resetBtn = document.querySelector("#reset")
let userId = localStorage.getItem("userid");

let score = Number(localStorage.getItem("score")) || 0
scoreDiv.textContent = `Score: ${score}`

if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("userid", userId);
}


console.log("starting frontend")

//load history fucntion
async function loadHistory() {
  const res = await fetch("/api/getHistory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })

  const history = await res.json()

  history.forEach((msg) => {
    if (msg.role === "user") {
      addMessage("user", msg.content)
    }

    if (msg.role === "ai") {
      addMessage("ai", msg.content)
    }
  })
}

function addMessage(type, text) {
  const message = document.createElement("div")
  message.className = `message ${type}`
  //console.log(text)

  const converted = micromark(text)
  //console.log(converted)

  message.innerHTML = converted

  chatDiv.appendChild(message)
  chatDiv.scrollTop = chatDiv.scrollHeight
  return message
}

//call history function
loadHistory()


btn.addEventListener("click", async (e) => {
  //prevent reload
  e.preventDefault() 
  
  const prompt = input.value.trim()
  if (!prompt) return

  addMessage("user", prompt)
  input.value = ""
  btn.disabled = true
  resetBtn.disabled = true

  try {
    //get data
    const data = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, prompt })
    })

    //save data
    const result = await data.json()

   score = result.score ?? score
   localStorage.setItem("score", score)
   scoreDiv.textContent = `Score: ${score}`
   addMessage("assistant", `${result.question}\n\n_Tokens used: ${result.tokens}_`)

  } catch (error) {
    addMessage("assistant", "````_something went wrong_````")
    console.error(error)
  } finally {
    btn.disabled = false
    resetBtn.disabled = false
  }
})

resetBtn.addEventListener("click", async () => {
  await fetch("/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })

  // clear UI
  chatDiv.innerHTML = ""

  // reset score
  score = 0
  localStorage.setItem("score", score)
  scoreDiv.textContent = `Score: ${score}`
})







