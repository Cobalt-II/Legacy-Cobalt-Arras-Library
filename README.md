# Legacy-Cobalt-Arras-Library
My scripts that are going to be broken with the new client for https://arras.io. Currently at the time I am writing this, Arras.io is getting a new beta client for Webgl (which will make it run faster) that includes better protocol defenses against scripts. This breaks every single current protocol script for the old Arras client. So I decided I would post some of my broken scripts into here. 

1. Minimap. Used alt tab to render other teams. Also renders any known player above 1m score in a special arena closer yellow color.
2. FOV Script. Used a proxy for detecting the packet arrays and modified the packet which contained the FOV value. 
