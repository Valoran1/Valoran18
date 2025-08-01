const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const scrollBtn = document.getElementById("scroll-btn");

let messages = [];

function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "bot-message";
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing-indicator";
  typing.className = "bot-message";
  typing.textContent = "Valoran piše...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
}

chatBox.addEventListener("scroll", () => {
  scrollBtn.style.display = chatBox.scrollTop < chatBox.scrollHeight - 300 ? "block" : "none";
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;

  addMessage(input, "user");
  userInput.value = "";
  messages.push({ role: "user", content: input });

  showTyping();

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });
    const reply = await res.text();
    removeTyping();
    addMessage(reply, "bot");
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    removeTyping();
    addMessage("Napaka pri komunikaciji z Valoranom.", "bot");
    console.error(err);
  }
});




