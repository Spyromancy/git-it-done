var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTermEl = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

function formSubmitHandler(event){
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();

    if(username){
        getUserRepos(username);
        nameInputEl.value="";
    } else {
        alert("Please enter a GitHub username");
    }
}

function getUserRepos(user) {
    // format the github api url
    var apiUrl = `https://api.github.com/users/${user}/repos`;

    // make a request to the url
    fetch(apiUrl)
        .then(function(response){
            // if request was successful
            if(response.ok){
                response.json().then(function(data){
                    displayRepos(data,user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
};

function displayRepos(repos, searchTerm) {
    // clear old content
    repoContainerEl.textContent= "";
    repoSearchTermEl.textContent= searchTerm;

    // check if api returned any repos
    if(repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // loop over repos
    for(var item of repos){
        // format repo name
        var repoName = item.owner.login+"/"+item.name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href",`./single-repo.html?repo=${repoName}`);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if(item.open_issues_count) { //isn't > 0 redundant?
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + item.open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class= 'fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }
};

function getFeaturedRepos(language){
    var apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;
    
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        }
        else{
            alert("Error: GitHub User Not Found");
        }
    });
};

function buttonClickHandler(event){
    var language = event.target.getAttribute("data-language");
    if(language){
        getFeaturedRepos(language);
        repoContainerEl.textContent = "";
    }
    
}

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click",buttonClickHandler);