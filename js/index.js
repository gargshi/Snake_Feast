//variables and constants
let inputDir={
	x:0,
	y:0
};
//sounds
const soundFood = new Audio("music/food.mp3");
const soundGameOver = new Audio("music/gameover.mp3");
const soundMove = new Audio("music/move.mp3");
const soundMusic = new Audio("music/Snake Bgm.mp3");
//globals
let gridSize=30; //master variable for grid size
let stat=document.getElementById("status_msg");
let board=document.getElementsByClassName('board')[0]; //get the board from the html
board.style.gridTemplateRows='repeat('+gridSize+', 1fr)'; //repeat(20, 1fr);
board.style.gridTemplateColumns='repeat('+gridSize+', 1fr)';
let speed=10; //game speed, increase for reduced lag but beware of hardness
let highscore_ban=document.getElementById("hsco");
let score=0;
let lastPaintTime=0;
let delta=0;
let snakeArray=[
	{x:15, y:15}
];
let food={x:3 , y:3};

//functions
function main(curTime)
{
	window.requestAnimationFrame(main)
	delta = curTime-lastPaintTime;
	if ( delta/1000 < (1/speed))
	{
		return;
	}
	lastPaintTime=curTime;
	gameEngine();
	
}

function hasCollided(sa)
{
	//check if snake has collided into itself
	for (let i = 1; i < sa.length; i++) {
		if(sa[0].x == sa[i].x && sa[0].y == sa[i].y)
		{
			return true;
		}
	}

	//check if snake has collide into walls and return
	return sa[0].x <= 1 || sa[0].x >= gridSize || sa[0].y <= 1 || sa[0].y >= gridSize; 
}

function gameEngine()
{
	// update the snake array and food
	if (hasCollided(snakeArray))
	{
		//Game over, reset everything.
		soundGameOver.play();
		//soundMusic.pause();
		inputDir={x:0,y:0};
		alert("GAME OVER. PRESS ANY KEY TO PLAY");
		snakeArray=[
			{x:5, y:5}
		];
		//soundMusic.play();
		score=0;
	}
	
	stat.innerHTML=score;
	

	//	check if snake has eaten food at coordinate
	//console.log(snakeArray[0],food)
	 
	if (snakeArray[0].y === food.y && snakeArray[0].x === food.x)
	{
		soundFood.play();
		score++;
		if (score > highscorev) //highscore updation logic
		{
			highscorev = score;
			localStorage.setItem('highscore',JSON.stringify(highscorev));
			hsco.innerHTML=highscorev;
		}
		snakeArray.unshift({x:snakeArray[0].x + inputDir.x, y:snakeArray[0].y + inputDir.y});
		let a = 2;
		let b = gridSize-4;
		food={x: Math.round(a + (b-a) * Math.random()), y: Math.round(a + (b-a) * Math.random())};
		//console.log(food);
	}

	//snake movement
	for (let i = snakeArray.length - 2; i >= 0; i--) {
		snakeArray[i+1]={...snakeArray[i]}; //create a new object for every swap using ...(to fix memory pointing issues)
	}

	snakeArray[0].x += inputDir.x;
	snakeArray[0].y += inputDir.y;




	// render snake array
	board.innerHTML="";
	snakeArray.forEach((e,index)=>{
		snakeElem=document.createElement('div');
		snakeElem.style.gridRowStart=e.y;
		snakeElem.style.gridColumnStart=e.x;
		if (index === 0)
		{
			snakeElem.classList.add('head');
		}
		else
		{
			snakeElem.classList.add('snake');
		}
		board.appendChild(snakeElem);
	});
	
	// render the food
	foodElem=document.createElement('div');
	foodElem.style.gridRowStart=food.y;
	foodElem.style.gridColumnStart=food.x;
	foodElem.classList.add('food');
	board.appendChild(foodElem);

}

let highscore=localStorage.getItem('highscore'); //highscore initialisation and existence handling
if (highscore === null)
{
	highscorev=0;
	localStorage.setItem("highscore",JSON.stringify(highscorev));
}
else
{
	highscorev=JSON.parse(highscore);
	highscore_ban.innerHTML=highscorev;
	
}
//main Logic and keybindings
window.requestAnimationFrame(main);
window.addEventListener('keydown',e=>{
	//inputDir={x:0,y:1}; //Game starts
	soundMove.play();
	switch (e.key){
		case 'ArrowUp':
			console.log("ArrowUP");
			inputDir.x=0;
			inputDir.y=-1;
			break;
		case 'ArrowDown':
			console.log("ArrowDown");
			inputDir.x=0;
			inputDir.y=1;
			break;
		case 'ArrowRight':
			console.log("ArrowRight");
			inputDir.x=1;
			inputDir.y=0;
			break;
		case 'ArrowLeft':
			console.log("ArrowLeft");
			inputDir.x=-1;
			inputDir.y=0;
			break;
		default:
			break;
	}
});