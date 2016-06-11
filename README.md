# EXODUS - virtualdungeon.js

EXODUS is a computer assisted dungeon crawling game framework. It generates random dungeon layouts
and challenges players to explore them, battling monsters and finding items on their way.

An EXODUS game is meant to be played on an open field at least 10x10 meters long, by a group of at
least two players. Each player takes a side either as the adventuring party or the dungeon dwellers,
which have the task of preventing the success of the adventurers. 

A full game is played by at least 8 people, having 4 of them be the adventuring party and the rest
being the dungeon dwellers. More people can play, joining the dungeon dwellers side.

A person, either from the dungeon dwellers group or a game master not participating in any of the
groups, handles the EXODUS core in a smartphone or tablet, and uses the program to control the
events happenning on the game.

A player from the adventurers group is designated as the leader and is on charge on interacting with
the game master to execute the actions in behalf of the party. It is also encouraged that another
player from the same group takes the role as the "mapper", who physically makes a map of the dungeon
to prevent the party from becoming lost.

Combat happens when the party finds a room with monster or is ambushed while camping; EXODUS will
designate a monster race for each one of the dungeon dwellers, based on the loaded scenario and the
location of the party within the dungeon. Combat rules are simple: each player has a set of hit
points, which are reduced when they get a hit on combat or by a magic spell. When a limp is hit, it
cannot be used in combat and must be healed. It's on the players side to keep track their hitpoints
and fall dead when they reach zero.

The game is set up by the game master, picking the scenario to be played, registering all the 
players on both the adventuring and the dungeon dwellers group in the EXODUS app and setting the
dungeon generation parameters based on the available area and other external factors.

The adventuring party then proceeds to the middle of the field, and the game master lets the party
leader know the description and contents of the room, as well as what exits the party can move to
and any obstacles they can find on the way.

The party leader consults with they party and then lets the game master know what direction to move,
the game master registers the movement, and in turns lets the party know of all the events unfolded
from their move, which may be falling into traps, meeting with monsters and more.

# Development
Run build-basic.sh, it will generated an html package ready to be used at the distro directory.

Run cordova-basic.sh to test the game on Android. 