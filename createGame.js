'use strict';
//getting URL params so the user can set up the grid they want thru the game URL:
const query = window.location.search;
const urlParams = new URLSearchParams(query);
const grid_ = String(urlParams.get('grid'));
console.log('grid_: ', grid_[0])
let x = grid_[0];
let y = grid_[2];
// game creation and logic (most of it, more things left to do.)
document.addEventListener('DOMContentLoaded', function(){
    let gameBox = document.body;
    const imagesSetOne = ['img_0','img_1','img_2','img_3','img_4','img_5','img_6','img_7','img_8','img_9','img_10','img_11','img_12'];
    const setOnePath = '/assets/set1/';
    const keepScoreEl = document.querySelector('#keepScore > span');
    console.log('keepScoreEl', keepScoreEl)

    //shuffle the images inside the imageSet array: 
    function shuffleArray(array) {
        for (let i = array.length -1; i > 0; i--){
            const randoImage = Math.floor(Math.random() * (i+1));
            [array[i], array[randoImage]] = [array[randoImage], array[i]];
        }
        return array;
    }

    function generateGameRows(x, y) {
        let numOfRows = x;
        let numOfCols = y;
        let title = document.getElementById('grid_setup');
        title.innerHTML = x +' by '+ y;
        keepScoreEl.innerText = 100;
        for(let i = 1; i <= numOfRows; i++){ //first loop we create the row that will contain the cards
            const grid_row = document.createElement('div');
            grid_row.classList.add('row');
            const grid_container = document.createElement('div');
            grid_container.classList.add('container');
            gameBox.appendChild(grid_container);
            grid_container.appendChild(grid_row);
            for(let i=1; i <= numOfCols; i++) { // this loop is to crate the columns
                const shuffeledSet = shuffleArray(imagesSetOne);
                const grid_item = document.createElement('div');
                grid_item.classList.add('col-lg', 'card', 'col-sm-6', 'col-md');
                const item_cover = document.createElement('span');
                item_cover.classList.add('cardCover', 'rounded-lg', 'smalldot');
                const item_shape = document.createElement('img');
                item_shape.classList.add('shape');
                item_shape.setAttribute('width', '80%');
                item_shape.setAttribute('src', setOnePath+shuffeledSet[i]+'.png');
                grid_row.appendChild(grid_item);
                grid_item.appendChild(item_cover)
                grid_item.appendChild(item_shape)
            }
        }
    }
    generateGameRows(x,y);

    const allCards = document.querySelectorAll('.card');
    const allCovers = document.querySelectorAll('.cardCover');
    let exposedCards = 0;
    let exposedShapesArray = [];
    let exposedShape;
    const messageBoxEl = document.getElementById('gameMessage');
    let currentScore = 100;
    function showCardsHint() {
        function genRandomNum() {
            return Math.random() * (1 - 0.41) + 0.51;
        }
        allCovers.forEach((coverElement, i) => {
            function coverRandomOpacity() {
                coverElement.style = 'opacity:' + genRandomNum();
            }
            const interval = setInterval(coverRandomOpacity, 300);
            setTimeout(()=>{
                clearInterval(interval);
                setTimeout(()=>{
                    coverElement.style = 'opacity: 1';
                }, 1000)
            }, 4000)
        })
    }
    showCardsHint()

    document.getElementById('hint').addEventListener('click', function() {
        if (currentScore <= 0) {
            alert('game over!');
        } else {
            currentScore = currentScore - 5;
            keepScoreEl.innerHTML = currentScore;
            showCardsHint();
        }
    })

    allCards.forEach((card, i) => {
        card.setAttribute('id', `card-id-${i}`); //give each card unique id
        //when a card is clicked, find the shape its hiding and store in 'cardShape'
        card.addEventListener('click', function(){
            let cardShape = document.getElementById(`card-id-${i}`).children[1].src.replace(/^.*[\\/]/, '');
            let coverEl = card.children[0];
            coverEl.style = 'transform: rotate(180deg)'
        })
    })
    
    allCovers.forEach(cover => {      
        cover.addEventListener('click', function() {
            this.classList.add('hidden', 'disablePoinetrEvents') // clicking on the card expose the shape under. 
            exposedShape = cover.nextElementSibling.src.replace(/^.*[\\/]/, '');//clean the url so we only have the file name
            exposedShapesArray.push(exposedShape);// push the shape into a temporary array 
            //hiding /showing cards logic. 
            exposedCards++;
            allCovers.forEach((coverEl, index=0) => {
                let cardRootElement = coverEl.parentElement;
                //hide if 2 cards are exposed:
                if (coverEl.classList.contains('hidden')) {
                    if(exposedCards >= 2) {
                        let shapeMatch = exposedShapesArray[0] === exposedShapesArray[1];
                        if (shapeMatch) {
                            messageBoxEl.innerHTML = "<div>🃏🃏 Match! 👍🏻</div>";
                            messageBoxEl.classList.add('matchFound');
                            exposedShapesArray = [];
                            currentScore = currentScore + 5;
                            keepScoreEl.innerHTML = currentScore;
                            let shapeToRemove = coverEl.nextElementSibling;
                            if(cardRootElement) {
                                cardRootElement.classList.add('emptyCard', 'disablePoinetrEvents');
                            }
                            setTimeout(function(){
                                if(shapeToRemove) shapeToRemove.remove();
                                coverEl.remove();
                                exposedShapesArray = [];
                                exposedCards = 0;
                                messageBoxEl.innerHTML = '';
                                messageBoxEl.removeAttribute('class');
                            }, 2000)
                        } else {
                            messageBoxEl.innerHTML = "<div>🃏🃏 Don't Match 😥</div>";
                            messageBoxEl.classList.add('noMatch');
                            currentScore = currentScore - 2.5;
                            keepScoreEl.innerHTML = currentScore;
                            //cardRootElement.classList.remove('disablePoinetrEvents');
                            setTimeout(function(){
                                coverEl.classList.remove('hidden', 'disablePoinetrEvents');
                                //cardRootElement.classList.remove('disablePoinetrEvents');
                                exposedShapesArray = [];
                                exposedCards = 0;
                                messageBoxEl.innerHTML = '';
                                messageBoxEl.removeAttribute('class');
                            }, 1500)
                            
                        }                        
                    }
                }
            }) 
        })
    })
});
