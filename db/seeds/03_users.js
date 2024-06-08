exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([
                { name: "James Wallace", email: 'jameswallace@gmail.com', location: 'Phoenix', bio: 'Junior level Front End Developer looking for a position at a startup company', notes: [{ date: "5/21/2019", note: "Waiting to here back" }, { date: "6/1/2019", note: "Took first test and scored average to other candidates interested in Software Engineering Developer position at Google" }, { date: "6/15/2019", note: "Retook JavaScript test and scored 100%. Top candidate for Software Engineering Developer position at Google" }], recruiters_id: 1 },
                { name: "Max Smith ", email: 'max.smith@gmail.com', location: 'San Diego', bio: 'Mid level Java Developer looking to move to Phoenix within the year', notes: [{ date: "5/21/2019", note: "Waiting to here back" }, { date: "6/1/2019", note: "Took first test and scored average to other candidates interested in Software Engineering Developer position at Google" }, { date: "6/15/2019", note: "Retook JavaScript test and scored 100%. Top candidate for Software Engineering Developer position at Google" }], recruiters_id: 1 },
                { name: "Mark Zuckerberg", email: 'markzuckerberg@facebook.com', location: 'Chandler, AZ', bio: 'Senior developer interested in an IT Manager position in a Fortune 500 company with a strong benefits package', notes: [{ date: "5/21/2019", note: "Waiting to here back" }, { date: "6/1/2019", note: "Took first test and scored average to other candidates interested in Software Engineering Developer position at Google" }, { date: "6/15/2019", note: "Retook JavaScript test and scored 100%. Top candidate for Software Engineering Developer position at Google" }], recruiters_id: 1 },
                { name: "George Jungle", email: 'georgejungle@gmail.com', location: 'Phoenix', bio: 'Mid Level developer interested in Senior level JavaScript position', notes: [{ date: "5/21/2019", note: "Waiting to here back" }, { date: "6/1/2019", note: "Took first test and scored average to other candidates interested in Software Engineering Developer position at Google" }, { date: "6/15/2019", note: "Retook JavaScript test and scored 100%. Top candidate for Software Engineering Developer position at Google" }], recruiters_id: 1 },
                { name: "Rick James", email: 'rickjames@gmail.com', location: 'Phoenix', bio: 'Junior level Back End Developer looking for a position at a startup company', notes: [{ date: "5/21/2019", note: "Waiting to here back" }, { date: "6/1/2019", note: "Took first test and scored average to other candidates interested in Software Engineering Developer position at Google" }, { date: "6/15/2019", note: "Retook JavaScript test and scored 100%. Top candidate for Software Engineering Developer position at Google" }], recruiters_id: 1 },
            ]);
        });
};