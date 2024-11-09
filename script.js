// team names array 
const teamNames = ["Man City", "Liverpool", "Arsenal", "Aston Villa", "Chelsea",
    "Brighton", "Nottm Forest", "Tottenham", "Brentford", "Fulham", "Bournemouth",
    "Newcastle", "West Ham", "Man United", "Leicester City", "Everton", "Crystal Palace"
    , "Ipswich Town", "Wolves", "Southampton"];

/*
// generating variable names to be used for team instances
const teamInstanceVariables = teamNames.map(item => {

    const arr = item.split(" ");

    return arr.length == 1 ? item.toLowerCase() : arr[0].toLowerCase() + arr[1];



});

*/

// DOM Manipulation 
const orderedList = document.querySelector("#ranking");
const button = document.querySelector("#btn-1");
const resetButton = document.querySelector("#btn-2");



// team class
class Team {
    constructor(name, matchesPlayed = 0, wins = 0, draws = 0, losses = 0, goalsScored = 0, goalsAgainst = 0, goalDifference = 0, points = 0) {
        this.name = name;
        this.matchesPlayed = matchesPlayed;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.goalsScored = goalsScored;
        this.goalsAgainst = goalsAgainst;
        this.goalDifference = goalDifference;
        this.points = points;


    }




    getSummary() {
        return `${this.name} MP: ${this.matchesPlayed}, W: ${this.wins}, D: ${this.draws}, L: ${this.losses}, 
            GF: ${this.goalsScored}, GA: ${this.goalsAgainst}, GD: ${this.goalDifference}, Points: ${this.points}
        `
    }



}

// creates an array of 20 team instances
const teams = teamNames.map(team => new Team(team));

/*
// if all teams are yet to play then display team names alphabetically 
if(teams.every(team => team.points == 0)){
    teams.sort((a,b) => a.name.toLocaleCompare(b.name))
}
*/

// function to calculate goal difference 
const updateGoalDifference = (goalsScored, goalsAgainst) => goalsScored - goalsAgainst;


// function to generate random goals scored
const randomGoalsGenerator = () => Math.floor(Math.random() * 6);

// generate table before matchday1
const populateTable = () => {
    teams.sort((a, b) => {
        if (a.points !== b.points) {
            return b.points - a.points;

        }

        if (a.goalDifference !== b.goalDifference) {
            return b.goalDifference - a.goalDifference
        }

        if (a.goalsScored !== b.goalsScored) {
            return b.goalsScored - a.goalsScored
        }

        return b.points - a.points;

    })

    // clear the list first 
    while (orderedList.firstChild) {
        orderedList.removeChild(orderedList.firstChild);

    }




    teams.forEach((team, index) => {
        const li = document.createElement("li");
        //li.textContent = team.getSummary();


        const HTMLString = `
            <span>${team.name}</span>
            <span>${team.matchesPlayed}</span>
            <span>${team.wins}</span>
            <span>${team.draws}</span>
            <span>${team.losses}</span>
            <span>${team.goalsScored}</span>
            <span>${team.goalsAgainst}</span>
            <span>${team.goalDifference}</span>
            <span>${team.points}</span>
        
        
        `

        li.innerHTML = HTMLString;



        // query all spans to set classes
        const allSpans = li.querySelectorAll("span");

        allSpans[0].className = "team-name";



        [...allSpans].slice(1).forEach(span => span.className = "team-stats");





        orderedList.appendChild(li);

    })
}

// generate premier league schedule 
const leagueSchedule = arrOfTeamObjects => {
    // returns an array of arrays where each subarray will contain the current matchday's matches 
    const schedule = []
    const matchdays = 19; // total teams = 20
    const matchesPerMatchDay = 10;

    let teams = [...arrOfTeamObjects]
    const fixedTeam = teams.shift()

    for (let matchday = 0; matchday < matchdays; matchday++) {
        const currentMatchDay = []

        // generate pair of 10 matches per matchday 
        for (let i = 0; i < matchesPerMatchDay; i++) {
            const teamA = i == 0 ? fixedTeam : teams[i - 1];
            const teamB = teams[teams.length - 1 - i];
            currentMatchDay.push([teamA, teamB]);

        }

        schedule.push(currentMatchDay);
        teams = [teams.pop(), ...teams];


    }

    return schedule;



}

