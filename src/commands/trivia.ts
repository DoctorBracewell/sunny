import { randomFromArray } from "drbracewell-random-tools";
import fetch from "node-fetch";
import { Client, Message } from "discord.js";
import { SunnyEmbed } from "../embeds";

module.exports = {
  name: "trivia",
  category: "fun",
  description: "Starts a trivia contest.",
  arguments: "easy medium hard",
	execute(client: Client, message: Message, args: string[]) {

        if (args.length === 0) {
          message.channel.send("Please provide a difficulty, `easy`, `medium` or `hard`.");
          return;
         }
        // Setup
        let questionNumber = 0, contestants = [], questionEmbed, randomQuestion: any, randomChoices = [], 
            shuffledAnswer: any, choicesString = ``, leaderboard = [], list = [], questionsArray;

        if (!(["easy","medium","hard"].includes(args[0]))) {
          message.channel.send("That is not a valid contest difficulty, use `easy`, `medium` or `hard`.");
          return;
        }

        let url = "https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986";
        if(args.length === 1) {
          switch (args[0]) {
            case "easy":
              url += "&difficulty=easy";
              break;
            case "medium":
                url += "&difficulty=medium";
                break;
            case "hard":
                url += "&difficulty=hard";
                break;
          }
        }
          // Get api trivia
        fetch(url, {})
          .then(res => res.json())
          .then(res => {
            questionsArray = res.results.slice();

            for (let element of questionsArray) {
              element.question = decodeURIComponent(element.question);
              element.incorrect_answers.unshift(element.correct_answer);

              for (let i = 0; i < element.incorrect_answers.length; i++) {
                element.incorrect_answers[i] = decodeURIComponent(element.incorrect_answers[i]);
              }

              let obj = element;
              obj.answers = obj.incorrect_answers;
              delete obj.incorrect_answers;
            }

          })
          .catch(function (error) {
            console.log(error);
            message.channel.send("Something went when trying to recieve the questions from the API, please try again.");
            return;
          });
        
        // incorrect/correct answers
        let correctAnswers = () => {
          if (leaderboard.some(element => element.correct === true)) {
            list = [];
            leaderboard.forEach(element => {
              if (element.correct === true) {
                list.push(element.id);
              }
            })
            return `<@${list.join(">, <@")}> answered the question correctly.`;
          } else return "No one answered the question correctly."
        }
        let incorrectAnswers = () => {
          if (leaderboard.some(element => element.correct === false)) {
            list = [];
            leaderboard.forEach(element => {
              if (element.correct === false) { 
                list.push(element.id);
              }
            })
            return `<@${list.join(">, <@")}> did not answer the question correctly.`;
          } else return "No one answered the question incorrectly.";
        }
    
        // sort leaderboard
        let sortContestants = () => {
          let orderedBoard = leaderboard.slice();
          let returnString = "";
          let number = 0;
          orderedBoard.sort((a, b) => b.score - a.score)
          for (let i = 0; i < orderedBoard.length; i++) {
            number++;
            returnString += `${number}) <@${orderedBoard[i].id}> with **${orderedBoard[i].score}** points.\n`;
          }
          return returnString;
        }
    
        // Question Generator
        function questions() {
          // Question Template
          questionNumber++;
          questionEmbed = new SunnyEmbed()
            .setDefaultProperties()
            .setTitle(`**Question ${questionNumber}**:`);
    
          // Question Generation + Shuffling
          leaderboard.forEach((element) => {
            element.correct = false;
          })
    
          // Duplicate question + inject
          randomQuestion = randomFromArray(questionsArray);
          randomChoices = randomQuestion.answers.slice().sort(() => Math.random() - 0.5);
          shuffledAnswer = randomChoices.indexOf(randomQuestion.answers[0]);
          shuffledAnswer === 0 ? shuffledAnswer = "🇦" : 
            shuffledAnswer === 1 ? shuffledAnswer = "🇧" :
            shuffledAnswer === 2 ? shuffledAnswer = "🇨" :
            shuffledAnswer === 3 ? shuffledAnswer = "🇩" :
              null;
          choicesString = `A) ${randomChoices[0]} \nB) ${randomChoices[1]} \nC) ${randomChoices[2]} \nD) ${randomChoices[3]}`;
    
          // Embed in question.
          questionEmbed.addField(randomQuestion.question, "React to this message with your answer!").addField("Choices:", choicesString);
          questionsArray.splice(questionsArray.indexOf(randomQuestion), 1);
    
          // Send + React
          message.channel.send(questionEmbed).then(message => {
            let abcd = ["🇦", "🇧", "🇨", "🇩"];
            
            message.react(abcd[0])
              .then(() => message.react(abcd[1]))
              .then(() => message.react(abcd[2]))
              .then(() => message.react(abcd[3]))
              .then(() => message.channel.send("You have 15 seconds to answer the question!"))
              .then(() => {
                // Listen for reactions
                let filter = (reaction, user) => abcd.includes(reaction.emoji.name) && !user.bot;
                let collector = message.createReactionCollector(filter, { time: 15000 });
                let alreadyReacted = [];
                collector.on("collect", reaction => {
                  // If contestant + not reacted continue
                  if (contestants.includes(reaction.users.cache.keyArray().splice(-1, 1)[0]) && !alreadyReacted.includes(reaction.users.cache.last().id)) {
                    for (let i = 0;i < leaderboard.length; i++) {
                      if (leaderboard[i].id === reaction.users.cache.last().id  && reaction.emoji.name == shuffledAnswer) {
                        leaderboard[i].score += 1;
                        leaderboard[i].correct = true;
                      }
                    }
                    alreadyReacted.push(reaction.users.cache.last().id);
                  } else {
                    // remove emoji
                    switch (reaction.emoji.name) {
                      case abcd[0]:
                        message.reactions.cache.get(abcd[0]).remove();
                        break;
    
                      case abcd[1]:
                        message.reactions.cache.get(abcd[1]).remove();
                        break;
                    
                      case abcd[2]:
                        message.reactions.cache.get(abcd[2]).remove();
                        break;
                      
                      case abcd[3]:
                        message.reactions.cache.get(abcd[3]).remove();
                        break;
                    }
                  }
                })
                // On end send answer
                collector.on("end", () => {
                  message.channel.send(`${correctAnswers()}\n${incorrectAnswers()}`);
                  message.channel.send(`The correct answer was ${shuffledAnswer}, ${randomQuestion.answers[0]}`);
                  // If finish send leaderboard.
                  if (questionNumber === 5) {
                    setTimeout(() => {
                      message.channel.send(
                        new SunnyEmbed()
                        .setDefaultProperties()
                        .setTitle(`**Contest Results**`)
                        .setDescription("Thanks for participating!")
                        .addField("Leaderboard:", sortContestants())
                      );
                    }, 5000)
                  } else {
                    // Next question
                    setTimeout(() => {
                      questions();
                    }, 3000)
                  }
                })
              })
          });
        }
    
        // Message Detection
        try {
          message.channel.send(`${message.author} has started a __${(args[0] === "general") ? `${args[1].toUpperCase()} ` : ''}${args[0].toUpperCase()} TRIVIA CONTEST__! React to this message to join in. The contest will start in 20 seconds, or disband if there are not enough players.`).then(message => {
            message.react("❓");
            let filter = (reaction, user) => reaction.emoji.name === '❓' && !user.bot;
            // Player collection
            message.awaitReactions(filter, { time: 20000 })
              .then(collected => {
                if (collected.get("❓").count >= 3) {
                  // Set up contestants + leaderboard and start 1st question
                  contestants = collected.get("❓").users.cache.keyArray();
                  contestants.shift();
                  message.channel.send(`Contest has started! The contestants are: <@${contestants.join(">, <@")}>!`);
                  message.channel.send(`**Please do not react to questions until the '15 seconds' message has been sent!**`);
                  for (let i=0; i < contestants.length; i++) {
                    leaderboard.push({
                      "id": contestants[i],
                      "score": 0,
                      "correct": false
                    });
                  }
                  questions();
                } else {
                  // Not enough players
                  message.channel.send(`The contest has been disbanded because there weren't enough players!`);
                }
              })
              .catch(console.error);
          });
        }
        catch (err) {
          console.log(err);
          message.channel.send(`Something went wrong, please try again!`);
        }
	}
};