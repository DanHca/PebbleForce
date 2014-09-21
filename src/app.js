// *  ************************************************************************************** FIRST LINE
// *  Salesforce1 AppExchange 'PebbleForce' code for the Pebble SmartWatch using Pebble.js
// *  See documentation and disclaimer that are on GitHub before use or Salesforce AppExchange
// *  Caution should be used since the application will have an ACCESS TOKEN to connect to
// *  your instance of Salesforce which should not be stored in the clear or in log files.
// *  **************************************************************************************
      var sf_instance = "https://na00.salesforce.com";   //The is what the Org ID or Salesforce Instance will look like
      var sf_owner_id = "001o00SAMPLE00DANH";            //this is a sample of the UUID of the Salesforce user (you)
      var sf_known = false;                              // used to track if the connection to SF is established
      // these are the two arrays to store all the values for the reports 
      var reportName = ["to Salesforce1","to manage OAuth","in the Pebble App"];
      var reportValue = ["Log In","on your phone","in SETTINGS"];
      var appName = [];
      var appTitle = [];
      var appSubTitle = [];
      var appId = [];            //The UUID for the App record in Salesforce

      // Rows to be define
      var currentApp = 0;        //The current App & Item selected the users has selected
      var currentItem = [[],[],[],[],[],[],[],[],[],[],[],[]];
      var rowCount = [];         //The number of rows in each App
      var rowMax = [[],[],[],[],[],[],[],[],[],[],[],[]];       //The total items in each row
      // Now define all the 3x3 arrays - [App,Row,Item] - for every data element loaded from Salesforce
      // rowId         = the Salesforce UUID for the record in the Pebble Row Object
      // rowTitle      = the Title to show for each item on each row on the watch screen
      // rowSubTitle   = the SubTitle for the above
      // rowAction     = what should happen when this specific item is selected on the watch
      // rowShortCode  = the code to be logged on a Post when the Pebble creates a new record in Salesforce
      // rowName       = the Salesforce Name (record Name) for this item, it will be logged in the Post record
      var rowId =      [ [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ]   ];
      var rowTitle =   [ [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ]   ];
      var rowSubTitle =[ [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ]   ];
      var rowAction =  [ [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ]   ];
      var rowShortCode =[[ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ]   ];
      var rowName =  [ [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ],
                         [ [],[],[],[],[],[],[],[],[],[] ]   ];

//Set up a global Access Token to store the response from Salesforce - so it is available easily
//If you are debugging your code, use the below as a sample fo what the token should look like
//You will need ot add your own debug statements since logging this information would be a security concern
var sf_access_token = "BEARER 00DG0000000jBCR!ARQ___sample_access_token_form_will_be_long___Z9Xx4VGP4DaN70_DanHca_on_GitHUB_susPIOEJJQKpVHEbZ1Ip";

// *  ***************************************************************************************
// *  ***************************************************************************************

//Build the Title Screen
var UI = require('ui');
var Settings = require('settings');
var main = new UI.Card({
  title: '  PebbleForce',
  body: 'This is an App that requires a Salesforce connection to work. Please see the software use statement in GitHub for this project. For details about this App, see the Salesforce AppExchange.',
  scrollable: true,
  style: 'large'
});
main.show();    //Show the screen now and let the body be updated as the ID is verified.
var cSuccess = new UI.Card();
var Vibe = require('ui/vibe');


//============================================================================================= Get Token from Memory
// See if there is a token stored in memory
//============================================================================================= Get Token from Memory
var getLogInFromMemory = function() {
  // Use 'localStorage' to make the data persistent so you can leave the app and return 
  // without login in every time.
  console.log('Getting details from memory - localStorage='+localStorage.saved);
  if (localStorage.saved=='true') {
      sf_access_token = localStorage.token;
      sf_owner_id = localStorage.owner ;
      sf_instance = localStorage.instance;
      sf_known = true;
      console.log("Login details retrieved.");
  }
  
  //Confirm the connection is still valid by getting the Salesforce ID
  var url = sf_instance.concat("/services/data/v24.0/chatter/users/me");
  try {
    var usf = new XMLHttpRequest();
  
    usf.open("GET", url, false);
    console.log("Vefifying the connection to Salesforce.");

    usf.setRequestHeader('Authorization', sf_access_token);
    usf.setRequestHeader('Content-Type', 'application/json');
    usf.onreadystatechange = function () {
    console.log("usf State Change at the check connection> " + JSON.stringify(usf.readyState) + " Status> "+JSON.stringify(usf.status));
      if (usf.readyState == 4 && usf.status == 200) {
          console.log("usf Check for user connection was successful.");
      } else {
        console.log("Did not get a proper successful response so assume the connection is timed out.");
        sf_known = false;        
      }
    };   
    usf.send(null);  //Sends the request to Salesforce.
  } catch(err) {
    console.log("Could not verify the SF connection or invalid OAuth result"); 
    sf_known = false;
    sf_access_token = "no access token - please log in";
    sf_owner_id = "no user identified";
    sf_instance = "not connected";
    localStorage.saved = false;
    localStorage.token = sf_access_token;
    localStorage.owner = sf_owner_id;
    localStorage.instance = sf_instance;
  }  
};
//============================================================================================= Get Token from Memory