const generatedSchedule = leagueSchedule(teams);




// function for button 
let counter = 0;
let currentMatchDay = 0;



const simulateMatchDay = () => {

    if (counter === 18) {

        const currentMatchDaySchedule = generatedSchedule[currentMatchDay];
        currentMatchDaySchedule.forEach(([team1, team2]) => {
            const team1Goals = randomGoalsGenerator();
            const team2Goals = randomGoalsGenerator();
            playMatch(team1, team2, team1Goals, team2Goals);
    
        });



        button.innerText = "Season has ended";
        button.style.backgroundColor = "gray";

        button.disabled = true;

        populateTable();

        return;

    }
    const currentMatchDaySchedule = generatedSchedule[currentMatchDay];
    currentMatchDaySchedule.forEach(([team1, team2]) => {
        const team1Goals = randomGoalsGenerator();
        const team2Goals = randomGoalsGenerator();
        playMatch(team1, team2, team1Goals, team2Goals);

    });






    currentMatchDay++
    counter++
    button.innerHTML = `
    <img src="images/play button final.png" class="play-button">
    Simulate MatchDay ${counter+1}
    `
    // button.innerText = `Simulate Matchday ${counter}`

    populateTable();





}




// simulate match method 
const playMatch = (team1, team2, team1Goals, team2Goals) => {
    if (team1Goals > team2Goals) {
        team1.points += 3;
        team1.wins++
        team2.losses++
        team1.goalsScored += team1Goals;
        team1.goalsAgainst += team2Goals;
        team1.goalDifference = updateGoalDifference(team1.goalsScored, team1.goalsAgainst)
    } else if (team1Goals == team2Goals) {
        // update stats for team 1
        team1.points++
        team1.draws++
        team1.goalsScored += team1Goals;
        team1.goalsAgainst += team2Goals;
        team1.goalDifference = updateGoalDifference(team1.goalsScored, team1.goalsAgainst);

        // now for team 2 
        team2.points++
        team2.draws++
        team2.goalsScored += team2Goals
        team2.goalsAgainst += team1Goals
        team2.goalDifference = updateGoalDifference(team2.goalsScored, team2.goalsAgainst);





    } else {
        // team 2 wins 
        team2.points += 3;
        team2.wins++
        team1.losses++
        team2.goalsScored += team2Goals;
        team2.goalsAgainst += team1Goals
        team2.goalDifference = updateGoalDifference(team2.goalsScored, team2.goalsAgainst);

    }



    team1.matchesPlayed++
    team2.matchesPlayed++
}


populateTable();

// add event listener to simulate matchday button
button.addEventListener("click", simulateMatchDay);

// reset button 

resetButton.addEventListener("click", () => {
    const confirmation = window.confirm("Are you sure? All table data will be lost!");

    if(confirmation){
        
        // reset team stats 
        teams.forEach(team => {
            team.matchesPlayed = 0;
            team.wins = 0;
            team.draws = 0;
            team.losses = 0;
            team.goalsScored = 0;
            team.goalsAgainst = 0;
            team.goalDifference = 0;
            team.points = 0;

            // reset global variables 
            counter = 0;
            currentMatchDay = 0;

            button.disabled = false;

            button.innerHTML = `
            <img src="images/play button final.png" class="play-button">
            Simulate MatchDay ${counter+1}
            `
            button.id = "btn-1"
            button.className = "button";
            button.style.backgroundColor = "#33b249";


        });

        while(orderedList.firstChild){
            orderedList.removeChild(orderedList.firstChild);
        }

        populateTable();
        




    }

 

});






