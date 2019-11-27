ig.module( 'game.levels.throne-room' )
.requires( 'impact.image','game.entities.hero','game.entities.npc' )
.defines(function(){
LevelThroneRoom=/*JSON[*/{
	"entities": [
		{
			"type": "EntityHero",
			"x": 48,
			"y": 64,
			"settings": {
				"hp": 1013,
				"direction": "UP"
			}
		},
		{
			"type": "EntityNpc",
			"x": 48,
			"y": 48,
			"settings": {
				"avatar": "king",
				"direction": "DOWN"
			}
		},
		{
			"type": "EntityNpc",
			"x": 48,
			"y": 96,
			"settings": {
				"avatar": "guard",
				"direction": "RIGHT",
				"isStationary": 1,
				"name": 1
			}
		},
		{
			"type": "EntityNpc",
			"x": 80,
			"y": 96,
			"settings": {
				"avatar": "guard",
				"direction": "LEFT",
				"isStationary": 1,
				"name": 2
			}
		},
		{
			"type": "EntityNpc",
			"x": 112,
			"y": 80,
			"settings": {
				"avatar": "guard",
				"direction": "DOWN",
				"isStationary": 0,
				"name": 3
			}
		},
		{
			"type": "EntityNpc",
			"x": 64,
			"y": 112,
			"settings": {
				"avatar": "door",
				"name": "door"
			}
		}
	],
	"layer": [
		{
			"name": "repeat",
			"width": 1,
			"height": 1,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/chars.png",
			"repeat": true,
			"preRender": false,
			"distance": "1",
			"tilesize": 16,
			"foreground": false,
			"data": [
				[45]
			]
		},
		{
			"name": "bg",
			"width": 10,
			"height": 10,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/chars.png",
			"repeat": false,
			"preRender": false,
			"distance": "1",
			"tilesize": 16,
			"foreground": false,
			"data": [
				[0,0,0,0,0,0,0,0,0,0],
				[0,48,48,48,48,48,48,48,48,0],
				[0,48,48,48,48,48,48,48,48,0],
				[0,48,48,48,48,48,48,48,48,0],
				[0,48,48,48,48,48,48,48,48,0],
				[0,48,48,48,48,48,48,48,48,0],
				[0,48,48,48,48,48,48,48,48,0],
				[0,0,0,0,48,0,0,0,0,0],
				[0,48,48,48,48,48,48,48,44,0],
				[0,0,0,0,0,0,0,0,0,0]
			]
		},
		{
			"name": "poi",
			"width": 10,
			"height": 10,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/chars.png",
			"repeat": false,
			"preRender": false,
			"distance": "1",
			"tilesize": 16,
			"foreground": false,
			"data": [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,47,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,47,47,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,54,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
			]
		},
		{
			"name": "border",
			"width": 10,
			"height": 10,
			"linkWithCollision": true,
			"visible": 1,
			"tilesetName": "media/chars.png",
			"repeat": false,
			"preRender": false,
			"distance": "1",
			"tilesize": 16,
			"foreground": false,
			"data": [
				[46,46,46,46,46,46,46,46,46,46],
				[46,0,0,0,0,0,0,0,0,46],
				[46,0,42,42,42,42,42,42,0,46],
				[46,0,42,0,42,42,0,42,0,46],
				[46,0,0,0,0,0,0,0,0,46],
				[46,0,0,0,0,0,0,0,0,46],
				[46,0,0,0,0,0,0,0,0,46],
				[46,46,46,46,0,46,46,46,46,46],
				[46,0,0,0,0,0,0,0,0,46],
				[46,46,46,46,46,46,46,46,46,46]
			]
		},
		{
			"name": "collision",
			"width": 10,
			"height": 10,
			"linkWithCollision": false,
			"visible": 0,
			"tilesetName": "",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 16,
			"foreground": false,
			"data": [
				[1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,1,1,1,1,1,1,0,1],
				[1,0,1,0,1,1,0,1,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,0,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1]
			]
		}
	]
}/*]JSON*/;
LevelThroneRoomResources=[new ig.Image('media/chars.png'), new ig.Image('media/chars.png'), new ig.Image('media/chars.png'), new ig.Image('media/chars.png')];
});