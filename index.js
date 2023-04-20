const express = require("express"); // express is used to create server
const ejs = require("ejs");
const port = 5000;
const app = express();
const { Configuration, OpenAIApi } = require("openai");   // Open ai  is dependency from which imported configuration and openaiapi modules
require("dotenv").config(); //.env files are imported with help of this 
app.set("view engine", "ejs"); //The line app.set("view engine", "ejs");
// sets the view engine for a Node.js/Express web application to EJS (Embedded JavaScript). it renders dynamic content on server in front of client clide

let questionForGPT;
let answer;
let history = [];

app.use(express.urlencoded({ extended: true })); //middle ware to decode the data present on server when we input on form 
app.use(express.static("/css/style.css"))
app.listen(port, () => console.log(`Listening on ${port}`));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  //it is made so that no random access is done and remains to an individual
});
const openai = new OpenAIApi(configuration);  

const callToAPI = async () => {  // we make a api call to server called openapi server and it sends the response
  const response = await openai.createChatCompletion({ //sends the object to openai server
    model: "gpt-3.5-turbo", //latest free model                                                               // we ask question to server with the help of api
    messages: history,   //questions we pass so that we get answer
    temperature: 1,       //randomness when we ask for same question it shows diff answers
  });

  answer = response.data.choices[0].message.content;    
 // we interact with chatgpt server with help of API
  console.log(answer);
  history.push({ role: "assistant", content: answer }); //data is pushed into history so that it modifies on behalf of previous data stored
};
// callToAPI();
app.get("/", (req, res) => { //local host display renders home
  res.render("home", { title: "ChatGPT Chatbot", chats: history }); // renders the home page of the website
});

app.post("/ask-gpt", async (req, res) => {  // data from form goes to a url called /ask-gpt
  questionForGPT = req.body.question; // we are able to acces this because of url encoded at line number 14
  history.push({ role: "user", content: questionForGPT }); // 2 roles user and assistant 
  await callToAPI(); 
  res.redirect("/");
});

