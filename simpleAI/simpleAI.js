var path = require('path')
    , url = require('url')
    , https = require('https');

// Handler for /question POST requests
// It will return the JSON in the format: {"answer":"<Response>"}
exports.question = function(req, res) {
  var question = req.body.question;
  var response;
	
  // Simple responses based on keywords
  if(question){
    if(question.toLowerCase().indexOf("what") >= 0){
      response = "You should go do whatever man.";
    }
    else if (question.toLowerCase().indexOf("where") >= 0){
      response = "Go where your heart tells you to go.";
    }
    else if(question.toLowerCase().indexOf("why") >= 0){
      response = "Why not.";
    }
    else if (question.toLowerCase().indexOf("who") >= 0){
      response = "Who knows.";
    }
    else if (question.toLowerCase().indexOf("how") >= 0){
      response = "How does anything work.";
    }
  }
  
  // The default answer
  if (!response){
    var basicResponses = ["uh.", "asdf", "", "I don't really...", "...", "So anyway...", "I'm a bot.", "Please accuse me."];
    var choice = Math.floor(Math.random() * ((basicResponses.length - 1) - 0 + 1));
    response = basicResponses[choice];
  }
  
  var output = '{"answer":"'+ response + '"}';
  var answers = JSON.parse(output);	
  res.json(answers);
};
