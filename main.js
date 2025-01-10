var grid = [];
var weights = [];
var saved = [];
var n = 0;
black = 1;
white = -1;

function toggle(i){
	if(grid[i] == black){
		grid[i] = white;
		document.getElementById("t" + i).style.backgroundColor = "white";
	}
	else{
		grid[i] = black;
		document.getElementById("t" + i).style.backgroundColor = "black";
	}
}

function clearBoard(){
	grid = [];
	var board = document.getElementById("board")
	var tiles = '';
	for(i=0;i<n**2;i++){
		tiles = tiles + `<div id="t${i}" class="tile" style="background-color:white" onclick="toggle(${i})"></div>`;
		grid.push(white);
	}
	board.innerHTML = tiles;
}

function initialize(){
	n = parseInt(document.getElementById("number").value);
	document.documentElement.style.setProperty('--x', n);
	grid = [];
	var board = document.getElementById("board")
	var tiles = '';
	for(i=0;i<n**2;i++){
		tiles = tiles + `<div id="t${i}" class="tile" style="background-color:white" onclick="toggle(${i})"></div>`;
		grid.push(white);
	}
	board.innerHTML = tiles;
	initWeights();
}

function getColorHex(value) {
    const color1 = { r: 0, g: 0, b: 0 };
    const color2 = { r: 150, g: 150, b: 150 };
    const color3 = { r: 255, g: 255, b: 255 };

    // Interpolate between blue and black for values from -1 to 0
    if (value <= 0) {
        const t = value + 1; // Map -1 to 0 range to 0 to 1
        const r = Math.round(color1.r + t * (color2.r - color1.r));
        const g = Math.round(color1.g + t * (color2.g - color1.g));
        const b = Math.round(color1.b + t * (color2.b - color1.b));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    // Interpolate between black and yellow for values from 0 to 1
    else {
        const t = value; // Value is already in the 0 to 1 range
        const r = Math.round(color2.r + t * (color3.r - color2.r));
        const g = Math.round(color2.g + t * (color3.g - color2.g));
        const b = Math.round(color2.b + t * (color3.b - color2.b));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

}

function setLimits(){
	norm = saved.length == 0? 1 : saved.length;
	document.getElementById('lower').innerHTML = -1*norm;
	document.getElementById('upper').innerHTML = 1*norm;
}

function drawHeatMap(){
	heatmap = document.getElementById('colors');
	for(color = -1; color<=1; color+=0.1){
		heatmap.innerHTML += `<div style="background-color: ${getColorHex(color)}"></div>`;
	}
	setLimits();
}

function drawWeights(){
	if(saved.length == 0){
		norm = 1;
	}
	else{
		norm = saved.length;
	}
	weightBoard = document.getElementById('weights');
	weightTiles = ''
	for(i=0; i<n**2; i++){
		for(j=0; j<n**2; j++){
			weightTiles += `<div id="w_${i}_${j}" style="background-color: ${getColorHex(weights[i][j]/norm)}"></div>`
		}
	}
	weightBoard.innerHTML = weightTiles;
	setLimits();
}

function initWeights(){
	saved = [];
	document.getElementById("saves").innerHTML = "";
	weights = [];
	weights = Array(n**2).fill(null).map(() => Array(n**2).fill(0));
	drawWeights();
}

function boardFromGrid(newGrid){
	grid = [...newGrid];
	for(i=0;i<n**2;i++){
		if(grid[i] == black){
			document.getElementById("t" + i).style.backgroundColor = "black";
		}
		else{
			document.getElementById("t" + i).style.backgroundColor = "white";
		}
	}
}

function addToMemory(){
	if(weights.length == 0){
		initWeights();
	}
	for(i=0;i<n**2;i++){
		for(j=0;j<n**2;j++){
			if(i!=j){
				weights[i][j] += grid[i]*grid[j];
			}
		}
	}
	saved.push([...grid]);
	document.getElementById("saves").innerHTML += `<button id="save${saved.length}" onclick="boardFromGrid(saved[${saved.length - 1}])">Show Save ${saved.length}</button>`;
	drawWeights();
}

function update(pos){
	normalisation = saved.length == 0 ? 1 : saved.length;
	weight_pos = [...weights[pos]];
	sum = 0;
	for(i=0;i<n**2;i++){
		sum += grid[i]*weight_pos[i];
	}
	console.log(`Updating position ${pos}, sum: ${sum}, grid: ${grid[pos]}`); // Debug statement
	if(sum >= 0){
		grid[pos] = black;
		document.getElementById("t" + pos).style.backgroundColor = "black";
	}
	else{
		grid[pos] = white;
		document.getElementById("t" + pos).style.backgroundColor = "white";
	}
}

function makeLight(pos=0){
	if(pos == n**2){
		return;
	}
	document.getElementById("t" + pos).style.backgroundColor = "#d0d7dd";
	setTimeout(makeLight, 20, pos+1);
}

function run(pos=-1){
	if(pos == n**2){
		return;
	}
	if(pos == -1){
		makeLight();
		setTimeout(run, 100, pos+1);
	}else{	
		update(pos);
		setTimeout(run, 40, pos+1);
	}
}




initialize();
drawHeatMap();

