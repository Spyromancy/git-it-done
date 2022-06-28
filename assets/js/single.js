var issueContainerEl = document.querySelector("#issues-container");

function getRepoIssues(repo) {
    var apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;
    fetch(apiUrl).then(function(response){
        // request was successful
        if(response.ok){
            response.json().then(function(data){
                displayIssues(data);
            });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
}

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
}


getRepoIssues("facebook/react")