console.log('Check Memory to see if the user is already logged in.');
getLogInFromMemory();
if (sf_known) {
  console.log('sf_known is True so update the status message on the watch.');
  main.body('Your connection to Salesforce has been verified. Click to load your Apps.');
} else {
  console.log('sf_known is False so update the status message on the watch.');
  main.body('Use the Pebble App on your phone and click on SETTINGS for this Pebble App.');
}
console.log('Check Memory done');

//Now show the App selection window when the middle 'select' button is clicke from the main window
main.on('click','select', function(e) {    
//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = Start the Salesforce Connection
// This is where the main part of the application start, with a request to get all the current
// applications can be recieved from Salesforce.
//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = Start the Salesforce Connection

main.body("Loading the PebbleForce Apps - this may take a few seconds.");
main.show();
Vibe.vibrate('short');
if (sf_known) {  //REST MAIN LOAD Make sure the user is known
  console.log("==========================REST Request==========================" );

  var restOutput = 0;
  //use the instance variable to build the REST API request and add the SOQL (SQL) query
  var url = sf_instance.concat("/services/data/v30.0/");
  try {
    //This is the REST call that gets the right fields for this user
    url = url.concat("query/?q=SELECT+Name,Pebble_App__c,AppTitle__c,SubTitle__c+from+Pebble_Pack__c+WHERE+Status__c='Active'+AND+(Pack_User__c=''+OR+Pack_User__c='"+sf_owner_id+"')+ORDER+BY+Priority__c");
    var csf = new XMLHttpRequest();
    console.log('Set the CSF');
    csf.open("GET", url, false);
    console.log('OPEN the CSF');
    csf.setRequestHeader('Authorization', sf_access_token);
    csf.setRequestHeader('Content-Type', 'application/json');
    //----------------------------------------------------------------------------------------- REST Response Handler
    // This is the function that will be called when the REST response is receive from Salesforce
    // It is responsible for parsing the data and storing it locally on the phone
    //----------------------------------------------------------------------------------------- REST Response Handler    
    csf.onreadystatechange = function() {
    console.log('CSF status = ' + csf.status);
    if (csf.readyState == 4 && csf.status == 200) {
            var JSONresponse = JSON.parse(csf.responseText);
            console.log('Parse CSF');          
            //Now build the menu with all the PebbleForce Apps      ======================== MENU ====================
            var menuPFapps = new UI.Menu();
            var ttlApps = JSONresponse.totalSize;
            console.log('Looping to build the menuPFapp - Number of Apps :' + ttlApps);
            for (var t = 0; t < ttlApps; t++) { 
              appName[t] = JSONresponse.records[t].Name;
              appId[t] = JSONresponse.records[t].Pebble_App__c ;
              appTitle[t] = JSONresponse.records[t].AppTitle__c;
              appSubTitle[t] = JSONresponse.records[t].SubTitle__c;              
              menuPFapps.item(0, t, { title: appTitle[t], subtitle: appSubTitle[t] });

              //Now load the details for that App into local memory for fast access
              loadAppDetails(t, appId[t]); 
            }  //end for t loop that build the menu
            
            //Now define what the Menu action will do
            menuPFapps.on('select', function(e) {
              console.log('Selected item on menuPFapps: ' + e.sectionIndex + ' ' + e.itemIndex);
              loadMenu(e.itemIndex);
            });
            menuPFapps.show();
      } else {
            console.log("csf.status message not reconized.");
            reportName[restOutput] = "Check your phone";
            reportValue[restOutput] = "No data received";
      }
    }; //End of the function call that is tracking the csf.onreadystatechange

  console.log('Send CSF now');   
  csf.send(null);  //Sends the request to Salesforce.
  console.log("__________________________REST Complete________________________" );
  console.log("Final csf status = "+csf.status);
  main.body('Click to reload the Apps.  If no Apps are loaded then try logging in again on the Pebble SETTINGS and also verify you have some Pebble Packs defined in Salesforce.');
  }
  catch(err) {
    console.log('Error in REST call.');
    main.body('Connection Error. Try loggin out and into Salesforce in the Pebble App unders SETTINGS.');
  }

} else {  //REST MAIN LOAD Clicked to load the PebbleForce apps but the users is not logged in yet so provide more details
  main.body("You MUST log in using the SETTINGS for the PebbleForce app listed in the MY PEBBLE area of the Pebble 'hello' app on your smartphone.  See the Salesforce AppExchange listing for PebbleForce for more details.");
  main.show();
}  
});

