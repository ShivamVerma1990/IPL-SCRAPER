let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request=require("request");
let cheerio=require("cheerio");
let path=require("path");
let xlsx=require("xlsx");
let fs=require("fs");

let arr=[];
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
    //here its had so many data so that's why u should to create an loop
    let arrayData=searchTool3(".Collapsible");
    for(let i=0;i<arrayData.length;i++){
 let innnigs=searchTool3(arrayData[i]).find("h5");
  let teamName=innnigs.text();
 teamName=teamName.split("INNINGS")[0];
//teamInnings=teamInnings.trim();
teamName=teamName.trim();
  //console.log(teamInnings);
let TeamPlayerName=searchTool3(arrayData[i]).find(".table.batsman tbody tr");
console.log(TeamPlayerName.length);
for(let j=0;j<TeamPlayerName.length;j++){
    let playerCol=searchTool3(TeamPlayerName[j]).find("td");
//console.log(playerCol.length)
if(playerCol.length==8){
    let name=searchTool3(playerCol[0]).text();
let ball=searchTool3(playerCol[3]).text();

let fours=searchTool3(playerCol[5]).text();

let six=searchTool3(playerCol[6]).text();

let runs=searchTool3(playerCol[2]).text();
console.log(name, "played for", teamName, "scored", runs, "in", ball, "with ", fours, "fours and ", six, "sixes");

//create funtion 
processData(name,teamName,runs,ball,fours,six);
}

}
console.log("`````````````````````");
  //now create two html file
  //fs.writeFileSync(`innings${i+1}.html`,innnigs);
}


}
function processData(name,teamName,runs,ball,fours,six){


//step 1 create an object for Team
let obj={
    name,
    teamName,
    runs,
    ball,
    fours,
    six
}

    //step 2 create teamname folder

let teamNameDir=path.join(__dirname,teamName);
//now that is this folder already exist or not if not then create this folder otherwise not create
if(fs.existsSync(teamNameDir)==false){
    fs.mkdirSync(teamNameDir);
}
//step 3 now we create player name dir and this dir type is json so here we perform json opretion for reading or writing

let TeamPlayerNameDir=path.join(teamNameDir,name+".xlsx");//now store data into xlsx file
let playerArray=[];
//now here we check that is this file data have first time entery then push this data or not if its 2nd time entery then read data from this file in json format and then push 
//and for saving this data we perform write operation
if(fs.existsSync(TeamPlayerNameDir)==false){
  playerArray.push(obj);

}
else{
    //if exist then read contant 
   //this for reading data into file format
    //  playerArray=getContant(TeamPlayerNameDir);
 //this for reading data into xlsx format
    playerArray=excelReader(TeamPlayerNameDir,name);
    playerArray.push(obj);

}
//now save its data in file
//writeJsonData(TeamPlayerNameDir,playerArray);
//now save its data in xlsx
excelWriter(TeamPlayerNameDir,playerArray,name);


}

///////////////////////read and write data in xlsx format/////////////////////////////
function excelWriter(filePath, json, sheetName) {
    // workbook create
    let newWB = xlsx.utils.book_new();
    // worksheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // excel file create 
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    // player workbook
    let wb = xlsx.readFile(filePath);
    // get data from a particular sheet in that wb
    let excelData = wb.Sheets[sheetName];
    // sheet to json 
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

























//////////////////not usefull/////////////////////////////////////////// for read and write data in json format////////////
// function getContant(TeamPlayerNameDir){
// let contant= fs.readFileSync(TeamPlayerNameDir);//data will be read in json format
// return JSON.parse(contant);
// }
// function writeJsonData(TeamPlayerNameDir,contant){
//     let jsonData=JSON.stringify(contant);
//     fs.writeFileSync(TeamPlayerNameDir,jsonData);
// }



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

    