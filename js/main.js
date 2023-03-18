//! global variables
const url = "https://api.github.com/users/";
const inputGroup = document.getElementById("input-group")
const searchBar = document.getElementById("search-bar");
const searchBtn = document.querySelector(".fa-magnifying-glass")

//! api related processes
class GithubUserProfile{

  static userWrapper = document.createElement("div");

  static async showUserDataOnUI(userData) {
    this.userWrapper.className = "user";
    
    const userRepos = await this.catchRepos(userData);

    this.userWrapper.innerHTML = `
      <div class="user-info">
        <span id="title">@${userData.login}</span>
        <img id="user-img" src="${userData.avatar_url}">
        <span id="name">${userData.name}</span>
        <i class="fa-solid fa-location-dot">${userData.location}</i>
      </div>

      <table>
        <tr>
          <th>About him / her</th>
          <td>${userData.bio}</td>
        </tr>

        <tr>
          <th>Contact</th>
          <td><a class="contact" href="mailto:${userData.email}">Send mail</a></td>
        </tr>

        <tr>
          <th>See in details</th>
          <td><a href="${userData.html_url}">Access full profile</a></td>
        </tr>

        <tr>
          <th>Repos</th>
          <td>
            <ul>
              ${userRepos.map(repo => `<li><a href="${repo.html_url}">${repo.name}</a></li>`).join("")}
              <span><a href="${userData.html_url}?tab=repositories">See all repositories</a></span>
            </ul>
          </td>
        </tr>
      </table>
    `;
    document.body.appendChild(this.userWrapper);
  }

  static async catchRepos(userData) {
    try {
      const response = await fetch(userData.repos_url);
      const repos = await response.json();
      return repos.slice(0, 5);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static clearUserWrapper() {
    this.userWrapper.innerHTML = "";
  }

  static loadingCat(user) {
    this.userWrapper.className = "user";
    this.userWrapper.innerHTML = `
      <div class="user-info">
        <img id="user-img" src="images/loading.gif">
      </div>
    `;
    document.body.appendChild(this.userWrapper);
  }

  static errorCat(error) {
    this.userWrapper.className = "user";
    this.userWrapper.innerHTML = `
      <div class="user-info">
        <img id="user-img" src="images/notfound.gif">
        <p class="error-text">Oops!</br>There is no user that you have searched. Try again!</p>
      </div>
    `;
    document.body.appendChild(this.userWrapper);
  }
}

//! final function
async function getUser(username){
  try{
    const {data} = await axios(url + username);
    GithubUserProfile.loadingCat(data);
    setTimeout(() => {
      GithubUserProfile.clearUserWrapper();
      GithubUserProfile.showUserDataOnUI(data);
    }, 3000);
  } catch(err){
    GithubUserProfile.loadingCat(err);
    setTimeout(() => {
      GithubUserProfile.clearUserWrapper();
      GithubUserProfile.errorCat(err);
    }, 3000);
  }
}

//! events
// triggering query
searchBar.addEventListener("keypress", (e)=>{
  if(e.key === "Enter"){
    getUser(searchBar.value);
    searchBar.value = "";
  }
});
searchBtn.addEventListener("click",()=>{
  getUser(searchBar.value);
})


//searchbar animations
inputGroup.addEventListener("focusin",()=>{
  inputGroup.style.width = "25rem";
});
inputGroup.addEventListener("mouseenter",()=>{
    searchBtn.style.visibility = "visible";
})
inputGroup.addEventListener("mouseleave",()=>{
    searchBtn.style.visibility = "hidden";
    inputGroup.style.width = "20rem";
})
  

  