//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = Function Calls
// The rest of the code is additional function call that are invoked from the main program above
//= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = Funcation Calls


//============================================================================================= Load App Details
// Load the Apps
//============================================================================================= Load App Details
function loadAppDetails(loadAppIndex, loadAppId) {
  console.log("==========================loapAppDetails Request========================== loadAppIndex="+loadAppIndex);

  var restOutput = 0;
  var url = sf_instance.concat("/services/data/v30.0/");
  try {
    url = url.concat("query/?q=SELECT+Id,Name,Action__c,Line1__c,Line2__c,Priority__c,Row__c,Short_Code__c+FROM+Pebble_Row__c+WHERE+Pebble_App__c='"+loadAppId+"'+ORDER+BY+Sort_Order__c");
    var csf = new XMLHttpRequest();
    csf.open("GET", url, false);
    csf.setRequestHeader('Authorization', sf_access_token);
    csf.setRequestHeader('Content-Type', 'application/json');
    //----------------------------------------------------------------------------------------- REST Response Handler
    // This is the function that will be called when the REST response is receive from Salesforce
    // It is responsible for parsing the data and storing it locally on the phone
    //----------------------------------------------------------------------------------------- REST Response Handler    
    csf.onreadystatechange = function () {
    console.log('ROW status = ' + csf.status);
    if (csf.readyState == 4 && csf.status == 200) {    // request is complete and data was received.
            var StrResponse = JSON.stringify(csf.readyState);
            var JSONresponse = JSON.parse(csf.responseText);
            console.log('row.readyState is :'+StrResponse+' with status of '+JSON.stringify(csf.status));            
            
            //Now build the rows                                  ======================== ROW ====================
            var ttlElements = JSONresponse.totalSize;
            console.log('Number of Apps :' + ttlElements);
            var itemCount = 0;
            var crtRow = 0; //current Row
            var lastRow = JSONresponse.records[0].Row__c;
            console.log ('lastRow = ' + lastRow);
            rowMax[loadAppIndex][crtRow] = 1;
            for (var i = 0; i < ttlElements; i++) {
              //Now check if this item is part of the same row as last time
              //If it is different then store all the totals for this row and move to the next row.
              if (lastRow != JSONresponse.records[i].Row__c) {
                console.log('looping through the rows = ' + JSONresponse.records[i].Row__c);
                rowMax[loadAppIndex][crtRow] = itemCount-1;      //Store the total items in this row but remove the current item
                crtRow++;      //move to the next Row 
                itemCount = 0; //reset back to the first item for this row.
                lastRow = JSONresponse.records[i].Row__c;

              }
              console.log('Row Load = '+ i + ' which is itemCount ' + itemCount + ' ['+loadAppIndex+',0,' +itemCount + ']');
              rowTitle[loadAppIndex][crtRow][itemCount] = JSONresponse.records[i].Line1__c;
              rowSubTitle[loadAppIndex][crtRow][itemCount] = JSONresponse.records[i].Line2__c;
              rowAction[loadAppIndex][crtRow][itemCount] = JSONresponse.records[i].Action__c;
              rowShortCode[loadAppIndex][crtRow][itemCount] = JSONresponse.records[i].Short_Code__c;
              rowId[loadAppIndex][crtRow][itemCount] = JSONresponse.records[i].Id;
              rowName[loadAppIndex][crtRow][itemCount] = JSONresponse.records[i].Name;          
              itemCount++;      //Move to the next item for this Row
              console.log('Load Item done');     
              
            }  //end for i loop that built all the items in this row
            //Don't forget to store the last 'total items' and 'count' for the very last row of this App
            rowMax[loadAppIndex][crtRow] = itemCount-1; 
            rowCount[loadAppIndex] = crtRow;

            console.log(">>>>>>>>>>>>>>>>>>>>>>>END the ROW Data<<<<<<<<<<<<<<<<<<<<<<< loadAppIndex = " + loadAppIndex + ' rowCount = '+ rowCount[loadAppIndex]);
      } else {
            console.log("row.status message not reconized.");
            reportName[restOutput] = "Unknown App";
            reportValue[restOutput] = "No data received";

      } //End of if csf = 4 & 200 statement
  }; //End of the function call that is tracking the csf.onreadystatechange

  console.log('Send the CSF row now');
  csf.send(null);  //Sends the request to Salesforce.
  console.log("__________________________REST ROW Complete________________________" );
  console.log("csf status returned = "+csf.status);
  }
  catch(err) {
    console.log('****  ERROR ****      ERROR in REST while getting ROW        ****  ERROR ****');
  }

  
}
//============================================================================================= Load App Details

