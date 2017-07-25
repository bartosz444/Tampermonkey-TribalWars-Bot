// ==UserScript==
// @name         Tribal wars
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tribal wars bot
// @author       Eric Kavalec
// @match        https://en94.tribalwars.net/*
// @grant        none
// ==/UserScript==

// Constants
const OVERVIEW_VIEW = "OVERVIEW_VIEW";
const HEADQUARTERS_VIEW = "HEADQUARTERS_VIEW";
const RALLY_POINT_VIEW = "RALLY_POINT_VIEW";
const ATTACK_CONFIRM_VIEW = "ATTACK_CONFIRM_VIEW";
const MIN_WAIT_TIME = 20000;
const MAX_WAIT_TIME = 40000;

// Setup:
// In tribal wars game settings: Disable 'Show village overview in a graphical format'
// In this file: replace with current world @match https://en94.tribalwars.net/*
// PHASE_1: Buildings
// PHASE_2: Buildings + Farming
const PHASE = "PHASE_2";
const WAIT_FOR_ORDER_BUILDINGS = false;
const FARM_COORDINATES = [
    '311|543', '312|542', '312|541', '313|540', // 0,0
    '309|541', // -1,0
    '309|537', // -1,1
    '310|537', '312|538', '313|538', '314|538', '314|536', // 0,1
    '315|537', '315|538', '315|539', '316|536', '317|536', '318|536', '319|536', '319|535', // 1,1
    '322|538', // 2,1
    '315|541', '315|544', /*'317|544',*/ '318|540', '318|543', '319|543', // 1,0
    '320|541', '320|542', '320|543', '320|544', '321|541', '322|540', '322|543', '323|541', '323|542', '324|541', '324|543', // 2,0
    '311|545', '311|549', '312|547', '313|548', '314|546',  // 0, -1
    '316|547', '316|548', '318|546', '319|545', // 1,-1
    '320|547', '322|547', '322|549', '323|545', '324|545', '324|546', // 2, -1
    '311|550', '311|551', /*'311|552',*/ '313|553', '313|554', // 0, -2
    '315|550', '315|551', '315|554', '316|551', '318|550', '318|551', '319|550', '319|554',  // 1, -2
    '320|554', '321|552', '321|554', '322|550', '322|553', '323|550', '323|554', '324|550'// 2, -2
];

const FARM_TROOP_SET = "FARM_TROOP_SET_3";
let farmTroopSets = {
    "FARM_TROOP_SET_1":{
        "spear" : 10,
        "sword" : 10
    },
    "FARM_TROOP_SET_2":{
        "spear" : 15,
        "axe" : 3
    },
    "FARM_TROOP_SET_3":{
        "lc" : 8
    }
};

(function() {
    'use strict';

    console.log("-- Tribal Wars script enabled --");

    if (PHASE == "PHASE_1"){
        executePhase1();
    }
    else if (PHASE == "PHASE_2"){
        executePhase2();
    }

})();

// Phase 1: Building
function executePhase1(){
    let currentView = getCurrentView();
    console.log(currentView);
    if (currentView == HEADQUARTERS_VIEW){
        setInterval(function(){
            // build next building if possible
            buildNextBuilding();
        }, 10000);
    }
    else if (currentView == OVERVIEW_VIEW){
        // Open headquarters view
        document.getElementById("l_main").children[0].children[0].click();
    }

}

// Phase 2: Farm
function executePhase2(){

    // TODO: Research axe

    let delay = Math.floor(Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME) + MIN_WAIT_TIME);

    // Process action
    let currentView = getCurrentView();
    console.log(currentView);
    setTimeout(function(){
        if (currentView == HEADQUARTERS_VIEW){

            // build next building if possible
            buildNextBuilding();

            // Open rally point view
            document.getElementById("main_buildrow_place").children[0].children[0].click();

        }
        else if (currentView == RALLY_POINT_VIEW){

            // Send out farm attacks
            sendFarmAttacks();

        }
        else if (currentView == OVERVIEW_VIEW){
            // Open headquarters view
            document.getElementById("l_main").children[0].children[0].click();
        }
        else if (currentView == ATTACK_CONFIRM_VIEW){
            document.getElementById("troop_confirm_go").click();
        }
    }, delay);
}

function getCurrentView(){
    let currentUrl = window.location.href;
    if (currentUrl.endsWith('overview')){
        return OVERVIEW_VIEW;
    }
    else if (currentUrl.endsWith('main')){
        return HEADQUARTERS_VIEW;
    }
    else if (currentUrl.endsWith('place')){
        return RALLY_POINT_VIEW;
    }
    else if (currentUrl.endsWith('confirm')){
        return ATTACK_CONFIRM_VIEW;
    }
}

