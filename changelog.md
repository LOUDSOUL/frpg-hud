# Version 2026-05-05
- Added crop harvest stats grouped by date in `farminfo.php` page
    - To check it out click on the `(i)` button at the top of `My Farm` page
    - They're generated from the logs the game sends (no storage)
- Improved the locksmith page HUD view
    - Now it shows your expected inventory after opening the selected amount of supply packs
    - Applies only to supply packs with fixed drops
    - Uses the old behaviour for packs with randomized drops like grab bags
    - Gold is now properly shown in supply pack contents
    - Void Bags are now correctly exluded
- Added logic to sync Ancient Coin count from the bottom panel
- Fixed inventory going out of sync when quick sending an active craftworks item
- Fixed Oak production calculation when Hickory buff is active
- Fixed meal timer getting added when meal use fails
- Prevented useless HUD updates when no meal timer is active
- Removed the (broken) ancient coin usage number on the wheel page


# Version 2026-04-17
- Fixed HUD to work with the latest tracker UI update
- Fixed a bug causing "send" quickAction not showing for items sendable to specific townsfolk
- Fixed item count calculation on regular explores
- Added notifications for items in craftworks reaching inventory cap
    - Only notifies for items not in other enabled craftworks items' recipes
    - Enabled by default
    - Can be toggled on/off in settings
- Added ability to toggle between the Exploring and Fishing shortcut
    - Middle/right click or tap and hold the "Explore" button to toggle between the two
- Added a system for saving discovered loved/liked items
- Added tracking for grape juice vat uses and single harvests
- Added tracking for mailbox items
- Updated townsfolk gift list to include the townsfolk mailbox only items


# Version 2026-03-03
- Added a new "Edit Mode" which allows quickly modifying quick action for an item
    - Accessible by middle clicking "HUD" -> "Enable Edit Mode"
    - When enabled, tap and hold/middle click an item to edit its action/details
    - Click the "E" button to exit
- Improved the UI when performing quick action for the first time on an item 
- Added tracking for milestone rewards
- Added tracking for quest requirements/rewards
- Quest reward items are also added in the HUD when opened
- Added loved/liked items for Goostav
- Added Sugar Cane seed (crop count)
- Added an option to disable the HUD Stash
- Fixed `Townsfolk does not exist` error in quickAction if you have `Quick Send` perk
- Fixed items not tracking when using AP with Lemon Cream Pie active
- Fixed reserve amount sometimes getting ignored while crafting using quickAction
- Fixed meal timer sometimes not correctly updating
- Fixed item send tracking
- Fixed error when encountering Sandwyrm


# Version 2025-07-26
- Added 10 minute/hourly production tracking
- Added ability to restore original items after activating a loadout
- Added detection for supply pack contents upon opening them
- Added listeners for production buildings, wishing well throws and beach ball
- Allow right clicking to perform quick actions
- Fixed workshop parsing if no item is added as 'favourite'
- Fixed error when cider gets used with insufficient stamina
- Fixed error displaying crop counts when no crop was selected


# Version 2025-06-16
- Fixed loadout items not in inventory appearing as `undefined`


# Version 2025-06-15
- Fixed crash with meals active


# Version 2025-06-14
- Added meal timers in the HUD (can be turned off)
- Added craftworks simulation (can be turned off)
- Added settings (accessible by middle clicking "HUD" button)
- Added ability to export and import QuickAction config (Settings)
- Added support for light mode (Follows your game settings)
- Added "Cookies" and "Craftworks" loadouts
- Removed the dependency on any in-game perk for functioning
- Rewrote the HUD code to make it more reliable
- Fixed tracking for regular nets, lemonade (Ty uaBArt) and mailing items 
- Changed how the meal related loadouts gets displayed 


# Version 2025-05-29
- Updated inventory parsing for the newest update
- Fixed "NaN" showing in the HUD in edge cases


# Version 2025-05-26

- Added HUD item loadouts (Reset, Hourly, Meals)
- Added ability to sell Steaks and Kabobs
- Added ability to use meals via Quick Actions
- Delayed worker event processing to improve responsiveness on mobile
- Fixed issue where inventory cap increase required a manual reload to display correctly


# Version 2025-05-29

- Updated inventory parsing for the newest update
- Fixed "NaN" showing in the HUD in edge cases
