# Tampermonkey-TribalWars-Bot
Tampermonkey script for Tribal Wars 1

## Requirements

1. Google Chrome
[Google Chrome download link](https://www.google.com/chrome/browser/desktop/index.html "Google Chrome download link")

2. Tampermonkey
Tampermonkey is a userscript manager for google chrome
[Tampermonkey download link](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en "Tampermonkey download link")

3. A Tribal Wars 1 account
[Tribal wars 1](https://www.tribalwars.net/ "Tribal wars 1")

## Setup  
1. In tribal wars game settings:  
Disable 'Show village overview in a graphical format'  

2. In the TamermonkeyTribalWarsBot.js file of this repository, on line 7 (@match https://enXX.tribalwars.net/*):  
Replace 'XX' with your current world (Example for world 94: @match https://en94.tribalwars.net/*)  

3. In the TamermonkeyTribalWarsBot.js file of this repository, between lines 11 and 42 (setup section):  
You can choose your preferences for the bot.  

4. Copy paste the content of your TamermonkeyTribalWarsBot.js file into a new Tampermonkey script.  

## Notices  
1. Sometimes when you log in you get to the "intro" page instead of the "overview" page. Just go to the regular overview page and the bot will work.  

2. This bot does not try to circumvent Tribal Wars bot protection startegies. Use at your own risk.  