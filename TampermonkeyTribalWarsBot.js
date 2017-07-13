// ==UserScript==
// @name         Tribal wars
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Tribal wars bot
// @author       E.K.
// @match        https://en94.tribalwars.net/*
// @grant        none
// ==/UserScript==

// Constants
const OVERVIEW_VIEW = "OVERVIEW_VIEW";
const HEADQUARTERS_VIEW = "HEADQUARTERS_VIEW";
const RALLY_POINT_VIEW = "RALLY_POINT_VIEW";

// Setup:
// In tribal wars game settings: Disable 'Show village overview in a graphical format'
// In this file: replace with current world @match https://en94.tribalwars.net/*
const PHASE = "1";

(function() {
    'use strict';

    console.log("-- Tribal Wars script enabled --");

    if (PHASE == 1){
        executePhase1();
    }
    else if (PHASE == 2){
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

    let delay = Math.floor(Math.random() * 50000) + 30000;
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
            // TODO: Farm villages
            // Open overview view
            document.getElementsByClassName("nowrap tooltip-delayed")[0].click();
        }
        else if (currentView == OVERVIEW_VIEW){
            // Open headquarters view
            document.getElementById("l_main").children[0].children[0].click();
        }
    }, delay);
}

function getCurrentView(){
    let currentUrl = window.location.href;
    if (currentUrl.endsWith('overview')){
        return OVERVIEW_VIEW;
    }else if (currentUrl.endsWith('main')){
        return HEADQUARTERS_VIEW;
    }else if (currentUrl.endsWith('place')){
        return RALLY_POINT_VIEW;
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
            // prevents from not waiting until next is available
            break;
        }
    }
    return found;
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

    // TODO
    // Build Stable 1
    // Build Stable 2
    // Build Stable 3
    // Build Wall 1

    return queue;
}