# Legacy-Cobalt-Arras-Library
My scripts that are going to be broken with the new client for https://arras.io. Currently at the time I am writing this, Arras.io is getting a new beta client for Webgl (which will make it run faster) that includes better protocol defenses against scripts. This breaks every single current protocol script for the old Arras client. So I decided I would post some of my broken scripts into here. 

1. Minimap. Used alt tab to render other teams. Also renders any known player above 1m score in a special arena closer yellow color.
2. FOV Script. Used a proxy for detecting the packet arrays and modified the packet which contained the FOV value. 
3. B1 Swarmlord. This was a bot that had other alt tabs follow the leader tab around. It used a special global object value that usually changed so even if you were to run this on the old client it still wouldn't work until you updated the special values for the Arras('') global object. That said, that object is gone now so this won't work at all anymore. 

Here's a clip of a minimap script (there's no 1m+ here)
[video-2022-11-08t175602080_REr5orxC (2).webm](https://user-images.githubusercontent.com/97923189/202818751-5aa9f842-38cb-4777-bfd6-1d13e1aa47d9.webm)

A clip of the B1 Swarmlord
[video_-_2022-10-10T142435.604.webm](https://user-images.githubusercontent.com/97923189/202819011-5f4fba52-6c86-4361-a0b3-039c0a6731f8.webm)

A clip of the FOV script (client doesn't render over a certain amount no matter what, so extra FOV only goes up to around 2 tiles)
[Uploading video - 2022-11-18T182259.538.webm…]()


