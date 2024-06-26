const knex = require("../db/knex.js");

module.exports = {
    // HOME PAGE
    index: (req, res) => {
        res.render("pages/landing");
    },
    // LOGIN PAGE
    loginPage: (req, res) => {
        res.render("pages/login");
    },
    //  SIGNUP  GET
    registerPage: (req, res) => {
        res.render("pages/register");
    },
    // DASHBOARD GET
    dashboard: (req, res) => {
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
                                    .join('users', 'tests_completed.user_id', 'users.id')
                                    .join('tests', 'tests_completed.test_id', 'tests.id')
                                    .select('tests.name', 'tests.belbinSwitch', 'tests_completed.total', 'tests_completed.correct', 'tests_completed.belbinResults', 'users.name AS user_Name', 'users.email', 'users.id AS user_id', 'users.notes', 'users.bio', 'users.location', 'tests_completed.created_at', 'tests_completed.completed')
                                    .where('tests_completed.recruiters_id', req.params.id)
                                    .then((result) => {
                                        res.render("pages/dashboard", { user, test, result, recruiter });
                                    })
                            })
                    })
            })
    },
    // REGISTER POST
    registerRecruiters: (req, res) => {
        knex('recruiters')
            .insert(req.body)
            .returning('*')
            .then((user) => {
                req.session.user_id = user[0].id;
                req.session.save(() => {
                    res.redirect(`/dashboard/${user[0].id}`);
                })
            })
    },
    // LOGIN POST
    loginRecruiters: (req, res) => {
        knex('recruiters')
            .where('email', req.body.email).then((results) => {
                let user = results[0];
                if (!user) {
                    res.redirect('/login');
                    return;
                }
                if (user.password === req.body.password) {
                    req.session.user_id = user.id;
                    req.session.save(() => {
                        res.redirect(`/dashboard/${user.id}`);
                    })
                } else {
                    res.redirect("/login");
                }
            })
    },
    // LOGOUT
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            res.redirect('/');
        });
    },
    userDashboard: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                knex(`users`)
                                    .join('tests_completed', 'tests_completed.user_id', 'users.id')
                                    .join('tests', 'tests_completed.test_id', 'tests.id')
                                    .select('tests.name', 'tests.belbinSwitch', 'tests_completed.total', 'tests_completed.completed', 'tests_completed.correct', 'tests_completed.belbinResults', 'users.name AS user_Name', 'users.email', 'users.id AS user_id', 'users.notes', 'users.bio', 'users.location', 'tests_completed.created_at', 'tests_completed.completed')
                                    .where('users.id', req.params.uid)
                                    .then((result) => {
                                        if (result.length > 0) {
                                            res.render("pages/userPage", { user, test, result, recruiter });
                                            
                                        } else {
                                            knex('users')
                                                .where('id', req.params.uid)
                                                .select('users.name AS user_Name', 'users.email', 'users.notes', 'users.id AS user_id', 'users.bio', 'users.linkedin', 'users.location')
                                                .then(userResult => {
                                                    result = userResult
                                                    res.render("pages/userPage", { user, test, result, recruiter });
                            
                                                })
                                        }

                                    })
                            })
                    })
            })
    },
    // TEST INFO GET
    testInfo: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                knex('tests')
                                    .where('recruiters_id', req.params.rid)
                                    .where('id', req.params.tid)
                                    .then(testItem => {
                                        knex('questions')
                                            .where('test_id', req.params.tid)
                                            .then(questions => {
                                                knex('questionsBelbin')
                                                    .where('test_id', req.params.tid)
                                                    .then(questionsBelbin => {
                                                        res.render("pages/testPage", { user, test, recruiter, testItem, questions, questionsBelbin })
                                                    })
                                            })
                                    })
                            })
                    })
            })
    },

    // PROFILE EDIT RECRUITER
    profileEdit: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                res.render("pages/settingsRecruiter", { user, test, recruiter })
                            })
                    })
            })
    },
    // EDIT PROFILE
    updateProfile: (req, res) => {
        knex('recruiters')
            .where('id', req.params.rid)
            .update(req.body)
            .then(() => {
                res.redirect(`../dashboard/${req.params.rid}`)
            })
    },
    //  HELP PAGE
    helpPage: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                res.render("pages/help", { user, test, recruiter })
                            })
                    })
            })
    },
    addTestToUser: (req, res) => {
        knex('tests')
            .where('id', req.body.test_id)
            .then((test) => {
                knex('tests_completed')
                    .insert({
                        test_id: req.body.test_id,
                        user_id: req.params.uid,
                        correct: 0,
                        total: test[0].total,
                        completed: false,
                        recruiters_id: req.params.rid
                    })
                    .then(() => {
                        res.redirect(`../../dashboard/${req.params.rid}/user/${req.params.uid}`)
                    })
            })


    },
    about: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                res.render("pages/about", { user, test, recruiter })
                            })
                    })
            })
    },
    services: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                res.render("pages/services", { user, test, recruiter })
                            })
                    })
            })
    },
    clients: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                res.render("pages/clients", { user, test, recruiter })
                            })
                    })
            })
    },
    contacts: (req, res) => {
        knex('users')
            .where('recruiters_id', req.params.rid)
            .then((user) => {
                knex('tests')
                    .where('recruiters_id', req.params.rid)
                    .then((test) => {
                        knex('recruiters')
                            .where('id', req.params.rid)
                            .then((recruiter) => {
                                res.render("pages/contact", { user, test, recruiter })
                            })
                    })
            })
    },
}