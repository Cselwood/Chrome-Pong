window.onload = function() {
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');

	const paddleWidth = 10;
	const paddleHeight = 40;
	const ballRadius = 8;
	const maxBallSpeed = 0.5;
	const paddleSpeed = 2;
	const maxScore = 5;

	let player1Score = 0;
	let player2Score = 0;

	let player1Y = canvas.height / 2 - paddleHeight / 2;
	let player2Y = canvas.height / 2 - paddleHeight / 2;
	let ballX = canvas.width / 2;
	let ballY = canvas.height / 2;
	let ballDx = (Math.random() > 0.5 ? -1 : 1) * Math.floor(Math.random() * (maxBallSpeed - 2) + 2);
	let ballDy = (Math.random() > 0.5 ? -1 : 1) * Math.floor(Math.random() * (maxBallSpeed - 2) + 2);


	let upPressed = false;
	let downPressed = false;

	// Ensure ballDx and ballDy are non-zero
	if (ballDx == 0) {
		ballDx = 1;
	}
	if (ballDy == 0) {
		ballDy = 1;
	}

	function draw() {
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Draw player 1's paddle
		context.fillRect(10, player1Y, paddleWidth, paddleHeight);

		// Move player 1's paddle
		if (upPressed && player1Y > 0) {
			player1Y -= paddleSpeed;
		} else if (downPressed && player1Y < canvas.height - paddleHeight) {
			player1Y += paddleSpeed;
		}

		// Draw player 2's paddle
		context.fillRect(canvas.width - paddleWidth - 10, player2Y, paddleWidth, paddleHeight);

		// Move player 2's paddle
		if (ballY > player2Y + paddleHeight / 2) {
			player2Y += 1;
		} else {
			player2Y -= 1;
		}

		// Draw the ball
		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
		context.fill();

		// Move the ball
		if (ballX + ballRadius < 0) {
			// Player 2 scores
			player2Score++;
			resetBall();
		} else if (ballX - ballRadius > canvas.width) {
			// Player 1 scores
			player1Score++;
			resetBall();
		} else {
			ballX += ballDx;
			ballY += ballDy;
		}

		const topBoxedArea = 1; // height of the top of the boxed area
		if (ballY - ballRadius < topBoxedArea || ballY + ballRadius > canvas.height) {
			ballDy = -ballDy;
		}

		// Check for collisions with player 1's paddle
		if (ballX - ballRadius < paddleWidth + 10 && ballY > player1Y && ballY < player1Y + paddleHeight) {
			ballDx = -ballDx;
			ballDy += (ballY - (player1Y + paddleHeight / 2)) * 0.05;
		}

		// Check for collisions with player 2's paddle
		if (ballX + ballRadius > canvas.width - paddleWidth - 10 && ballY > player2Y && ballY < player2Y + paddleHeight) {
			ballDx = -ballDx;
			ballDy += (ballY - (player2Y + paddleHeight / 2)) * 0.05;
		}

		context.fillStyle = "#000";
		context.font = "bold 30px Courier";
		context.fillText(player1Score + "   " + player2Score, canvas.width / 2 - 45, 30);

		// Stop the ball from spawning if either player has 5 points
		if (player1Score == maxScore || player2Score == maxScore) {
			ballDx = 0;
			ballDy = 0;
		}

	}


	function resetBall() {
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
		ballDx = -ballDx;
		ballDy = Math.random() * 2 - 1;
	}

	function handleKeyDown(event) {
		if (event.key == 'w') {
			upPressed = true;
		} else if (event.key == 's') {
			downPressed = true;
		}
	}

	function handleKeyUp(event) {
		if (event.key == "w") {
			upPressed = false;
		} else if (event.key == "s") {
			downPressed = false;
		}

		// Add this condition to reset downPressed variable
		if (!upPressed && !downPressed) {
			downPressed = false;
		}
	}

	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);

	setInterval(draw, 5);


}