function buildNextBuilding(){
    let nextBuildingElement = getNextBuildingElement();
    if (nextBuildingElement !== undefined){
        nextBuildingElement.click();
        console.log("Clicked on " + nextBuildingElement);
    }
}

function getNextBuildingElement() {
    let buildableBuildings = document.getElementsByClassName("btn btn-build");
    let buildingElementsQueue = getBuildingElementsQueue();
    let found;
    while(found === undefined && buildingElementsQueue.length > 0){
        var next = buildingElementsQueue.shift();
        if (buildableBuildings.hasOwnProperty(next)){
            let nextBuilding = document.getElementById(next);
            var isVisible = nextBuilding.offsetWidth > 0 || nextBuilding.offsetHeight > 0;
            if (isVisible){
                found = nextBuilding;
            }
            if (WAIT_FOR_ORDER_BUILDINGS){
                break;
            }
        }
    }
    return found;
}


function sendFarmAttacks(){

    // check if enough available troops for selected FARM_TROOP_SET
    // and get inputs

    let availableInputs = getAvailableInputs();
    if (availableInputs === undefined){
        console.log("Not enough troops available");

        // Open overview view
        goToOverviewViewFromRallyPointView();

        return;
    }

    // get list of currently attacking villages
    let currentlyAttackingCoordinates = getCurrentlyAttackingCoordinates();

    // chose a farm that is not being attacked
    let choice = Math.floor(Math.random() * FARM_COORDINATES.length);

    for (let i = 0; i < FARM_COORDINATES.length; i++){

        if (choice >= FARM_COORDINATES.length){
            choice -= FARM_COORDINATES.length;
        }

        if (!currentlyAttackingCoordinates.includes(FARM_COORDINATES[choice])){
            sendAttackToCoordinate(FARM_COORDINATES[choice], availableInputs);
            return;
        }
        choice++;

    }
    // In the case where not enough farms were identified for
    // the amount of troops available
    // Open overview view
    goToOverviewViewFromRallyPointView();
}

function goToOverviewViewFromRallyPointView(){
    document.getElementById("menu_row").children[1].children[0].click();
}

function sendAttackToCoordinate(coordinates, inputAmounts){

    console.log("Sending attack to: " + coordinates);

    // enter values into troops inputs
    for (var prop in inputAmounts) {
        inputAmounts[prop].input.value = inputAmounts[prop].amount;
    }

    // enter coordinates into coordinates input
    let coordinatesInput = document.getElementById("place_target").children[1];
    coordinatesInput.value = coordinates;

    // press attack button
    document.getElementById("target_attack").click();
}

function getAvailableInputs(){

    let availableInputs = {};

    // get current troop set
    let farmTroopSet = farmTroopSets[FARM_TROOP_SET];

    let currentInput;
    let currentInputAvailableCount;
    let availableInputObject;

    // spear
    if (farmTroopSet.spear !== undefined){
        let currentInput = document.getElementById("unit_input_spear");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.spear > currentInputAvailableCount){
            return;
        }
        let availableInputObject = {
            "input" : currentInput,
            "amount": farmTroopSet.spear
        };
        availableInputs.spear = availableInputObject;
    }

    // sword
    if (farmTroopSet.sword !== undefined){
        let currentInput = document.getElementById("unit_input_sword");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.sword > currentInputAvailableCount){
            return;
        }
        let availableInputObject = {
            "input" : currentInput,
            "amount": farmTroopSet.sword
        };
        availableInputs.sword = availableInputObject;
    }

    // axe
    if (farmTroopSet.axe !== undefined){
        let currentInput = document.getElementById("unit_input_axe");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.axe > currentInputAvailableCount){
            return;
        }
        let availableInputObject = {
            "input" : currentInput,
            "amount": farmTroopSet.axe
        };
        availableInputs.axe = availableInputObject;
    }

    // lc
    if (farmTroopSet.lc !== undefined){
        let currentInput = document.getElementById("unit_input_light");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.lc > currentInputAvailableCount){
            return;
        }
        let availableInputObject = {
            "input" : currentInput,
            "amount": farmTroopSet.lc
        };
        availableInputs.lc = availableInputObject;
    }

    return availableInputs;
}

function getCurrentlyAttackingCoordinates(){
    let currentlyAttackingElements = document.getElementsByClassName("quickedit-label");
    let currentlyAttackingCoordinates = [];

    for (var i = 0, len = currentlyAttackingElements.length; i < len; i++) {
        let coordinatesString =
            currentlyAttackingElements[i].innerHTML.split(")")[0].split("(")[1];
        currentlyAttackingCoordinates.push(coordinatesString);
    }

    return currentlyAttackingCoordinates;
}

