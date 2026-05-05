# FarmRPG HUD
Displays a customizable HUD at the bottom of the screen with live inventory counts for relevant items and a timer for active meals. Tap and hold (mobile) or middle-click (desktop) to perform a configurable Quick Action (Use, Sell, Craft, or Send). 


- **Fully supports mobile!**
- Supports both light and dark modes
- Automatically simulates craftworks whenever applicable
    - Requires `Iron Depot` perk from farm supply shop to function properly


Click on the "HUD" button next to the silver at the bottom to toggle it on and off. Items displayed on the HUD will change whenever you: 
- Visit an exploration zone
- Visit a fishing zone
- Visit the wheel page
- Tap on a chest in the locksmith page
- Activate a loadout (middle-click or tap and hold the HUD toggle button)

You can tap and hold for 0.5s (mobile) or middle-click (desktop) HUD items to perform a customizable Quick Action. These actions can be configured by visiting the item's detail page. The actions can be:
- Sell
- Use (Apple, Orange Juice, Meals)
- Send (To a townsfolk)
- Craft (Also adds the resulting item to the HUD)

You can perform a Quick Action on the HUD toggle button to edit the script's settings or open the loadouts menu.


### Craftworks Simulation
As you gain items it will automatically run a simulation of your current craftworks items to keep your inventory in sync. It also simulates your production buildings to maintain accuracy. If this feature causes issues, it can be turned off in the script settings. 

Unfortunately since the game uses stochastic rounding, there's no way to simulate the crafts with 100% accuracy causing the inventory to sometimes go out of sync. When it happens, you can click the refresh button to sync the inventory again. Setting a reserve amount for such items can help work around the errors.


Some other QoL features:
- Shows crop inventory for selected seed on Farm page
- Groups the totals from harvest logs by days in Farm Info page
- Exploration/fishing shortcut at the bottom of the HUD (middle click to toggle)
- "C" (Continue) button to your last fishing or exploration zone
- Shows projected inventory after opening selected supply packs in locksmith page
- Notifications for active items in craftworks reaching max inventory


For bug reports, feature requests or questions:
[Message me](https://farmrpg.com/index.php#!/sendmessage.php?to=AppleBottomJeans)

Install from [GreasyFork](https://greasyfork.org/en/scripts/537132-frpg-hud)

Source code available on [GitHub](https://github.com/LOUDSOUL/frpg-hud/)


## After installation
1. Visit the inventory
2. Visit the workshop
3. Open the townsfolk page (If you do not have the quick send perk)
4. Open the craftworks page (If you have it unlocked)
5. Visit the farm page

If you do not have the "Farm Dashboard" perk from the supply shop, also visit the hourly production buildings individually.

When you visit an exploration or fishing zone for the first time, it will prompt you to go to its details page. This is only required to be done once. 

Same with supply packs like Large Chest 01 in the locksmith page. You need to either visit the chest's page (preferred) or open them to record their content. Once recorded, their content will then be shown anytime you click inside that supply pack's row.


## Known Issues
- HUD toggle button might get hidden behind the game's quick meal button on mobile or the chat button if you have a very high amount of silver
    - Workaround: You can either:
        - Enable/expand mastery/quest tracker
        - Enable silver amount abbreviation (game settings)
        - Disable quick meals (game settings)
- "Sell Unlocked" button while fishing also sets count for unlocked non-fish items to 0
    - Workaround: Just tap the refresh button when done fishing to sync inventory again


## Usage Tips
To get the most out of this script, be sure to configure your Quick Actions. You can set them by clicking on any item and scrolling to the bottom of the details panel.

You can set reserve amounts for each item individually (default is 20% of the inventory cap), and Quick Actions will only apply to the quantity exceeding that reserve.

During activities like exploration or fishing, use Quick Actions to sell, send, or craft items nearing their cap to avoid voiding them. 

The Refresh button functions the same as manually opening the inventory page, updating item counts instantly.

Items crafted using quick actions get added to the HUD temporarily and get removed upon a quick action on them. You can use this behaviour to chain craft items or sell/send the crafted items to NPCs. You can chain items like:
- Board -> Wooden Plank -> Sturdy Shield -> Sell
- Unpolished Garnet -> Garnet -> Garnet Ring -> Sell
- Stone -> Iron Cup -> Send to Lorn

You can enable edit mode by middle clicking HUD button and selecting "Enable Edit Mode"
- When enabled, perform a quick action on an item to quickly edit its quick action
- Clicking the "E" button to exits edit mode

When you activate a loadout, the Continue (C) button turns into Restore "R" button. Clicking it will restore the previous items in the HUD.

You can use the "Meals" and "Cookies" loadouts to quickly use use meals without having to open the inventory. You can also perform a Quick Action on the meal timer to use another one.

The "Reset" loadout is handy for letting you quickly review and complete your reset checklist so you don't miss anything.


## Loadouts
- Hourly (Quarry, Hayfield, Sawmill, Steelworks)
- Reset (Fruits, Animal Produce)
- Meals (Common meals for quick use)
- Cookies (Cookies and meals used with them)
- Craftworks (Current craftworks items)

Custom loadouts are not currently supported through the UI. To add your own, you'll need to manually edit the `loadouts` variable within the script's code.
