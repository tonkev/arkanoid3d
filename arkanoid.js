var main = function(){
	var canvas = document.getElementById("arkanoid-canvas")
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	canvas.aspect = canvas.width / canvas.height
	
	var actions = {
		left : false,
		right : false,
		shoot : false,
		top : false,
		grazing : false,
		up : false,
		down : false,
		thetaSpeed : false,
		thetaSlow : false
	}

	var inputKeyDown = function(e){
		if(e.key == "ArrowLeft")
			actions.left = true
		if(e.key == "ArrowRight")
			actions.right = true
		if(e.key == " ")
			actions.shoot = true
		if(e.key == "Q" || e.key == "q")
			actions.top = true
		if(e.key == "E" || e.key == "e")
			actions.grazing = true
		if(e.key == "W" || e.key == "w")
			actions.up = true
		if(e.key == "S" || e.key == "s")
			actions.down = true
		if(e.key == "R" || e.key == "r")
			actions.thetaSpeed = true
		if(e.key == "T" || e.key == "t")
			actions.thetaSlow = true
	}
	var inputKeyUp = function(e){
		if(e.key == "ArrowLeft")
			actions.left = false
		if(e.key == "ArrowRight")
			actions.right = false
		if(e.key == " ")
			actions.shoot = false
		if(e.key == "Q" || e.key == "q")
			actions.top = false
		if(e.key == "E" || e.key == "e")
			actions.grazing = false
		if(e.key == "W" || e.key == "w")
			actions.up = false
		if(e.key == "S" || e.key == "s")
			actions.down = false
		if(e.key == "R" || e.key == "r")
			actions.thetaSpeed = false
		if(e.key == "T" || e.key == "t")
			actions.thetaSlow = false
	}

	document.addEventListener('keydown', inputKeyDown, false)
	document.addEventListener('keyup', inputKeyUp, false)

	var gl = canvas.getContext("webgl", {})
	
	var scene = new Scene()
  	scene.initialise(gl, canvas)
	
	var ShapeHelper = new Shapes()
	var shapes = {}
	shapes.quad = ShapeHelper.makeQuad([0, 0, 0])
	shapes.ground = ShapeHelper.makeQuad([0, 0, 0], 4, 6)
	shapes.cube = ShapeHelper.makeCube([0, 0, 0])
	shapes.block = ShapeHelper.makeCube([0, 0, 0], 0.5, 0.5)
	shapes.sphere = ShapeHelper.makeSphere(50, 50, [0, 0, 0])

	var TextureList = new Textures()
	var materials = {}	
	var material = new Material()	
	material.setAlbedo(gl, TextureList.road)
	material.setSpecular([0,0,0])
	material.setAmbient([1,1,1])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.ground = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.concrete)
	material.setSpecular([0,0,0])
	material.setAmbient([1,1,1])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.border = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.bricks)
	material.setSpecular([0,0,0])
	material.setAmbient([1,1,1])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.block = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.paintedMetal)
	material.setSpecular([0,0,0])
	material.setAmbient([1,1,1])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.paddle = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.marble)
	material.setShininess(128.0)
	material.setSpecular([1,1,1])
	material.setAmbient([1,1,1])
	material.setDiffuse([0,0,0])
	material.bind(gl, scene.shaderProgram)
	materials.ball = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.marble)
	material.setShininess(128.0)
	material.setSpecular([1,1,1])
	material.setAmbient([0,1,0])
	material.setDiffuse([0,0,0])
	material.bind(gl, scene.shaderProgram)
	materials.slowBall = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.paintedMetal)
	material.setSpecular([0,0,0])
	material.setAmbient([0,1,0])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.stickyPaddle = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.blank)
	material.setShininess(96.0)
	material.setSpecular([1,1,1])
	material.setAmbient([1,1,1])
	material.setDiffuse([0,0,0])
	material.bind(gl, scene.shaderProgram)
	materials.cannon = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.blank)
	material.setShininess(256.0)
	material.setSpecular([1,1,1])
	material.setAmbient([1,0,0])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.laser = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.cameraSpeedInc)
	material.setSpecular([0,0,0])
	material.setAmbient([1,1,1])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.cameraSpeedInc = material
	
	material = new Material()
	material.setAlbedo(gl, TextureList.cameraSpeedDec)
	material.setSpecular([0,0,0])
	material.setAmbient([1,1,1])
	material.setDiffuse([1,1,1])
	material.bind(gl, scene.shaderProgram)
	materials.cameraSpeedDec = material
	
	var models = {}
	var model = new Model()
	model.name = "ground"
	model.vertex = shapes.ground.vertex
	model.index = shapes.ground.index
	model.material = materials.ground
	model.compile(scene)
	models.ground = model
	
	model = new Model()
	model.name = "borderTop"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.border
	model.compile(scene)
	models.borderTop = model
	
	model = new Model()
	model.name = "borderLeft"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.border
	model.compile(scene)
	models.borderLeft = model
	
	model = new Model()
	model.name = "borderRight"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.border
	model.compile(scene)
	models.borderRight = model
	
	model = new Model()
	model.name = "block"
	model.vertex = shapes.block.vertex
	model.index = shapes.block.index
	model.material = materials.block
	model.compile(scene)
	models.block = model
	
	model = new Model()
	model.name = "paddle"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.paddle
	model.compile(scene)
	models.paddle = model
	
	model = new Model()
	model.name = "ball"
	model.vertex = shapes.sphere.vertex
	model.index = shapes.sphere.index
	model.material = materials.ball
	model.compile(scene)
	models.ball = model
	
	model = new Model()
	model.name = "cannon"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.cannon
	model.compile(scene)
	models.cannon = model
	
	model = new Model()
	model.name = "laser"
	model.vertex = shapes.quad.vertex
	model.index = shapes.quad.index
	model.material = materials.laser
	model.compile(scene)
	models.laser = model
	
	model = new Model()
	model.name = "cameraSpeedUI"
	model.vertex = shapes.quad.vertex
	model.index = shapes.quad.index
	model.material = materials.cameraSpeedInc
	model.compile(scene)
	models.cameraSpeedUI = model	
	
	model = new Model()
	model.name = "wideDrop"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.paddle
	model.compile(scene)
	models.wideDrop = model
	
	model = new Model()
	model.name = "stickyDrop"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.stickyPaddle
	model.compile(scene)
	models.stickyDrop = model
	
	model = new Model()
	model.name = "slowDrop"
	model.vertex = shapes.sphere.vertex
	model.index = shapes.sphere.index
	model.material = materials.slowBall
	model.compile(scene)
	models.slowDrop = model
	
	model = new Model()
	model.name = "splitDrop"
	model.vertex = shapes.sphere.vertex
	model.index = shapes.sphere.index
	model.material = materials.ball
	model.compile(scene)
	models.splitDrop = model
	
	model = new Model()
	model.name = "laserDrop"
	model.vertex = shapes.cube.vertex
	model.index = shapes.cube.index
	model.material = materials.laser
	model.compile(scene)
	models.laserDrop = model
	
	var lights = {}	
	var light = new Light()
	light.type = Light.LIGHT_TYPE.DIRECTIONAL;
	light.setDiffuse([0.75, 0.75, 0.75]);
	light.setAmbient([0.25, 0.25, 0.25]);
	light.setDirection([0, 0, -1]);
	light.setSpecular([1, 1, 1]);
	light.bind(gl, scene.shaderProgram, 0)
	lights.directional = light
	
	light = new Light()
	light.type = Light.LIGHT_TYPE.POINT;
	light.setPosition([0, 0, 1])
	light.setDiffuse([1, 0, 0]);
	light.setAmbient([0.5, 0, 0]);
	light.setSpecular([1, 0, 0]);
	light.setAttenuationType(Light.ATTENUATION_TYPE.LINEAR)
	light.bind(gl, scene.shaderProgram, 3)
	lights.point = light
	
	light = new Light()
	light.type = Light.LIGHT_TYPE.SPOT;
	light.setDirection([-0.25, 0.75, 0]);
	light.setPosition([-0.25, 0, 0])
	light.setDiffuse([1, 1, 0]);
	light.setAmbient([0.5, 0.5, 0]);
	light.setSpecular([1, 1, 0]);
	light.setAttenuationType(Light.ATTENUATION_TYPE.LINEAR)
	light.bind(gl, scene.shaderProgram, 1)
	lights.spot1 = light
	
	light = new Light()
	light.type = Light.LIGHT_TYPE.SPOT;
	light.setDirection([0.25, 0.75, 0]);
	light.setPosition([0.25, 0, 0])
	light.setDiffuse([1, 1, 0]);
	light.setAmbient([0.5, 0.5, 0]);
	light.setSpecular([1, 1, 0]);
	light.setAttenuationType(Light.ATTENUATION_TYPE.LINEAR)
	light.bind(gl, scene.shaderProgram, 2)
	lights.spot2 = light
	
	var game = {
		width : 12.8,
		height : 19.6,
		level : 1,
		levels : [
			[
				0, 0, 0, 1, 1, 0, 0, 0,
				0, 0, 0, 1, 1, 0, 0, 0
			],
			[
				1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 0, 1, 1, 0, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1,
				1, 1, 0, 0, 0, 0, 1, 1,
				1, 1, 1, 1, 1, 1, 1, 1
			],
			[
				1, 1, 1, 1, 1, 1, 1, 0,
				1, 1, 1, 1, 1, 1, 0, 0,
				1, 1, 1, 1, 1, 0, 0, 1,
				1, 1, 1, 1, 0, 0, 1, 1,
				1, 1, 1, 0, 0, 1, 1, 1,
				1, 1, 0, 0, 1, 1, 1, 1,
				1, 0, 0, 1, 1, 1, 1, 1,
				0, 0, 1, 1, 1, 1, 1, 1
			]
		],
		maxNoOfBlocks : 64,
		maxNoOfBalls : 16,
		maxLives : 3,
		lives : 0,
		liveBalls : 1
	}
	game.lives = game.maxLives
	
	var powerups = {
		types : Object.freeze({
			'none':1,
			'wide_paddle':2,
			'split_ball':4,
			'slow_ball':8,
			'sticky_paddle':16,
			'laser_paddle':32
		}),
		drops : [],
		chance : [0.50, 0.15, 0.05, 0.15, 0.10, 0.05],
		dropSpeed : 3,
		active : 0,
		slowTimestamp : 0,
		radius : 0.4
	}
	
	var nodes = {}
	nodes.directionalLight = scene.addNode(scene.root, lights.directional, "directionalLight", Node.NODE_TYPE.LIGHT)
	
	nodes.powerupDropGroup = scene.addNode(scene.root, null, "powerupDropGroup", Node.NODE_TYPE.GROUP)
	
	nodes.ground = scene.addNode(scene.root, models.ground, "ground", Node.NODE_TYPE.MODEL)
	
	nodes.border = scene.addNode(scene.root, null, "border", Node.NODE_TYPE.GROUP)
	nodes.borderTop = scene.addNode(nodes.border, models.borderTop, "borderTop", Node.NODE_TYPE.MODEL)
	nodes.borderLeft = scene.addNode(nodes.border, models.borderLeft, "borderLeft", Node.NODE_TYPE.MODEL)
	nodes.borderRight = scene.addNode(nodes.border, models.borderRight, "borderRight", Node.NODE_TYPE.MODEL)
	
	nodes.blockGroup = scene.addNode(scene.root, null, "blockGroup", Node.NODE_TYPE.GROUP)
	nodes.blocks = []
	for(var i = 0; i < game.maxNoOfBlocks; i++){
		nodes.blocks.push(scene.addNode(nodes.blockGroup, models.block, "block" + i, Node.NODE_TYPE.MODEL))
	}
	
	nodes.paddle = scene.addNode(scene.root, models.paddle, "paddle", Node.NODE_TYPE.MODEL)
	nodes.spotLight1 = scene.addNode(nodes.paddle, lights.spot1, "spotLight1", Node.NODE_TYPE.LIGHT)
	nodes.spotLight2 = scene.addNode(nodes.paddle, lights.spot2, "spotLight2", Node.NODE_TYPE.LIGHT)
	nodes.cannon = scene.addNode(nodes.paddle, models.cannon, "cannon", Node.NODE_TYPE.MODEL)
	nodes.laser = scene.addNode(nodes.cannon, models.laser, "laser", Node.NODE_TYPE.MODEL)
	
	nodes.ballGroup = scene.addNode(scene.root, null, "ballGroup", Node.NODE_TYPE.GROUP)
	
	nodes.indicatorGroup = scene.addNode(scene.root, null, "indicatorGroup", Node.NODE_TYPE.GROUP)
	nodes.indicators = []
	for(var i = 0; i < game.maxLives; i++){
		nodes.indicators.push(scene.addNode(nodes.indicatorGroup, models.ball, "indicator" + i, Node.NODE_TYPE.MODEL))
	}
	
	nodes.cameraSpeedUI = scene.addNode(scene.root, models.cameraSpeedUI, "cameraSpeedUI", Node.NODE_TYPE.MODEL)
	
	var Vec3 = new Vector3()
	var Mat4x4 = new Matrix4()
	
	var matA = Mat4x4.create()
	var matB = Mat4x4.create()
	
	var powerupAnimationCallback = function(delta){
		if(powerups.active & powerups.types.sticky_paddle)
			models.paddle.material = materials.stickyPaddle
		else
			models.paddle.material = materials.paddle
		if(powerups.active & powerups.types.slow_ball){
			models.ball.material = materials.slowBall
			if(Date.now() - powerups.slowTimestamp > 30000){
				powerups.active -= powerups.types.slow_ball
			}
		}else
			models.ball.material = materials.ball
	}
	nodes.powerupDropGroup.animationCallback = powerupAnimationCallback
	
	var powerupDropAnimationCallback = function(delta){
		this.drop.y -= powerups.dropSpeed * delta
		if(circleRectangleCollision(this.drop.x, this.drop.y, powerups.radius, paddle.x, paddle.y, paddle.width, paddle.height)){
			switch(this.drop.type){
				case powerups.types.wide_paddle:
					powerups.active |= powerups.types.wide_paddle
					break
				case powerups.types.split_ball:
					var noOfBalls = game.liveBalls
					for(var j = 0; j < noOfBalls; j++){
						var ball = nodes.ballGroup.children[j].ball
						spawnBall(ball.x - (ball.radius*2), ball.y - (ball.radius*2), ball.launching, -ball.dx, -ball.dy)
					}
					break
				case powerups.types.slow_ball:
					powerups.active |= powerups.types.slow_ball
					powerups.slowTimestamp = Date.now()
					break
				case powerups.types.sticky_paddle:
					powerups.active |= powerups.types.sticky_paddle
					break
				case powerups.types.laser_paddle:
					powerups.active |= powerups.types.laser_paddle
					break
			}
			this.parent.removeChild(this)
		}
		if(this.drop.y + (powerups.radius * 5) < -game.height/2){
			this.parent.removeChild(this)
		}
		switch(this.drop.type){
			case powerups.types.wide_paddle:
			case powerups.types.sticky_paddle:
				Mat4x4.makeScaling(matA, [blocks.width, blocks.height/4, blocks.depth/4])
				break
			case powerups.types.split_ball:
				Mat4x4.makeScaling(matA, [blocks.width/4, blocks.height/4, blocks.depth/4])
				break
			case powerups.types.slow_ball:
				Mat4x4.makeScaling(matA, [blocks.width/4, blocks.height/4, blocks.depth/4])
				break
			case powerups.types.laser_paddle:
				Mat4x4.makeScaling(matA, [blocks.width/4, blocks.height, blocks.depth/4])
				break
		}
		Mat4x4.makeTranslation(matB, [this.drop.x, this.drop.y, 0])
		Mat4x4.multiply(this.transform, matB, matA)
	}
	
	var spawnPowerupDrop = function(type, x, y){
		if(type != powerups.types.none){
			var node
			switch(type){
				case powerups.types.wide_paddle:
					node = scene.addNode(nodes.powerupDropGroup, models.wideDrop, "wideDrop", Node.NODE_TYPE.MODEL)
					Mat4x4.makeScaling(matA, [blocks.width, blocks.height/4, blocks.depth/4])
					break
				case powerups.types.sticky_paddle:
					node = scene.addNode(nodes.powerupDropGroup, models.stickyDrop, "stickyDrop", Node.NODE_TYPE.MODEL)
					Mat4x4.makeScaling(matA, [blocks.width, blocks.height/4, blocks.depth/4])
					break
				case powerups.types.split_ball:
					node = scene.addNode(nodes.powerupDropGroup, null, "splitDrop", Node.NODE_TYPE.GROUP)
					Mat4x4.makeScaling(matA, [blocks.width/4, blocks.height/4, blocks.depth/4])
					var splitA = scene.addNode(node, models.splitDrop, "splitA", Node.NODE_TYPE.MODEL)
					Mat4x4.makeTranslation(splitA.transform, [-blocks.width/4, 0, 0])
					var splitB = scene.addNode(node, models.splitDrop, "splitB", Node.NODE_TYPE.MODEL)
					Mat4x4.makeTranslation(splitB.transform, [blocks.width/4, 0, 0])
					break
				case powerups.types.slow_ball:
					node = scene.addNode(nodes.powerupDropGroup, models.slowDrop, "slowDrop", Node.NODE_TYPE.MODEL)
					Mat4x4.makeScaling(matA, [blocks.width/4, blocks.height/4, blocks.depth/4])
					break
				case powerups.types.laser_paddle:
					node = scene.addNode(nodes.powerupDropGroup, models.laserDrop, "laserDrop", Node.NODE_TYPE.MODEL)
					Mat4x4.makeScaling(matA, [blocks.width/4, blocks.height, blocks.depth/4])
					break
			}
			Mat4x4.makeTranslation(matB, [x, y, 0])
			Mat4x4.multiply(node.transform, matB, matA)
			node.drop = {
				x : x,
				y : y,
				type : type
			}
			node.animationCallback = powerupDropAnimationCallback
		}
	}
	
	Mat4x4.makeScaling(matA, [game.width, game.height, 1])
	Mat4x4.makeTranslation(matB, [0, 0, -0.8])
	Mat4x4.multiply(nodes.ground.transform, matB, matA)
	
	var border = {
		depth : 1.6	
	}
	
	Mat4x4.makeScaling(matA, [(2*border.depth) + game.width, border.depth, border.depth])
	Mat4x4.makeTranslation(matB, [0, (game.height + border.depth)/2, 0])
	Mat4x4.multiply(nodes.borderTop.transform, matB, matA)
	
	Mat4x4.makeScaling(matA, [border.depth, game.height, border.depth])
	Mat4x4.makeTranslation(matB, [-(border.depth + game.width)/2, 0, 0])
	Mat4x4.multiply(nodes.borderLeft.transform, matB, matA)
	
	Mat4x4.makeTranslation(matB, [(border.depth + game.width)/2, 0, 0])
	Mat4x4.multiply(nodes.borderRight.transform, matB, matA)
	
	
	var getBlockPosition = function(id){
		var x = ((id%blocks.perRow) * blocks.width) + (blocks.width/2) - (game.width/2)
		var y = -(Math.floor(id/blocks.perRow) * blocks.height) - (blocks.height/2) + game.height/2
		return {x : x, y : y}
	}
	
	var blocks = {
		perRow : 8,
		width : 0,
		height : 0,
		depth : 0.8,
		blocks : [],
		powerups : [],
		types : Object.freeze({'empty':0, 'normal':1}),
		blocksLeft : 0
	}
	blocks.width = game.width / blocks.perRow
	blocks.height = game.width / blocks.perRow
	
	for(var i = 0; i < game.maxNoOfBlocks; i++){
		var pos = getBlockPosition(i)
		Mat4x4.makeScaling(matA, [blocks.width, blocks.height, blocks.depth])
		Mat4x4.makeTranslation(matB, [pos.x, pos.y, 0])
		Mat4x4.multiply(nodes.blocks[i].transform, matB, matA)
	}
		
	var hitBlock = function(id){
		blocks.blocks[id] = blocks.types.empty
		nodes.blocks[id].visible = false
		var pos = getBlockPosition(id)
		spawnPowerupDrop(blocks.powerups[id], pos.x, pos.y)
		blocks.blocksLeft--
	}
	
	var paddle = {
		x : 0,
		y : 0,
		width : 0,
		widthBase : 3,
		height : 0.8,
		depth : 0.8,
		speed : 3.5,	
		launchSpeedMin : 3.5,
		launchSpeedMax : 10,
		launchSpeed : 0,
		launchAcc : 3,
		launching : false,
		charging : false
	}
	paddle.y = -(game.height + paddle.height)/2
	paddle.launchSpeed = paddle.launchSpeedMin
	
	var paddleAnimationCallback = function(delta){
		if(powerups.active & powerups.types.wide_paddle)
			paddle.width = paddle.widthBase*2
		else
			paddle.width = paddle.widthBase
		
		paddle.dx = 0
		if(actions.left){
			paddle.x -= paddle.speed * delta
			paddle.dx = -1
		}
		if(actions.right){
			paddle.x += paddle.speed * delta
			paddle.dx = 1
		}
		if(paddle.x < (paddle.width - game.width)/2){
			paddle.x = (paddle.width - game.width)/2
			paddle.dx = 0
		}
		if(paddle.x > (game.width - paddle.width)/2){
			paddle.x = (game.width - paddle.width)/2
			paddle.dx = 0
		}
		
		if(actions.shoot && paddle.launching){
			paddle.charging = true
			paddle.launchSpeed += paddle.launchAcc * delta
			if(paddle.launchSpeed > paddle.launchSpeedMax){
				paddle.launchSpeed = paddle.launchSpeedMax
			}
		}else{
			paddle.shooting = false
			if(paddle.charging){
				paddle.launching = false
				paddle.charging = false
				paddle.launchSpeed = paddle.launchSpeedMin
			}
		}
		
		Mat4x4.makeScaling(matA, [paddle.width, paddle.height * (1.1 - ((paddle.launchSpeed - paddle.launchSpeedMin)/(paddle.launchSpeedMax - paddle.launchSpeedMin))), paddle.depth])
		Mat4x4.makeTranslation(matB, [paddle.x, paddle.y, 0])
		Mat4x4.multiply(nodes.paddle.transform, matB, matA)
	}
	paddleAnimationCallback(0)
	nodes.paddle.animationCallback = paddleAnimationCallback
	
	var cannon = {
		width : 0.8,
		height : 1.2,
		depth : 1.2,
		shot : false,
		laserWidth : 0.4,
	}
	
	var cannonAnimationCallback = function(delta){
		if(powerups.active & powerups.types.laser_paddle){
			this.visible = true
			if(cannon.shot){
				nodes.laser.visible = false
				if(!actions.shoot)
					cannon.shot = false
			}
			if(actions.shoot && !cannon.shot){
				var bix = Math.floor(((game.width/2) + paddle.x) / blocks.width)
				var biyMax = Math.floor(blocks.blocks.length / blocks.perRow) - 1
				var bi
				for(var biy = biyMax; biy >= 0; biy--){
					bi = biy*blocks.perRow + bix
					if(blocks.blocks[bi] != blocks.types.empty){
						hitBlock(bi)
						break
					}
				}
				var laserY = getBlockPosition(bi).y - (blocks.height/2)
				var laserHeight = laserY - paddle.y
				Mat4x4.makeScaling(matA, [cannon.laserWidth/cannon.width, laserHeight/(cannon.height), 1])
				Mat4x4.makeTranslation(matB, [0, laserHeight/(2*cannon.height), 0])
				Mat4x4.multiply(nodes.laser.transform, matB, matA)
				nodes.laser.visible = true
				cannon.shot = true
			}
		}else{
			this.visible = false
		}
	}
	
	Mat4x4.makeScaling(matA, [cannon.width/paddle.width, cannon.height/paddle.height, cannon.depth/paddle.depth])
	Mat4x4.makeTranslation(matB, [0, 0, 0])
	Mat4x4.multiply(nodes.cannon.transform, matB, matA)
	nodes.cannon.visible = false
	nodes.laser.visible = false
	nodes.cannon.animationCallback = cannonAnimationCallback
	
	var circleRectangleCollision = function(cx, cy, cr, rx, ry, rw, rh){
		var dx = cx - Math.max(rx - rw/2, Math.min(cx, rx + rw/2))
		var dy = cy - Math.max(ry - rh/2, Math.min(cy, ry + rh/2))
		return ((dx * dx + dy * dy) < (cr * cr))
	}

	var circleCircleCollision = function(c1x, c1y, c1r, c2x, c2y, c2r){
		var dx = c2x - c1x
		var dy = c2y - c1y
		var cr = c1r + c2r
		return ((dx * dx + dy * dy) < (cr * cr))
	}
	
	var ballAnimationCallback = function(delta){
		var ball = this.ball
		if(ball.launching && !paddle.launching)
			ball.launching = false
		if(ball.launching){
			ball.x = paddle.x + ball.pox
			ball.y = paddle.y + paddle.height/2 + ball.radius
			ball.dx = paddle.dx
			ball.dy = 1
			var d = Math.abs(ball.dx) + Math.abs(ball.dy)
			ball.dx /= d
			ball.dy /= d
			ball.speed = paddle.launchSpeed
		}else{
			var speed = ball.speed
			if(powerups.active & powerups.types.slow_ball)
				speed /= 2

			ball.x += ball.dx * speed * delta
			ball.y += ball.dy * speed * delta

			if(ball.collisionCooldown <= 0){
				for(var j = 0; j < this.parent.children.length; j++){
					if(this != this.parent.children[j]){
						var ball2 = this.parent.children[j].ball
						if(circleCircleCollision(ball.x, ball.y, ball.radius, ball2.x, ball2.y, ball2.radius)){
							var angle = Math.atan((ball.y - ball2.y)/(ball.x - ball2.x))
							var distance = Math.pow(Math.pow(ball.x - ball2.x, 2) + Math.pow(ball.x - ball2.x, 2), 0.5)
							var minPush = ball.radius + ball2.radius - distance

							var dx = Math.sin(angle)
							var dy = Math.cos(angle)
							ball.dx = -dx
							ball.dy = -dy
							ball2.dx = dx
							ball2.dy = dy
							ball.x += ball.dx * minPush / 2
							ball.y += ball.dy * minPush / 2
							ball2.x += ball2.dx * minPush / 2
							ball2.y += ball2.dy * minPush / 2
							
							ball.collisionCooldown = 0.5
							ball2.collisionCooldown = 0.5
							
							break
						}
					}
				}
			}else
				ball.collisionCooldown -= delta

			for(var j = 0; j < blocks.blocks.length; j++){
				if(blocks.blocks[j] == blocks.types.normal){
					var blockPos = getBlockPosition(j)
					if(circleRectangleCollision(ball.x, ball.y, ball.radius, blockPos.x, blockPos.y, blocks.width, blocks.height)){
						hitBlock(j)

						var dx = blockPos.x - ball.x
						var dy = blockPos.y - ball.y
						var px = Math.abs(dx)/(blocks.width)
						var py = Math.abs(dy)/(blocks.height)
						if(Math.abs(px - py) < 0.1){
							ball.dx = -0.5 * Math.sign(ball.dx)
							ball.dy = -0.5 * Math.sign(ball.dy)
						}else if(px > py){
							ball.dx *= -1
						}else if(py > px){
							ball.dy *= -1
						}
						break
					}
				}
			}

			if(circleRectangleCollision(ball.x, ball.y, ball.radius, paddle.x, paddle.y, paddle.width, paddle.height)){
				if(powerups.active & powerups.types.sticky_paddle){
					ball.launching = true
					ball.pox = ball.x - paddle.x
					paddle.launching = true
				}else{
					var dx = ball.x - paddle.x
					var dy = ball.y - paddle.y
					var px = Math.abs(dx)/(paddle.width)
					var py = Math.abs(dy)/(paddle.height)
					if(Math.abs(px - py) < 0.1){
						ball.dx = 0.5 * Math.sign(dx)
					}else if(px > py){
						ball.dx = Math.sign(dx) * Math.abs(ball.dx)
					}
					ball.dx = Math.max(-0.5, Math.min(ball.dx + (paddle.dx / 3), 0.5))
					ball.dy = 1 - Math.abs(ball.dx)
				}
			}


			if(ball.y + ball.radius > game.height/2){
				ball.dy = -ball.dy
				ball.y = game.height/2 - ball.radius
			}
			if(ball.x - ball.radius < -game.width/2){
				ball.dx = -ball.dx
				ball.x = ball.radius - game.width/2
			}
			if(ball.x + ball.radius > game.width/2){
				ball.dx = -ball.dx
				ball.x = game.width/2 - ball.radius
			}

			if(ball.y + ball.radius < -game.height/2){
				game.liveBalls--
				this.parent.removeChild(this)	
			}
		}

		Mat4x4.makeScaling(matA, [ball.radius*2, ball.radius*2, ball.radius*2])
		Mat4x4.makeTranslation(matB, [ball.x, ball.y, 0])
		Mat4x4.multiply(this.transform, matB, matA)
	}	
	var spawnBall = function(x, y, launching, dx=0, dy=1){
		if(nodes.ballGroup.children.length < game.maxNoOfBalls){
			var node = scene.addNode(nodes.ballGroup, models.ball, "ball", Node.NODE_TYPE.MODEL)
			point = scene.addNode(node, lights.point, "pointLight", Node.NODE_TYPE.LIGHT)
			node.ball = {
				x : x,
				y : y,
				radius : 0.4,
				dx : dx,
				dy : dy,
				speed : 5,
				pox : 0,
				launching : launching,
				collisionCooldown : 0
			}
			Mat4x4.makeScaling(matA, [node.ball.radius*2, node.ball.radius*2, node.ball.radius*2])
			Mat4x4.makeTranslation(matB, [node.ball.x, node.ball.y, 0])
			Mat4x4.multiply(node.transform, matB, matA)

			node.animationCallback = ballAnimationCallback
			game.liveBalls++
		}
	}
	
	var indicatorAnimationCallback = function(delta){
		this.visible = this.indicatorID < game.lives
	}
	
	for(var i = 0; i < game.maxLives; i++){
		Mat4x4.makeScaling(matA, [0.8, 0.8, 0.8])
		Mat4x4.makeTranslation(matB, [game.width/2 + border.depth + 0.5, -game.height/2 + i*0.8 + 0.4, 0])
		Mat4x4.multiply(nodes.indicators[i].transform, matB, matA)
		
		nodes.indicators[i].indicatorID = i
		nodes.indicators[i].animationCallback = indicatorAnimationCallback
	}
	
	Mat4x4.makeScaling(matA, [game.width/2, game.width/2, 1])
	Mat4x4.makeTranslation(matB, [0, -game.width/2, 0])
	Mat4x4.multiply(nodes.cameraSpeedUI.transform, matB, matA)
	
	var camera = {
		distance : 60,
		position : Vec3.from(0, 0, 0),
		theta : 0,
		topTheta : 0,
		grazingTheta : Math.PI/4,
		speed : Math.PI,
		maxSpeed : 2*Math.PI,
		minSpeed : Math.PI/4,
		acceleration : 1,
	}
	camera.position = Vec3.from(0, 0, camera.distance)
	
	var cameraSpeedUIAnimationCallback = function(delta){
		var increasedSpeed = false
		var decreasedSpeed = false
		if(actions.thetaSpeed){
			camera.speed += camera.acceleration * delta
			if(camera.speed > camera.maxSpeed)
				camera.speed = camera.maxSpeed
			else
				increasedSpeed = true
		}else if(actions.thetaSlow){
			camera.speed -= camera.acceleration * delta
			if(camera.speed < camera.minSpeed)
				camera.speed = camera.minSpeed
			else
				decreasedSpeed = true
		}
		if(actions.top)
			camera.theta = camera.topTheta
		if(actions.grazing)
			camera.theta = camera.grazingTheta
		if(actions.up){
			camera.theta -= camera.speed * delta
			if(camera.theta < camera.topTheta)
				camera.theta = camera.topTheta
		}
		if(actions.down){
			camera.theta += camera.speed * delta
			if(camera.theta > camera.grazingTheta)
				camera.theta = camera.grazingTheta
		}
		
		if(increasedSpeed && !decreasedSpeed){
			nodes.cameraSpeedUI.visible = true
			models.cameraSpeedUI.material = materials.cameraSpeedInc
		}else if(!increasedSpeed && decreasedSpeed){
			nodes.cameraSpeedUI.visible = true
			models.cameraSpeedUI.material = materials.cameraSpeedDec
		}else{
			nodes.cameraSpeedUI.visible = false
		}
	}	
	nodes.cameraSpeedUI.animationCallback = cameraSpeedUIAnimationCallback
		
	var loadLevel = function(){
		blocks.blocks = game.levels[game.level].slice(0)
		blocks.blocksLeft = 0
		for(var i = 0; i < game.maxNoOfBlocks; i++){
			if(i < blocks.blocks.length){
				if(blocks.blocks[i] == 1){
					nodes.blocks[i].visible = true
					blocks.blocksLeft++
				}else
					nodes.blocks[i].visible = false
			}else
				nodes.blocks[i].visible = false
			
			var r = Math.random()
			var p = 0
			for(var j = 0; j < powerups.chance.length; j++){
				p += powerups.chance[j]
				if(r < p){
					blocks.powerups[i] = Math.pow(2, j)
					break
				}
			}
		}
	}
	
	var resetLevel = function(){
		paddle.launching = true
		nodes.ballGroup.removeChildren()
		spawnBall(0, 0, true)
		game.liveBalls = 1
		powerups.active = 0
		nodes.powerupDropGroup.removeChildren()
	}
	
	var rootAnimationCallback = function(delta){
		if(blocks.blocksLeft <= 0){
			game.level = (game.level + 1) % game.levels.length
			loadLevel()
			resetLevel()
		}else if(game.liveBalls <= 0){
			game.lives--
			if(game.lives < 0){
				game.lives = game.maxLives
				game.level = 0
				loadLevel()	
			}
			resetLevel()
		}
	}
	scene.root.animationCallback = rootAnimationCallback
	
	loadLevel()
	resetLevel()
	
	scene.setViewFrustum(1, 1000, 0.5236);
	var camTransform = Mat4x4.create()

	gl.clearColor(0.8, 0.8, 1.0, 1.0)
	gl.enable(gl.DEPTH_TEST)
	var animate = function(){
		Mat4x4.makeRotationX(camTransform, camera.theta)
    	Mat4x4.multiplyPoint(camera.position, camTransform, [0, 0, camera.distance])
    	scene.lookAt(camera.position, [0,0,0], [0,1,0])
		
		scene.beginFrame()
		scene.animate()
		scene.draw()
		scene.endFrame()
		
		window.requestAnimationFrame(animate)
	}
	
	animate()
}