function getBuildingElementsQueue() {
    var queue = [];
    // https://forum.tribalwars.us/index.php?threads/start-up-guide-by-purple-predator.224/
    // Build Clay 1
    queue.push("main_buildlink_stone_1");
    // Build Wood 1
    queue.push("main_buildlink_wood_1");
    // Build Iron 1
    queue.push("main_buildlink_iron_1");
    // Build Clay 2
    queue.push("main_buildlink_stone_2");
    // Build Wood 2
    queue.push("main_buildlink_wood_2");
    // Build Clay 3
    queue.push("main_buildlink_stone_3");
    // Build Wood 3
    queue.push("main_buildlink_wood_3");
    // Build Iron 2
    queue.push("main_buildlink_iron_2");
    // Build Clay 4
    queue.push("main_buildlink_stone_4");
    // Build Clay 5
    queue.push("main_buildlink_stone_5");
    // Build Wood 4
    queue.push("main_buildlink_wood_4");
    // Build Wood 5
    queue.push("main_buildlink_wood_5");
    // Build Wood 6
    queue.push("main_buildlink_wood_6");
    // Build Wood 7
    queue.push("main_buildlink_wood_7");
    // Build HQ 2
    queue.push("main_buildlink_main_2");
    // Build HQ 3
    queue.push("main_buildlink_main_3");
    // Build Barracks 1
    queue.push("main_buildlink_barracks_1");
    // Build Wood 8
    queue.push("main_buildlink_wood_8");
    // Build Warehouse 2
    queue.push("main_buildlink_storage_2");
    // Build Market 1
    queue.push("main_buildlink_market_1");
    // Build Wood 9
    queue.push("main_buildlink_wood_9");
    // Build Warehouse 3
    queue.push("main_buildlink_storage_3");
    // Build Wood 10
    queue.push("main_buildlink_wood_10");
    // Build Clay 6
    queue.push("main_buildlink_stone_6");
    // Build Market 2
    queue.push("main_buildlink_market_2");
    // Build Clay 7
    queue.push("main_buildlink_stone_7");
    // Build Iron 3
    queue.push("main_buildlink_iron_3");
    // Build HQ 4
    queue.push("main_buildlink_main_4");
    // Build HQ 5
    queue.push("main_buildlink_main_5");
    // Build Smithy 1
    queue.push("main_buildlink_smith_1");
    // Build Smithy 2
    queue.push("main_buildlink_smith_2");
    // Build Iron 4
    queue.push("main_buildlink_iron_4");
    // Build Iron 5
    queue.push("main_buildlink_iron_5");
    // Build Market 3
    queue.push("main_buildlink_market_3");
    // Build Iron 6
    queue.push("main_buildlink_iron_6");
    // Build Iron 7
    queue.push("main_buildlink_iron_7");
    // Build Farm 2
    queue.push("main_buildlink_farm_2");
    // Build Farm 3
    queue.push("main_buildlink_farm_3");
    // Build Warehouse 3
    queue.push("main_buildlink_storage_3");
    // Build Farm 4
    queue.push("main_buildlink_farm_4");
    // Build Warehouse 4
    queue.push("main_buildlink_storage_4");
    // Build Barracks 2
    queue.push("main_buildlink_barracks_2");
    // Build Barracks 3
    queue.push("main_buildlink_barracks_3");
    // Build Barracks 4
    queue.push("main_buildlink_barracks_4");
    // Build Barracks 5
    queue.push("main_buildlink_barracks_5");
    // Build HQ 6
    queue.push("main_buildlink_main_6");
    // Build HQ 7
    queue.push("main_buildlink_main_7");
    // Build Farm 5
    queue.push("main_buildlink_farm_5");
    // Build Warehouse 5
    queue.push("main_buildlink_storage_5");
    // Build Smithy 3
    queue.push("main_buildlink_smith_3");
    // Build HQ 8
    queue.push("main_buildlink_main_8");
    // Build HQ 9
    queue.push("main_buildlink_main_9");
    // Build HQ 10
    queue.push("main_buildlink_main_10");
    // Build Smithy 4
    queue.push("main_buildlink_smith_4");
    // Build Farm 6
    queue.push("main_buildlink_farm_6");
    // Build Warehouse 6
    queue.push("main_buildlink_storage_6");
    // Build Smithy 5
    queue.push("main_buildlink_smith_5");
    // Build Iron 8
    queue.push("main_buildlink_iron_8");
    // Build Iron 9
    queue.push("main_buildlink_iron_9");
    // Build Iron 10
    queue.push("main_buildlink_iron_10");
    // Build Stable 1
    queue.push("main_buildlink_stable_1");
    // Build Stable 2
    queue.push("main_buildlink_stable_2");
    // Build Stable 3
    queue.push("main_buildlink_stable_3");
    // Build Wall 1
    queue.push("main_buildlink_wall_1");
    // TODO research LC
    // TODO recruit LC
    queue.push("main_buildlink_stone_8");
    queue.push("main_buildlink_stone_9");
    queue.push("main_buildlink_storage_7");
    queue.push("main_buildlink_farm_7");
    queue.push("main_buildlink_market_4");
    queue.push("main_buildlink_market_5");
    queue.push("main_buildlink_barracks_6");
    queue.push("main_buildlink_barracks_7");
    queue.push("main_buildlink_iron_11");
    queue.push("main_buildlink_iron_12");
    queue.push("main_buildlink_iron_13");
    queue.push("main_buildlink_farm_8");
    queue.push("main_buildlink_farm_9");
    queue.push("main_buildlink_iron_14");
    queue.push("main_buildlink_iron_15");
    queue.push("main_buildlink_stone_10");
    queue.push("main_buildlink_stone_11");
    queue.push("main_buildlink_storage_8");
    queue.push("main_buildlink_farm_10");
    queue.push("main_buildlink_wood_11");
    queue.push("main_buildlink_wood_12");
    queue.push("main_buildlink_wood_13");
    queue.push("main_buildlink_main_11");
    queue.push("main_buildlink_main_12");
    queue.push("main_buildlink_farm_11");
    queue.push("main_buildlink_farm_12");
    queue.push("main_buildlink_farm_13");
    queue.push("main_buildlink_storage_9");
    queue.push("main_buildlink_iron_16");
    queue.push("main_buildlink_stone_12");
    queue.push("main_buildlink_stone_13");
    queue.push("main_buildlink_stone_14");
    queue.push("main_buildlink_wood_14");
    queue.push("main_buildlink_wood_15");
    queue.push("main_buildlink_stone_15");
    queue.push("main_buildlink_wall_2");
    queue.push("main_buildlink_wall_3");
    queue.push("main_buildlink_wall_4");
    queue.push("main_buildlink_wall_5");
    queue.push("main_buildlink_wall_6");
    queue.push("main_buildlink_wall_7");
    queue.push("main_buildlink_wall_8");
    queue.push("main_buildlink_storage_10");
    queue.push("main_buildlink_wall_9");
    queue.push("main_buildlink_wall_10");
    queue.push("main_buildlink_stable_4");
    queue.push("main_buildlink_stable_5");
    queue.push("main_buildlink_main_13");
    queue.push("main_buildlink_main_14");
    queue.push("main_buildlink_main_15");
    queue.push("main_buildlink_wood_16");
    queue.push("main_buildlink_stone_16");
    queue.push("main_buildlink_storage_11");
    queue.push("main_buildlink_storage_12");
    queue.push("main_buildlink_storage_13");
    queue.push("main_buildlink_storage_14");
    queue.push("main_buildlink_farm_14");
    queue.push("main_buildlink_farm_15");
    queue.push("main_buildlink_farm_16");
    queue.push("main_buildlink_wood_17");
    queue.push("main_buildlink_stone_17");
    queue.push("main_buildlink_iron_17");
    queue.push("main_buildlink_storage_15");
    queue.push("main_buildlink_wood_18");
    queue.push("main_buildlink_stone_18");
    queue.push("main_buildlink_iron_18");
    queue.push("main_buildlink_storage_16");

    /////////
    queue.push("main_buildlink_storage_17");
    queue.push("main_buildlink_storage_18");
    queue.push("main_buildlink_main_16");
    queue.push("main_buildlink_main_17");
    queue.push("main_buildlink_main_18");
    queue.push("main_buildlink_main_19");
    queue.push("main_buildlink_main_20");
    queue.push("main_buildlink_farm_17");
    queue.push("main_buildlink_farm_18");
    queue.push("main_buildlink_farm_19");
    queue.push("main_buildlink_farm_20");
    queue.push("main_buildlink_wood_19");
    queue.push("main_buildlink_wood_20");
    queue.push("main_buildlink_stone_19");
    queue.push("main_buildlink_stone_20");
    queue.push("main_buildlink_iron_19");
    queue.push("main_buildlink_iron_20");
    queue.push("main_buildlink_stable_6");
    queue.push("main_buildlink_stable_7");
    queue.push("main_buildlink_stable_8");
    queue.push("main_buildlink_stable_9");
    queue.push("main_buildlink_stable_10");

    return queue;
}