let charContainer = document.querySelector("#compareCharacter")
let charForm = document.querySelector("#characterForm")
let compareBtn = document.querySelector("#compareBtn")
let charOneChoice = document.querySelector("#charOne")
let charTwoChoice = document.querySelector("#charTwo")
let h3 = document.createElement("h3");
let errorDiv = document.createElement("div");

let charArr = []
let duplicateChar;

// -------------------------------------------------------- Set up: API -----------------------------------------------------------
let API_BASE_URL = "https://swapi.dev/api/"

let getData = async(route, params) => {
    try {
        let res = await fetch(`${API_BASE_URL}${route}${params ? params : ""}`)
        // let res2 = await fetch(`${API_BASE_URL}/people`)
        // console.log(await res2.json());
        return  await res.json();
    } catch (error) {
        // console.log(error);
        compareBtn.classList.add("hidden")
        charContainer.innerHTML= ""
        h3.innerText = "Something went wrong.. Please try again later.";
        document.body.append(h3);
    }
}
// -------------------------------------------------------- Character Prototype -----------------------------------------------------------
class Character {
    constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, homePlanet, vehicles, starships, pictureUrl) {
        this.name = name;
        this.gender = gender;
        this.height = +height;
        this.mass = +mass;
        this.hairColor = hairColor;
        this.skinColor = skinColor;
        this.eyeColor = eyeColor;
        this.movies = movies;
        this.homePlanet = homePlanet;
        this.vehicles = vehicles;
        this.starships = starships;
        this.pictureUrl = pictureUrl + ".svg";
    }
    renderCharacter() {
        charContainer.innerHTML += `
            <article class="col-sm pb-5" data-character="${this.name.toLowerCase().split(' ').join("-")}">
                <div class="text-center">
                    <h3>${(this.name).toLowerCase()}</h3>
                    <img class="svg" src="assets/images/${this.pictureUrl.toLowerCase().split(' ').join("-")}" alt="Portrait of ${this.name}"/>
                </div>
            </article>
        `
    }
    renderProperties(container) {
        let charTwo = charArr.find(obj => obj != this)
        container.innerHTML += `
            <section class="col my-4">
                <ul class="list-group"> 
                    <li class="list-group-item ">${this.name}'s hair is ${(this.hairColor)}<span class="${this.compareCharacters(this.hairColor,charTwo.hairColor)}"> just like ${charTwo.name}'s hair.</span></li>
                    <li class="list-group-item ">${this.name} is ${(this.gender)}<span class="${this.compareCharacters(this.gender,charTwo.gender)}"> just like ${charTwo.name}</span></li>
                    <li class="list-group-item ">${this.name} is ${(this.height)} cm tall<span> ${this.compareCharacters(this.height,charTwo.height, charTwo, "height")}</span></li>
                    <li class="list-group-item ">${this.name} weighs ${this.mass} kg<span> ${this.compareCharacters(this.mass,charTwo.mass, charTwo, "mass")} </span></li>
                    <li class="list-group-item ">${this.name}??s skin is ${(this.skinColor)}<span class="${this.compareCharacters(this.skinColor,charTwo.skinColor)}"> , the same as ${charTwo.name}'s skin.</span></li>
                    <li class="list-group-item">${this.name} has appeared in ${(this.movies.length)} movies<span> ${this.compareCharacters(this.movies.length,charTwo.movies.length, charTwo, "length")} </span></li>
                </ul>
            </section>
            <section class="container">
                <h4>Tell me more how we are different?</h4>
                <div class="row g-2">
                    <div class="col-6"><button class="method p-3 compare-debut">Onscreen debut</button></div>
                    <div class="col-6"><button class="method p-3 movie-list">Movielist</button></div>
                    <div class="col-6"><button class="method p-3 home-planets">Homeplanets</button></div>
                    <div class="col-6"><button class="method p-3 vehicles">Vehicle</button></div>
                </div>
                <p class="method-results"></p>
            </section>
        `
        // All game-play event-listeners
        container.querySelector(".compare-debut").addEventListener("click", () => this.compareDebut())
        container.querySelector(".movie-list").addEventListener("click", () => this.compareFilms(charTwo))
        container.querySelector(".home-planets").addEventListener("click", () =>  this.compareHomePlanet(charTwo))  
        container.querySelector(".vehicles").addEventListener("click", () =>  this.compareVehicles())  

        // onclick="${this.compareDebut()}
    }
    compareCharacters(valueOne, valueTwo, charTwo, str){
        if(typeof valueOne === "string") {
            if (valueOne === valueTwo) {
                // console.log(`${valueOne} is the same as ${valueTwo}`) 
                return 
            }
            else {
                // console.log(`${valueOne} is not the same as ${valueTwo}`)
                return "hidden" 
            }
        } else {
            let string;
            if (valueOne > valueTwo){
                // console.log(`${valueOne} is bigger than ${valueTwo}`)
                if(str === "length") {
                    string = `, compared to ${charTwo.name}'s measly ${charTwo.movies.length} movie appearances.`
                } else if (str === "mass") {
                    string = `, which is ${this.mass - charTwo.mass} kg more than ${charTwo.name}, who weighs in on ${charTwo.mass} kg`
                }else if (str === "height") {
                    string = `, and therefore taller than ${charTwo.name}, who is only ${charTwo.height} cm`
                }
                return string;
            } else if (valueOne < valueTwo) {
                //todo! Vill jag l??gga tillbaka?
                return ""
            } else if (valueOne === valueTwo) {
                // console.log(`${valueOne} is the same as ${valueTwo}`) 
                if(str === "length") {
                    string = `, the same amount as ${charTwo.name}`
                } else if (str === "mass") {
                    string = `, the same as ${charTwo.name}`
                }else if (str === "height") {
                    string = `, just as ${charTwo.name}`
                }
                return string;
            }
        }
    }
    compareDebut = async () => {
        let firstMovie = await getData(chopChop(this.movies[0])) 
        console.log(`${this.name} first appeared ${firstMovie.release_date} in ${firstMovie.title}.`);     
    }
    compareFilms = async (charTwo) => {
        let movieArr = await fetchApiUrlArr(this.movies, "title")
        let movieArr2 = await fetchApiUrlArr(charTwo.movies, "title")
        console.log("movieArr", movieArr[0]);
        console.log("movieArr2", movieArr2[0]);
        let sharedMovies = movieArr[0].filter((movie) => movieArr2[0].includes(movie));
        console.log("sharedMovies", sharedMovies);
    }
    compareHomePlanet = async (charTwo) => {
        let homePlanet = await getData(chopChop(this.homePlanet)) 
        let homePlanet2 = await getData(chopChop(charTwo.homePlanet)) 
        console.log("print this ", homePlanet.name);
        if(homePlanet.name === homePlanet2.name) {
            console.log(`print that they have the same homeplanet, ${homePlanet.name} = ${homePlanet2.name}`);
        }    
    }
    compareVehicles = async() => {
        // Fetch array of vehicle prices and array of vehicle objects
        let starShipArr = await fetchApiUrlArr(this.starships, "cost_in_credits")
        let vehicleArr = await fetchApiUrlArr(this.vehicles, "cost_in_credits")
        console.log("starShipArr most expensive starship", +getMaxValue(starShipArr[0]));
        console.log("starShipArr", starShipArr[1]);
        console.log("vehicleArr most expensive vehicle", +getMaxValue(vehicleArr[0]));
        console.log("vehicleArr", vehicleArr[1]);

        // Array consisting of the value of the most expensive starship & the value of the most expensive vehicle
        let arrStarVeh = [+getMaxValue(starShipArr[0]), +getMaxValue(vehicleArr[0])]
        console.log("arrStarVeh", arrStarVeh);
        // Returns value of the characters most expensive vehicle or starship
        let max = getMaxValue(arrStarVeh)
        console.log("max", max);
        if(max == 0) {
            console.log(`${this.name} vehicle/starship price is unknown.`);
        } else {
            if(arrStarVeh.indexOf(max) == 0) {
                // Returns the name of the determined most expensive starship
                let expVehicle = mostExpVeh(starShipArr[1], max)
                console.log(`${expVehicle} is ${this.name} most expensive starship.`);

            } else {
                // Returns the name of the determined most expensive vehicle
                let expVehicle = mostExpVeh(vehicleArr[1], max)
                console.log(`${expVehicle} is ${this.name} most expensive vehicle.`);
            }
        }
    }
}
// -------------------------------------------------------- Choose Character - Form Event Listener -----------------------------------------------------------

charForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let charInputArr = [charOneChoice.value, charTwoChoice.value]

    // Prevents user from comparing the same characters
    if(!duplicateChar) {
        compareBtn.classList.remove("hidden")
        charForm.classList.add("hidden")
        
        //todo! Brandon!!!! hur i helv??????t?????? funkar detta???
        // console.log("outside but before",charArr);
        charInputArr.forEach(char => {
            // Creates a new instance of Character prototype for each user input and adds to global array of characters
            loadCharacters(char).then(() => {
                
                // Finds the last added character instance of the global charArr and renders it to the DOM - without mutating the original array
                [...charArr].pop().renderCharacter()
                
            })
        })
        //todo! Brandon!!!! hur i helv??????t?????? funkar detta???
        console.log("outside",charArr);
    }
})

// -------------------------------------------------------- Initates the rendering of the list comparison between the characters -----------------------------------------------------------

let compareCharacter = () => {
    // Targets clicked button with display:none
    event.target.classList.add("hidden")

    charArr.forEach(obj => {
        
        let article = document.querySelector(`[data-character="${obj.name.toLowerCase().split(' ').join("-")}"]`)
        
        //todo! borde kanske g??ra om till redan existerande html d??r jag togglar hidden class kom jag p?? nu?
        obj.renderProperties(article)

    })
}

