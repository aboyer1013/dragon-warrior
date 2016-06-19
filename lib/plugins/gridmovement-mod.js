ig.module('plugins.gridmovement-mod')
.requires('plugins.gridmovement')
.defines(function () {
	// Extend plugin to collision
	ig.global.GridMovementMod = ig.global.GridMovement.extend({
		canMoveDirectionFromCurrentTile: function (direction) {
			var currTile = this.getCurrentTile();
			var otherMovingEntities = _.filter(ig.game.entities, function (e) {
				return e !== this.entity && e.movement && e.movement.isMoving() && e.movement.destination;
			});
			var adjTile = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
			var canMoveDirectionFromTile = this.canMoveDirectionFromTile(currTile.x, currTile.y, direction);
			var otherDestinations = _.map(otherMovingEntities, function (e) {
				return e.movement.destination;
			});
			var hasCommonDestinations = _.some(otherDestinations, adjTile);

			return canMoveDirectionFromTile && !hasCommonDestinations;
		}
	});
});
