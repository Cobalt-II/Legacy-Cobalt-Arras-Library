# Legacy-Cobalt-Arras-Library
My scripts that are broken (the advantage providing ones, I excluded quite a bit from here that weren't really that notable but fun for use) with the new client for https://arras.io due to the new client. They probably won't be able to be rewritten due to the now complexity of the Arras client (except for FOV, which does have a working version for the new client but I won't leak due to it being easy to break and also because I'm not an ass), which has implemented WASM for the protocol, hence uprooting everything before and making it exponetionally harder now, compared to the old base js protocol. This is also why I'm fine with releasing these scripts to the public.

1. Minimap. Used alt tab to render other teams. Also renders any known player above 1m score in a special arena closer yellow color.
2. FOV Script. Used a proxy for detecting the packet arrays and modified the packet which contained the FOV value. 
3. B1 Swarmlord. This was a bot that had other alt tabs follow the "leader" tab around. The leader tab could be defined by pressing the trigger key on whichever one you wanted to be the leader. These bots would also attack anyone within a certain radius. They could also auto-respawn and build. Not headless bots but intelligent bots that could be used for prot or really anything, one time I almost accidently killed a 2m Cyclone when using these.

Here's a clip of a minimap script (there's no 1m+ here, also the entire map is freezing up at points due to lag, not because of the script)
[video-2022-11-08t175602080_REr5orxC (2).webm](https://user-images.githubusercontent.com/97923189/202818751-5aa9f842-38cb-4777-bfd6-1d13e1aa47d9.webm)

A clip of the B1 Swarmlord
[video_-_2022-10-10T142435.604.webm](https://user-images.githubusercontent.com/97923189/202819011-5f4fba52-6c86-4361-a0b3-039c0a6731f8.webm)

A clip of the FOV script (client doesn't render over a certain amount no matter what, so extra FOV only goes up to around 2 tiles)
[video - 2022-11-18T182553.580.webm](https://user-images.githubusercontent.com/97923189/202819555-d1f722b5-2159-407b-a50e-73a29dc90a9b.webm)

