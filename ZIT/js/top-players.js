//ZDROJE PRO PRACI S API: https://osu.ppy.sh/docs/#registering-an-oauth-application

const clientID = 75410
const clientSecret = "O1QHdnVS8hYr2EjUq77EQMcFlaJokggDYgC7CiyU";
//const proxyKey = "a55740f4";

async function getTop(mod) {
    const tokenUrl = "https://corsproxy.io/?key=" + proxyKey +"&url=" + encodeURIComponent("https://osu.ppy.sh/oauth/token");
    const tokenData = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            client_id : clientID,
            client_secret : clientSecret,
            grant_type : "client_credentials",
            scope : "public"
        })
    })
    .then(response => response.json());
    const accessToken = tokenData.access_token; 
    let rankUrl = "";
    let playerList = "";
    
    switch(mod) {
        case "g":
            rankUrl = "https://osu.ppy.sh/api/v2/rankings/osu/performance";
            playerList = "globalList"
            break;
        case "l":
            rankUrl = "https://osu.ppy.sh/api/v2/rankings/osu/performance?country=CZ";
            playerList = "localList"
            break;
    }
    const rankData = await fetch("https://corsproxy.io/?key=" + proxyKey +"&url=" + encodeURIComponent(rankUrl), {
        headers: {
            "Accept" : "application/json",
            "Authorization" : 'Bearer ' + accessToken
        }
    })
    .then(response => response.json());

    const top10 = rankData.ranking.slice(0, 10).map((item, index) => ({
        avatar: item.user.avatar_url,
        username: item.user.username,
        rank: index + 1,
        pp: Math.round(item.pp),
        profile: "https://osu.ppy.sh/users/" + item.user.id
    }));

    //vykreslovani do html
    const list = document.getElementById(playerList);
    for(const topPlayer of top10) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="player-rank">#${topPlayer.rank}</td>
          <td>
            <a href="${topPlayer.profile}" target="_blank" class="player-link">
              <img src="${topPlayer.avatar}" alt="${topPlayer.username}" class="player-avatar">
              <span class="player-name">${topPlayer.username}</span>
            </a>
          </td>
          <td class="player-pp">${topPlayer.pp} pp</td>`;

        list.appendChild(tr);
    }

}
getTop("g");
getTop("l");

