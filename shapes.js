//--------------------------------------------------------------------------------------------------------//
//  Shapes : methods for generating simple 3d shapes
//--------------------------------------------------------------------------------------------------------//
function Shapes() { };

Shapes.prototype.makeQuad = function(color, uvscalex=1, uvscaley=1)
{
	var vertexList = [
		-0.5, -0.5, 0, -0.5, -0.5, 0, color[0], color[1], color[2], 0, 0,
		 0.5, -0.5, 0,  0.5, -0.5, 0, color[0], color[1], color[2], uvscalex, 0,
		-0.5,  0.5, 0, -0.5,  0.5, 0, color[0], color[1], color[2], 0, uvscaley,
		 0.5,  0.5, 0,  0.5,  0.5, 0, color[0], color[1], color[2], uvscalex, uvscaley,
	]
	var indexList = [
		0, 1, 2,
		1, 2, 3,
	]
	return {vertex : vertexList, index : indexList}
}

Shapes.prototype.makeCube = function(color, uvscalex=1, uvscaley=1)
{
	var vertexList = [
		-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, color[0], color[1], color[2], 0, 0,
		-0.5, -0.5,  0.5, -0.5, -0.5,  0.5, color[0], color[1], color[2], 0, 0,
		-0.5,  0.5, -0.5, -0.5,  0.5, -0.5, color[0], color[1], color[2], 0, uvscaley,
		-0.5,  0.5,  0.5, -0.5,  0.5,  0.5, color[0], color[1], color[2], 0, uvscaley,
		 0.5, -0.5, -0.5,  0.5, -0.5, -0.5, color[0], color[1], color[2], uvscalex, 0,
		 0.5, -0.5,  0.5,  0.5, -0.5,  0.5, color[0], color[1], color[2], uvscalex, 0,
		 0.5,  0.5, -0.5,  0.5,  0.5, -0.5, color[0], color[1], color[2], uvscalex, uvscaley,
		 0.5,  0.5,  0.5,  0.5,  0.5,  0.5, color[0], color[1], color[2], uvscalex, uvscaley
	]
	var indexList = [
		0, 1, 2,
		1, 2, 3,
		0, 1, 5,
		0, 4, 5,
		0, 2, 6,
		0, 4, 6,
		2, 3, 6,
		3, 6, 7,
		4, 6, 7,
		4, 5, 7,
		1, 3, 7,
		1, 5, 7
	]
	return {vertex : vertexList, index : indexList}
}

Shapes.prototype.makeSphere = function(segments, rings, color)
{	
	var vertexList = [
		0, 0,  0.5, 0, 0,  1, color[0], color[1], color[2], 0, 0,
		0, 0, -0.5, 0, 0, -1, color[0], color[1], color[2], 0, 1
	]
	var indexList = []
	for(var s = 0; s < segments; s++){
		var phi = 2 * Math.PI * s / segments;
		for(var r = 0; r < rings; r++){
			var theta = Math.PI * (r+1) / rings;
			var x = 0.5 * Math.sin(theta) * Math.cos(phi)
			var y = 0.5 * Math.sin(theta) * Math.sin(phi)
			var z = 0.5 * Math.cos(theta)
			vertexList.push(x, y, z,
							x, y, z,
							color[0], color[1], color[2],
						   	s / segments,
							r / rings);
			if(r != 0){
				indexList.push(2+(s*rings)+r, 2+(((s+1)%segments)*rings)+r, 1+(s*rings)+r);
			}
			if(r != (rings - 1)){
				indexList.push(2+(s*rings)+r, 2+(((s+1)%segments)*rings)+r, 3+(((s+1)%segments)*rings)+r);
			}
		}
		indexList.push(0, 2+(s*rings), 2+((s+1)%segments)*rings);		
	}
	return {vertex : vertexList, index : indexList}
}