// -------------------------------------------------------- Creates new instance of character prototype-----------------------------------------------------------
let loadCharacters = async (charInput) => {
    //todo! error hantering - om karakt??ren ej finns
    //todo! dubbelkolla b??da om f??rsta och andra ej existerar
    //todo! error hantering - om anv. ej valt tv?? karakt??rer - 
    // try {
        route = "people/?"

        let params = new URLSearchParams({
            //todo! ta bort !== "any"
            ...(charInput != "" ? { search: charInput } : "")
        })
        console.log(`${API_BASE_URL}${route}${params}`);
        
        let charObj = await getData(route, params)

        //todo! bryt ut denna bit?
        // Destructuring the character object fetched from API
        let { name, gender, height, mass, hair_color, skin_color, eye_color, films, homeworld, vehicles, starships } = charObj.results[0];
        //todo! fixa dynamiskt namn?
        // Creates new Character instance with thee data from the character obj fetched from the API
        let charOneProto = new Character(name, gender, height, mass, hair_color, skin_color, eye_color, films, homeworld, vehicles, starships, name)
        charArr.push(charOneProto)
}

// -------------------------------------------------------- Informs user if they have choosen the same character -----------------------------------------------------------
charForm.addEventListener('change', (e) => {
    duplicateChar = false
    charOneChoice.classList.remove("error")
    charTwoChoice.classList.remove("error")
    errorDiv.innerText = ""

    if(charOneChoice.value === charTwoChoice.value) {
        // console.log("you have choosen the same character dummy");
        duplicateChar = true;

        errorDiv.innerText = "It is more fun if you don't compare the same character:)"
        charForm.prepend(errorDiv)
        charOneChoice.classList.add("error")
        charTwoChoice.classList.add("error")
    }
});
// Returns incoming url:s unique route
let chopChop =  url => {
    const [first, last] = url.split("api/");
    return last
}
// Returns array of asynchronously fulfilled objects & an array of the values of passed in obj.key
let fetchApiUrlArr = async (arr, key) => {
    let resArr = arr.map(elem => getData(chopChop(elem)));
    let dataArr = await Promise.all(resArr)
    return [dataArr.map(elem => elem[key]), dataArr]
}
// Returns the max value of passed in array or zero if array is empty or the value is "unknown"
let getMaxValue = (arr) => {
    // console.log("arr inside getMax before reduce", arr);
    if(arr.length == 0) {
        // console.log("empty arr");
        return 0
    } else {
        let max = arr.reduce((a, b) => Math.max(a, b));
        if(max == "unknown") {
            max = 0
        } 
        // console.log("max in get maxVal", +max);
        return +max
    }
}
// Returns the obj.name from the passed in array which cost_in_credits matches the max-value passed in
let mostExpVeh = (arr, max) => {
    // console.log("arr in mostExpVeh", arr);
    // console.log("max in mostExpVeh", max);
    return arr.find(obj => obj.cost_in_credits == max).name;
}