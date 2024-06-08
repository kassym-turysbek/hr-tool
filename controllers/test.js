const knex = require("../db/knex.js");
const helpers = require('../public/js/helpers.js')
var questionIterator = 0;
const uuid = require('uuid');
const path = require('path');
module.exports = {
    create: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.id)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.id)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.id)
                            .then((recruiter) => {
                                knex(`tests_completed`)
                                    .join('users', 'tests_completed.test_id', 'users.id')
                                    .join('tests', 'tests_completed.test_id', 'tests.id')
                                    .select('tests.name', 'tests_completed.total', 'tests_completed.correct', 'users.name AS user_Name', 'users.email')
                                    .where('tests_completed.recruiters_id', req.params.id)
                                    .then((result) => {
                                        res.render("pages/dashboardcreate", { user, test, result, recruiter });
                                    })
                            })
                    })
            })
    },

    make: (req, res) => {
        knex('tests').insert({
            name: req.body.name,
            recruiters_id: req.params.id,
            total: 0,
            code: new Date(),
            belbinSwitch: req.body.belbinSwitch,
            timeLimit: req.body.timeLimit
        }).returning('*').then((result) => {
            var tid = parseInt(result[0].id);
            knex('users')
                .where('recruiters_id', req.params.id)
                .then((user) => {
                    knex('tests')
                        .where('recruiters_id', req.params.id)
                        .then((test) => {
                            knex('recruiters')
                                .where('id', req.params.id)
                                .then((recruiter) => {
                                    knex(`tests_completed`)
                                        .join('users', 'tests_completed.test_id', 'users.id')
                                        .join('tests', 'tests_completed.test_id', 'tests.id')
                                        .select('tests.name', 'tests_completed.total', 'tests_completed.correct', 'users.name AS user_Name', 'users.email')
                                        .where('tests_completed.recruiters_id', req.params.id)
                                        .then((result) => {
                                            res.render("pages/dashboard", { user, test, result, recruiter });
                                        })
                                })
                        })
                })
        })
    },

    question: (req, res) => { 
      let fileName = null;
      if (req.files && req.files.question_image) {
      const { question_image } = req.files;
      fileName = uuid.v4() + ".jpg";
      question_image.mv(path.resolve(__dirname, '..', 'static', fileName));
      }
      knex('questions').insert({
        question: req.body.question,
        correct: req.body.correct,
        question_image: fileName,
        false_question_one: req.body.false_question_one,
        false_question_two: req.body.false_question_two,
        false_question_three: req.body.false_question_three,
        false_question_four: req.body.false_question_four,
        false_question_five: req.body.false_question_five,
        false_question_six: req.body.false_question_six,
        false_question_seven: req.body.false_question_seven,
        recruiters_id: req.params.rid,
        test_id: req.params.tid
        }).then(() => {
          knex('tests').where('id', req.params.tid).then((result) => {
            var newTotal = (result[0].total + 1)
            knex('tests').where('id', req.params.tid).update({
              total: newTotal
            }).then(() => {
              res.redirect(`/dashboard/${req.params.rid}/test/${req.params.tid}`)
            })
          })
          })
    },

    questionBelbin: (req, res) => { 
      knex('questionsBelbin').insert({
        questionBelbin: req.body.questionBelbin,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        optionE: req.body.optionE,
        optionF: req.body.optionF,
        optionG: req.body.optionG,
        optionH: req.body.optionH,
        optionI: req.body.optionI,
        recruiters_id: req.params.rid,
        test_id: req.params.tid
        }).then(() => {
          knex('tests').where('id', req.params.tid).then((result) => {
            var newTotal = (result[0].total + 1)
            knex('tests').where('id', req.params.tid).update({
              total: newTotal
            }).then(() => {
              res.redirect(`/dashboard/${req.params.rid}/test/${req.params.tid}`)
            })
          })
          })
    },

    delete: (req, res) => {
        knex('tests').where('id', req.params.tid).del().then(() => {
            res.redirect(`/dashboard/${req.params.rid}`);
        })
    },

    editQ: (req, res) => {
        knex('questions').where('id', req.params.qid).update({
            question: req.body.question,
            question_image: req.body.question_image,
            correct: req.body.correct,
            false_question_one: req.body.false_question_one,
            false_question_two: req.body.false_question_two,
            false_question_three: req.body.false_question_three,
            false_question_four: req.body.false_question_four,
            false_question_five: req.body.false_question_five,
            false_question_six: req.body.false_question_six,
            false_question_seven: req.body.false_question_seven
        }).then(() => {
            res.redirect(`/dashboard/${req.params.rid}/test/${req.params.tid}`)
        })
    },

    editQBelbin: (req, res) => {
      knex('questionsBelbin').where('id', req.params.qid).update({
        questionBelbin: req.body.questionBelbin,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        optionE: req.body.optionE,
        optionF: req.body.optionF,
        optionG: req.body.optionG,
        optionH: req.body.optionH,
        optionI: req.body.optionI,
      }).then(() => {
          res.redirect(`/dashboard/${req.params.rid}/test/${req.params.tid}`)
      })
  },

    deleteQ: (req, res) => {
      knex('tests').where('id', req.params.tid).then((result) => {
        var newTotal = (result[0].total - 1)
        knex('tests').where('id', req.params.tid).update({
          total: newTotal
        }).then(() => {
          knex('questions').where('id', req.params.qid).del().then(() => {
              res.redirect(`/dashboard/${req.params.rid}/test/${req.params.tid}`)
          })
        })
      })
    },

    deleteQBelbin: (req, res) => {
      knex('tests').where('id', req.params.tid).then((result) => {
        var newTotal = (result[0].total - 1)
        knex('tests').where('id', req.params.tid).update({
          total: newTotal
        }).then(() => {
          knex('questionsBelbin').where('id', req.params.qid).del().then(() => {
              res.redirect(`/dashboard/${req.params.rid}/test/${req.params.tid}`)
          })
        })
      })
    },

    taketest: (req, res) => {
        knex('tests').where('code', req.params.id).then((result) => {
            res.render('pages/taketest', { result });
        })
    },

    start: (req, res) => {
      knex('users').where('email', req.body.email).then((user) => {
        if (user.length < 1) {
          var message = {content: 'We don\'t have this email address on file, please check with the recruiter who gave you this link'};
          res.render('pages/message', {message});
        } else {
          knex('tests').where('id', req.params.tid).then((tests) => {
            knex('questions').where('test_id', req.params.tid).then((result) => {
              knex('tests_completed').where('user_id', user[0].id)
              .where('test_id', req.params.tid).then((results) => {
                var attempt = 0;
                var resultsIndex = 0;
                for (var i = 0; i < results.length; i++) {
                  if (results[i].id > attempt) {
                    attempt = results[i].id;
                    resultsIndex = i;
                  }
                }
                if (results[resultsIndex].completed == false) {
                  var test = req.params.tid;
                  var question = result;
                  var arr = [['correct', 'correct'], ['false_question_one', 'incorrect'], ['false_question_two', 'incorrect'], ['false_question_three', 'incorrect'], ['false_question_four', 'incorrect'], ['false_question_five', 'incorrect'], ['false_question_six', 'incorrect'], ['false_question_seven', 'incorrect']];
                  var newArr = helpers.shuffle(arr);
                  var timeLimit = tests[0].timeLimit; 
                  res.render('pages/start', {question, test, user, tests, newArr, timeLimit});
                } else {
                  var message = {content: 'You\'ve already submitted this test. Contact your recruiter if you would like to take the test again'};
                  res.render('pages/message', {message});
                }
              });
            });
          });
        }
      });
    },
    

    startBelbin: (req, res) => {
      knex('users').where('email', req.body.email).then((user) => {
          if (user.length < 1) {
              var message = { content: 'We don\'t have this email address on file, please check with the recruiter who gave you this link' };
              res.render('pages/message', { message });
          } else {
              knex('tests').where('id', req.params.tid).then((tests) => {
                  knex('questionsBelbin').where('test_id', req.params.tid).then((result) => {
                      knex('tests_completed').where('user_id', user[0].id)
                          .where('test_id', req.params.tid).then((results) => {
                              var attempt = 0;
                              var resultsIndex = 0;
                              for (var i = 0; i < results.length; i++) {
                                  if (results[i].id > attempt) {
                                      attempt = results[i].id;
                                      resultsIndex = i;
                                  }
                              }
                              if (results[resultsIndex].completed == false) {
                                  var test = req.params.tid;
                                  var question = result; 
                                  var options = [
                                      ['optionA', 'optionA'],
                                      ['optionB', 'optionB'],
                                      ['optionC', 'optionC'],
                                      ['optionD', 'optionD'],
                                      ['optionE', 'optionE'],
                                      ['optionF', 'optionF'],
                                      ['optionG', 'optionG'],
                                      ['optionH', 'optionH'],
                                      ['optionI', 'optionI']
                                  ];
                                  res.render('pages/startBelbin', { question, test, user, tests, options });
                              } else {
                                  var message = { content: 'You\'ve already submitted this test. Contact your recruiter if you would like to take the test again' };
                                  res.render('pages/message', { message });
                              }
                          });
                  });
              });
          }
      });
  },

  next: (req, res) => {
    var user = [{ id: req.params.uid }];
    questionIterator++;
    knex('tests_completed')
      .where('user_id', req.params.uid)
      .where('test_id', req.params.tid)
      .then((results) => {
        var attempt = 0;
        var resultsIndex = 0;
        for (var i = 0; i < results.length; i++) {
          if (results[i].id > attempt) {
            attempt = results[i].id;
            resultsIndex = i;
          }
        }
        if (req.body.response == 'correct') {
          var newCorrect = results[resultsIndex].correct + 1;
          knex('tests_completed')
            .where('id', results[resultsIndex].id)
            .update({ correct: newCorrect })
            .then(() => {
              var totes = results[resultsIndex].total - 1;
              if (questionIterator > totes) {
                questionIterator = 0;
                knex('tests_completed')
                  .where('id', results[resultsIndex].id)
                  .update({ completed: true })
                  .then(() => {
                    var message = { content: 'Test Completed!' };
                    res.render('pages/message', { message });
                  });
              } else {
                knex('questions')
                  .where('test_id', req.params.tid)
                  .then((result) => {
                    var test = req.params.tid;
                    var question = [result[questionIterator]];
                    var arr = [
                      ['correct', 'correct'],
                      ['false_question_one', 'incorrect'],
                      ['false_question_two', 'incorrect'],
                      ['false_question_three', 'incorrect'],
                      ['false_question_four', 'incorrect'],
                      ['false_question_five', 'incorrect'],
                      ['false_question_six', 'incorrect'],
                      ['false_question_seven', 'incorrect']
                    ];
                    var newArr = helpers.shuffle(arr);
                    return knex('tests')
                      .where('id', req.params.tid)
                      .first()
                      .then((testDetails) => {
                        const timeLimit = testDetails.timeLimit;
                        res.render('pages/start', { question, test, user, newArr, timeLimit });
                      });
                  });
              }
            });
        } else {
          var totes = results[resultsIndex].total - 1;
          if (questionIterator > totes) {
            questionIterator = 0;
            knex('tests_completed')
              .where('id', results[resultsIndex].id)
              .update({ completed: true })
              .then(() => {
                var message = { content: 'Test Completed!' };
                res.render('pages/message', { message });
              });
          } else {
            knex('questions')
              .where('test_id', req.params.tid)
              .then((result) => {
                var test = req.params.tid;
                var question = [result[questionIterator]];
                var arr = [
                  ['correct', 'correct'],
                  ['false_question_one', 'incorrect'],
                  ['false_question_two', 'incorrect'],
                  ['false_question_three', 'incorrect'],
                  ['false_question_four', 'incorrect'],
                  ['false_question_five', 'incorrect'],
                  ['false_question_six', 'incorrect'],
                  ['false_question_seven', 'incorrect']
                ];
                var newArr = helpers.shuffle(arr);
                return knex('tests')
                  .where('id', req.params.tid)
                  .first()
                  .then((testDetails) => {
                    const timeLimit = testDetails.timeLimit;
                    res.render('pages/start', { question, test, user, newArr, timeLimit });
                  });
              });
          }
        }
      });
  },
  

    timeisUp: (req, res) => {
      const { uid, tid } = req.params;
      const { response } = req.body; 
    
      let results; 
      let resultsIndex; 
    
      knex('tests_completed')
        .where('user_id', uid)
        .where('test_id', tid)
        .then(_results => {
          results = _results; 
          var attempt = 0;
          resultsIndex = 0;
          for (var i = 0; i < results.length; i++) {
            if (results[i].id > attempt) {
              attempt = results[i].id;
              resultsIndex = i;
            }
          }
    
          // Check if the response is correct
          if (response === 'correct') {
            var newCorrect = results[resultsIndex].correct + 1;
            return knex('tests_completed')
              .where('id', results[resultsIndex].id)
              .update({ correct: newCorrect });
          }
        })
        .then(() => {
          questionIterator = 0;
    
          return knex('tests_completed')
            .where('id', results[resultsIndex].id)
            .update({ completed: true });
        })
        .then(() => {
          var message = { content: 'Test Completed!' };
          res.render('pages/message', { message });
        });
    },
    
    
    
    nextBelbin: (req, res) => {
      var user = [{ id: req.params.uid }];
      const userId = req.params.uid;
      const testId = req.params.tid;
      questionIterator++;
    
      // Define the mappings
      const belbinMappings = [
        ['D1', 'B2', 'A3', 'I4', 'F5', 'D6', 'G7'], // First element
        ['H1', 'A2', 'I3', 'E4', 'B5', 'G6', 'E7'], // Second element
        ['G1', 'F2', 'C3', 'C4', 'D5', 'H6', 'A7'], // Third element
        ['B1', 'G2', 'E3', 'A4', 'C5', 'C6', 'I7'], // Fourth element
        ['C1', 'H2', 'D3', 'F4', 'H5', 'B6', 'F7'], // Fifth element
        ['A1', 'D2', 'F3', 'H4', 'E5', 'I6', 'D7'], // Sixth element
        ['E1', 'I2', 'B3', 'G4', 'G5', 'E6', 'C7'], // Seventh element
        ['I1', 'E2', 'H3', 'D4', 'A5', 'F6', 'B7'], // Eighth element
        ['F1', 'C2', 'G3', 'B4', 'I5', 'A6', 'H7'], // Ninth element
      ];
    
      // Extract new answers from the request body
      const newAnswers = [];
      for (let i = 0; i < 9; i++) {
        const option = `option${String.fromCharCode(65 + i)}`;
        newAnswers.push([String.fromCharCode(65 + i), parseInt(req.body[option], 10) || 0]);
      }
    
      knex('tests_completed')
        .where('user_id', userId)
        .where('test_id', testId)
        .then((results) => {
          let attempt = 0;
          let resultsIndex = 0;
          for (let i = 0; i < results.length; i++) {
            if (results[i].id > attempt) {
              attempt = results[i].id;
              resultsIndex = i;
            }
          }
    
          let belbinResults = JSON.parse(results[resultsIndex].belbinResults || '[]');
    
          // Initialize belbinResults if it's empty
          if (belbinResults.length === 0) {
            belbinResults = Array(9).fill(0);
          }
    
          // Update the cumulative results based on the mappings
          for (let i = 0; i < belbinMappings.length; i++) {
            let sum = 0;
            for (let j = 0; j < belbinMappings[i].length; j++) {
              const [option, questionIndex] = belbinMappings[i][j].split('');
              const answerValue = newAnswers.find(answer => answer[0] === option)[1];
              if (questionIterator === parseInt(questionIndex, 10)) {
                sum += answerValue;
              }
            }
            belbinResults[i] += sum;
          }
    
          const updatedBelbinResults = JSON.stringify(belbinResults);
          console.log(updatedBelbinResults);
    
          // Update the database with the new results
          knex('tests_completed')
            .where('id', results[resultsIndex].id)
            .update({
              belbinResults: updatedBelbinResults,
            })
            .then(() => {
              var totes = results[resultsIndex].total - 1;
              if (questionIterator > totes) {
                questionIterator = 0;
                knex('tests_completed').where('id', results[resultsIndex].id).update({
                  completed: true,
                })
                  .then(() => {
                    const message = { content: 'Test Completed!' };
                    res.render('pages/message', { message });
                  });
              } else {
                knex('questionsBelbin')
                  .where('test_id', testId)
                  .then((result) => {
                    const test = testId;
                    const question = [result[questionIterator]];
                    const options = [
                      ['optionA', 'optionA'],
                      ['optionB', 'optionB'],
                      ['optionC', 'optionC'],
                      ['optionD', 'optionD'],
                      ['optionE', 'optionE'],
                      ['optionF', 'optionF'],
                      ['optionG', 'optionG'],
                      ['optionH', 'optionH'],
                      ['optionI', 'optionI'],
                    ];
                    res.render('pages/startBelbin', { question, test, user, options });
                  });
              }
            });
        });
    },
    
    
    

    landingcode: (req , res) => {
      var trimcode = req.body.testcode.trim();
      res.redirect(`/taketest/${trimcode}`)
    }
}
