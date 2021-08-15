

let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request=require("request");
let cheerio=require("cheerio");

let fs=require("fs");
const { get } = require("cheerio/lib/api/traversing");
request(url,cb);
function cb(error,response,html){
    if(error){

        console.log(error);
    }
    else if(response.statusCode==404)
     {
    console.log("page  not found");
    
     }
    
     else{
    //console.log(html);
    
    moveToAllMatchPage(html);
     }
    }
function moveToAllMatchPage(html){

let searchTool=cheerio.load(html);
let aElem=searchTool('a[data-hover ="Fixtures and Results"]');
let link=aElem.attr("href");
let fullLink=`https://www.espncricinfo.com${link}`;
//console.log(fullLink);
//here we getting new link now we are send request on that page and then extract data from on that page
request(fullLink,getAllResult);

}
function getAllResult(error,response,html){
    if(error){

        console.log(error);
    }
    else if(response.statusCode==404)
     {
    console.log("page  not found");
    
     }
    
     else{
  //  console.log(html);
    
    getAllMatchScoreCard(html);
     }

}

function getAllMatchScoreCard(html){
    let searchTool2=cheerio.load(html);
    //here its had so many data so thats why u should to create an loop
    let arrayData=searchTool2('a[data-hover="Scorecard"]');
    for(let i=0;i<arrayData.length;i++){
let aElement=searchTool2(arrayData[i]);
let link=aElement.attr("href");
//console.log(link);
let fullMatchResLink=`https://www.espncricinfo.com${link}`
console.log(fullMatchResLink);
request(fullMatchResLink,getTeamPlayerName);    


}

}
function getTeamPlayerName(error,response,html){
    if(error){

        console.log(error);
    }
    else if(response.statusCode==404)
     {
    console.log("page  not found");
    
     }
    
     else{
//    console.log(html);
    
    getData(html);
     }

}
function getData(html){
    let searchTool3=cheerio.load(html);
    //here its had so many data so thats why u should to create an loop
    let arrayData=searchTool3(".Collapsible");
    for(let i=0;i<arrayData.length;i++){
 let innnigs=searchTool3(arrayData[i]).find("h5");
  let teamInnings=innnigs.text();
 teamInnings=teamInnings.split("INNINGS")[0];


  console.log(teamInnings);


let TeamPlayerName=searchTool3(arrayData[i]).find(".table.batsman tbody tr");
console.log(TeamPlayerName.length);
for(let j=0;j<TeamPlayerName.length;j++){
    let playerCol=searchTool3(TeamPlayerName[j]).find("td");
//console.log(playerCol.length)
if(playerCol.length==8){
    let name=searchTool3(playerCol[0]).text();
console.log(name);
}

}
console.log("`````````````````````");
  //now create two html file
  //fs.writeFileSync(`innings${i+1}.html`,innnigs);
}


}



// }
// let anchorrep=searchTool('a[data-hover="View All Results"]')
// let link=anchorrep.attr("href");
// let fm=`https://www.espncricinfo.com${link}`;
// console.log(fm);
// request(fm,cb2);

// }
// function cb2(error,response,html){
//     if(error){

//         console.log(error);
//     }
//     else if(response.statusCode==404)
//      {
//     console.log("page  not found");
    
//      }
    
//      else{
//     console.log(html);
//     getAllScoreCard(html);
    
//      }
//     }
    
// function getAllScoreCard(html){
// let searchTool=cheerio.load(html);
// let add=searchTool("a[data-hover='Scorecard']")
// for)

// }

    