//============================================================================================= Load Meun Details
//============================================================================================= Load Meun Details
var loadMenu = function(m_index) {
	console.log("==========================Load Menu==========================" );
  console.log('m_index = ' + m_index);
  currentApp = m_index;
  
  var sfMenu = new UI.Menu();
  
  //Now put the Title and SubTitles into the menu
  for (var i = 0; i <= rowCount[m_index]; i++) {
    sfMenu.item(0, i, { title: rowTitle[m_index][i][0], subtitle: rowSubTitle[m_index][i][0] });
    currentItem[m_index][i] = 0;  //The current selected item is the first item in the array
  }
  sfMenu.show();
  
 //============================================================================================= Load Meun Details - CLICK
 // This code is to manage the SELECT of a specific row on the PebbleForce App.
  
  
        sfMenu.on('select', function(e) {
              console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>CLICK ' +  e.sectionIndex + ' ' + e.itemIndex + ' action: ' + rowAction[currentApp][e.itemIndex][currentItem[currentApp][e.itemIndex]] +' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
            var rA = rowAction[currentApp][e.itemIndex][currentItem[currentApp][e.itemIndex]];  //define row Action
            
            //If you have new actions you want to manage, the should be added here
            if (rA == "" || rA == null) {
              //Do nothing
              console.log("Action is blank or undefined so don't do anything");
            }
            else if (rA == "Cycle") {     
              console.log('sfMenu item: ' + e.sectionIndex + ' ' + e.itemIndex + 'for rowMax :'+rowMax[currentApp][e.itemIndex] + ' curApp = '+ currentApp + ' curItem = '+currentItem[currentApp][e.itemIndex]);
              currentItem[currentApp][e.itemIndex]++;
                
              if (currentItem[currentApp][e.itemIndex]>rowMax[currentApp][e.itemIndex]) {
                currentItem[currentApp][e.itemIndex] = 0;
                console.log('reached rowMax = ' +rowMax[currentApp][e.itemIndex] + ' so resetting to 0');
              }
              console.log('Showing '+currentApp+","+currentItem[currentApp][e.itemIndex]);
              sfMenu.item(e.sectionIndex, e.itemIndex, { title: rowTitle[currentApp][e.itemIndex][currentItem[currentApp][e.itemIndex]], subtitle: rowSubTitle[currentApp][e.itemIndex][currentItem[currentApp][e.itemIndex]]});              
            }
            //Only expecting Post, Chatter, Case but will hand anything and create a new record for future customization
            else {
              console.log('Create a new record in Salesforce Pebble_Post__c');
              var vRowCode = rA;
              var vShortCode = rA;
              console.log('rowCount = '+rowCount[currentApp]);
              for (var r=0;r<=rowCount[currentApp];r++){
                vRowCode = vRowCode.concat('-',rowName[currentApp][r][currentItem[currentApp][r]]);
                vShortCode = vShortCode.concat('-',rowShortCode[currentApp][r][currentItem[currentApp][r]]);
              }            
              
              cSuccess.title('Record Create');
              cSuccess.subtitle('Rqst Sent');
              cSuccess.body("The requested item was initiated and a record sent to 'Pebble Post' in Salesforce.  Click >BACK< to return to the main menu.");
              cSuccess.scrollable(true);
              cSuccess.show();

              // Send the Post requset to Salesforce to create the record in Pebble_Post__c
              // The Salesforce Apex Trigger will then initiate the action from the Pebble Post record
              // See the Chatter feed for the new record for any error messages from the Apex Trigger
              console.log('Call the newPost function');
              newPost(rA, rowId[currentApp][e.itemIndex][currentItem[currentApp][e.itemIndex]], vRowCode, vShortCode); 

            }
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>END CLICK<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        });
  //============================================================================================ Load Meun Details - CLICK
  
  console.log("__________________________Load Menu__________________________" );  
};
//============================================================================================= Load Menu Details



