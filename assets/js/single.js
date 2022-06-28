var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");


function getRepoIssues(repo) {
    var apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;
    fetch(apiUrl).then(function(response){
        // request was successful
        if(response.ok){
            response.json().then(function(data){
                displayIssues(data);

                // check if api has paginated issues
                if(response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html")
        }
    });
};

function displayIssues(issues){
    if(issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for(var issue of issues){
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-spacepbetween align-center";
        issueEl.setAttribute("href", issue.html_url);
        issueEl.setAttribute("target","_blank");

        // create a span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issue.title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual isse or a pull request
        if(issue.pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

function displayWarning(repo) {
    // add text to warning container
    limitWarningEl.textContent = "You can find more than 30 issues at ";
    
    var linkEl = document.createElement("a");
    linkEl.textContent = "The Original Repo on GitHub.com";
    linkEl.setAttribute("href",`https://github.com/${repo}/issues`);
    linkEl.setAttribute("target","_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

function getRepoName() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if(repoName){
        // display repo name on the page
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    }
    else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};

getRepoName();