//============================================================================================= Create New Post
//============================================================================================= Create New Post
var newPost = function(np_Action, np_Initiated, np_Row, np_Short) {
	console.log("POST==========================new Post========================== Action__c = "+np_Action);

  var url = sf_instance.concat("/services/data/v30.0/sobjects/Pebble_Post__c/");
	var usf = new XMLHttpRequest();
  
	usf.open("POST", url, true);

	usf.setRequestHeader('Authorization', sf_access_token);
	usf.setRequestHeader('Content-Type', 'application/json');
	usf.onreadystatechange = function () {
    console.log("USF Response Update>>> State = "+JSON.stringify(usf.readyState)+ " Status = "+ JSON.stringify(usf.status)+" Error Message = "+JSON.stringify(usf.responseText.errors));
    var JSONresponse = JSON.parse(usf.responseText);
    //Verify the new record was created (status=201) then post to the Pebble screen
    if (usf.readyState == 4 && usf.status == 201) {
      console.log("USF Successful Update>>> State = "+JSON.stringify(usf.readyState)+ " Status = "+ JSON.stringify(usf.status)+" Message = "+JSON.stringify(usf.responseText.errors));
      cSuccess.body("Record successfully created.");
    }
  };
	//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
	//Ready to do more ... this is the line to add more data updates for the new record.
	//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>	

	var sfpackage = {"Pebble_App__c" : appId[currentApp], "Action__c": np_Action , "Watch_ID__c" : "Pebble", "Initiating_Row__c" : np_Initiated, "Row_Codes__c" : np_Row, "Short_Code__c" : np_Short};
  usf.send(JSON.stringify(sfpackage));
  console.log("__________________________new post__________________________" );  
  
};

//============================================================================================= Create New Post

//============================================================================================= Configuration Screen
// Here is the code that manages the open callback for the Salesforce Login and OAuth process
// The client_id is common for all Salesforce Orgs so this line does NOT need to change
// The redirect_uri is how the Salesforce OAuth page knows to send control back to the Pebble App on the phone
//============================================================================================= Configuration Screen
Settings.config(
  { url: 'https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9xOCXq4ID1uFyJvkJNKu5Anux281NUkPc5vR4RK.Nag9SkojiNS0us2fUJgTLVeSFwhFsqvCYNi08uEtG&redirect_uri=pebblejs%3A%2F%2Fclose'},
  function(e) {
    console.log('Executing the Salesforce OAuth on Phone');

  try {
    var oauthlist = e.response.split("&");
    var accesslist = oauthlist[0].split("=");
    sf_access_token = accesslist[1];
    // Now create the structure for all future calls ... needs to start with 'Bearer'
    var t_bearer = "Bearer ";
    sf_access_token = t_bearer.concat(sf_access_token);

    // The OAuth response also contains other valuable details to log, capture it now
    // The instance name is needed to direct all api connections to the right SF URL
    var instancelist = oauthlist[2].split("=");
    sf_instance = instancelist[1];
  
    // The Users' UUID is good to have but not used in this sample code.
    // You will need if you are creating records or want to get more details about the user.
    // Additionally you could get the refresh token to extend the connection if the token expires
    var ownerlist = oauthlist[3].split("/");
    sf_owner_id = ownerlist[5];
    console.log("Login Done.");
    sf_known = true;
    // Use 'localStorage' to make the data persistent so you can leave the app and return 
    // without login in every time.
    localStorage.saved = true;
    localStorage.token = sf_access_token;
    localStorage.owner = sf_owner_id;
    localStorage.instance = sf_instance;
  
    // It was a successful login so tell the watch to start the load process for first dashboard
    //var dict = {KEY_DASHBOARD : 0};
    //Pebble.sendAppMessage(dict);
    main.body('Your connection to Salesforce has been verified. Click to load your Apps.');
        
  }
  catch(err) {
    console.log("NOT LOGGED ON - Canceled or invalid OAuth result"); 
    sf_known = false;
    sf_access_token = "no access token - please log in";
    sf_owner_id = "no user identified";
    sf_instance = "not connected";
    localStorage.saved = false;
    localStorage.token = '';
    localStorage.owner = '';
    localStorage.instance = '';
  }
        
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log('PARSING FAILED');
      console.log(e.response);
      sf_known = false;
      localStorage.saved = false;
      main.body('Use the Pebble App on your phone and click on SETTINGS for this App.');
    }
  }
);
//============================================================================================= Configuration Screen
// *  ***************************************************************************************** LAST LINE