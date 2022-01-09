let start_Game = document.querySelector('.Start_Game') ;
let cover = document.querySelector('.cover') ;
let icon = document.querySelector('i');
let btn_start_Game = document.querySelector('.Start_Game span ') ;
let countSpan = document.querySelector('.quiz-info .count span') ;
let bullets = document.querySelector('.bullets');
let bulletsSpanContainer = document.querySelector('.bullets .spans') ;
let quizArea = document.querySelector('.quiz-area') ;
let answersArea = document.querySelector('.answers-area') ;
let submitButton = document.querySelector('.submit_button') ;
let resultsContainer = document.querySelector('.results') ;
let countDownElement = document.querySelector('.countdown') ;
let arrayOfSpans  ;
let currentIndex = 0 ;
let rightAnswers = 0 ;
let The_Seconds =  20  ;
let countDownIntrval ;
let currect_color_timer ;
let All_Questions = [] ;
let  question_count = 15;


icon.onclick = function () { window.location.reload() ;}

// get_Questions () ;
btn_start_Game.onclick = function () {
  
   start_Game.remove() ;
   get_Questions () ;
} ;



document.onkeydown = function (e) {
    if  (e.keyCode === 13) {
       submitButton.click() ;
    }
}


function get_Questions () {
    let myRequest = new XMLHttpRequest() ;
        myRequest.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200)
                {
                    All_Questions  = JSON.parse(this.responseText) ;
                    let questions_object = [] ;
                  
                    // shuffel questions 
                  Questions_Shuffels(All_Questions) ;
                //   console.log(All_Questions.length);
                    for (let i = 0 ; i < question_count ; i ++) {
                        questions_object.push(All_Questions[i]) ;
                    }
                   
                  let qCount = questions_object.length  ;
                  // create bullet and set questions count
                  createBullets(qCount) ;
                  // add question data
                  addQuestionData(questions_object[currentIndex] , qCount) ;
                  //  start count down 
                  clearInterval(countDownIntrval);
                  countdown(The_Seconds , qCount) ;

                  // click on submit 
                  submitButton.onclick = function () {
                      this.setAttribute('disabled' , true ) ;
                    cover.style.display = 'block' ;
                    clearInterval(countDownIntrval);
                     // get right answer 
                      let theRightAnswer = questions_object[currentIndex].right_answer ;

                      //check the answer 
                      checkAnswer(theRightAnswer , qCount);
                      
                      setTimeout(() => {
                          // clear currect color timer
                          clearInterval(currect_color_timer);
                             // increase  questions index 
                    currentIndex ++ ;
                    // remove  previes question
                    quizArea.innerHTML = "" ;
                    answersArea.innerHTML = "" ;
                    // bring the next question 
                    addQuestionData(questions_object[currentIndex] , qCount) ;
                     // handle bullet class
                     handleBullets() ;
                          // show results
                          showResults(qCount) ;
                         
                          countdown(The_Seconds , qCount) ;
                          cover.style.display = 'none' ;
                          this.removeAttribute('disabled') ;
                    },1500);
                  };
                }
        }
    myRequest.open("GET" , "Quistions.json" ,true) ;
    myRequest.send() ;



}



function createBullets(num) {
    countSpan.innerHTML = num ;

    //create spans 
    for (let i = 0 ; i < num  ;i++)
    {
        let theBullet = document.createElement('span') ;
        theBullet.textContent = i+1;
        if ( i === 0) { theBullet.className = 'on' ;}
        bulletsSpanContainer.appendChild(theBullet) ;

    }

    let bulletsSpans = document.querySelectorAll ('.bullets .spans span') ;
     arrayOfSpans = Array.from(bulletsSpans) ;

    //  console.log(arrayOfSpans) ;
} 

function addQuestionData (obj , count) {

    if (currentIndex < count )
{   
     // create question title
  let questionTitle = document.createElement("h2") ;

  // create question text 
  let questionText = document.createTextNode(obj.title) ;

  // append text to h2 
  questionTitle.appendChild(questionText) ;
// append h2 to quiz area 
quizArea.appendChild(questionTitle) ;
// this array will take and shuffel the answers 
let Array_Of_Answers = [] ;
// add answers to the array 
    for (let i = 1 ; i <= 4 ; i++) {
        Array_Of_Answers.push(obj['answer_' + i]) ; 
    }
    Questions_Shuffels(Array_Of_Answers);

    // Create Answers
  for (let i = 0 ; i < Object.keys(obj).length -2 ; i++) {
      // return the answers after shuffeling
    obj['answer_'+(i+1)]  = Array_Of_Answers[i] ;
     // create main answer div 
     let mainDiv = document.createElement ("div") ;
     //add class to main div
     mainDiv.className = 'answer' ;
     // create radio input 
     let radioInput = document.createElement ('input');
     // add type  , name , id  , data-attribute
     radioInput.name = 'question' ;
     radioInput.type = 'radio' ;
     radioInput.id = ('answer_' + (i+1)) ;
     radioInput.dataset.answer = obj['answer_'+(i+1)]  ;
     // make first option  selected as default 
     if (i === 0) { radioInput.checked = true  ;  }
     // create label 
     let theLabel = document.createElement('label') ;
     // add for attribute 
     theLabel.htmlFor = 'answer_'+(i+1) ;
     // create label text 
     let theLabelText = document.createTextNode(obj['answer_'+(i+1)]) ;
     // add the text o label 
     theLabel.appendChild(theLabelText) ;
     // add input , label to main div 
     mainDiv.appendChild(radioInput);
     mainDiv.appendChild(theLabel);

    // append all divs to answers area 
    answersArea.appendChild(mainDiv) ;

    // this will auto select on raio button to make user selct choid by arrow 
    answersArea.children[0].children[0].focus()
} 
//  i do this to make arrow change selction but the browser make auto select by him silf
// let radio_array1 = Array.from(document.querySelectorAll('.quiz-app  .answers-area  .answer input'));

// radio_array1.forEach(function (el) {
    // document.addEventListener("keyup",function(e) {
        // if press down
        // console.log(e.keyCode)
        // if (e.keyCode=== 40) {
            //   if (el.checked && ( el.parentElement.nextElementSibling  != null)) {
                // el.parentElement.nextElementSibling.children[0].checked
              // console.log()   ;
            //   }  
        }
        //if press  up
        // else if (e.keyCode === 38) {
          
        // } 
    // }) ;
// })
    // }
}


function checkAnswer (right_answer , count) {
    // here we use select All radio button by name
    let answers = document.getElementsByName('question') ;
    // this is for colored the answer 
    let answers_array = Array.from( document.querySelectorAll ('.answers-area  .answer label') );
   
    let theChoosenAnswer ;

    // if the radio is checked give me the answer on it
    for (let i = 0 ; i < answers.length ; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
        // if answer is right
    if (right_answer === theChoosenAnswer) {
        
        document.querySelector('#success').play();
        for (let i = 0 ; i< answers_array.length ; i++ ){
            // if the answer is right search on it and make it green
                if (answers_array[i].textContent === theChoosenAnswer) {
                    answers_array[i].style.backgroundColor = 'green' ;
                    answers_array[i].style.color = 'white' ;
                }
        };
        rightAnswers ++ ;
     
        arrayOfSpans[currentIndex].classList.add("right");
    } 
     // else if answer is wrong 
    else {
        document.getElementById('fail').play() ;
        for (let i = 0 ; i< answers_array.length ; i++ ){
              // if the answer is wrong search on it and make it red
            if (answers_array[i].textContent === theChoosenAnswer) {
                answers_array[i].style.backgroundColor = 'crimson' ;
                answers_array[i].style.color = 'white' ;
            }
            // then color the currect answer with different color
            if (answers_array[i].textContent === right_answer) 
            {
                console.log(answers_array[i].textContent + " " + right_answer);
               currect_color_timer =  setInterval(() => {
                    answers_array[i].classList.toggle('animation'); 
                }, 300);

            }
    };
        arrayOfSpans[currentIndex ].classList.add("wrong");
    }
}

function handleBullets () {
 
    arrayOfSpans.forEach(function(span , index) {
        if (currentIndex === index) {
            span.classList.add('on') ;
            // span.className = "on" ;
        }
    })

}

function showResults (count) {
    let theResult ;
   
    if ( currentIndex === count ) {
            quizArea.remove() ;
            answersArea.remove() ;
            submitButton.remove() ;
            bullets.remove() ;

            if (rightAnswers > (count / 2) &&  rightAnswers < count ) {
                theResult = `<span class = "good"> جيد ${rightAnswers}  /  ${count} </span> "مستواك احسن من لورد بودي  بشوي"`  ;
                // theResult = `<span class = "good"> جيد ${rightAnswers}  /  ${count} </span> "مستواك احسن من فاطمة  بشوي"`  ;
            } else if (rightAnswers === count) {
                theResult = `<span class = "perfect"> ممتاز ${rightAnswers}  /  ${count}</span> `  ;
            } else if (rightAnswers < (count / 2) && rightAnswers !== 0){
                theResult = `<span class = "bad">   سيء   ${rightAnswers}  /  ${count} </span>   " حتى لورد بوددي كان حيجاوب احسن منك"   `  ; 
                // theResult = `<span class = "bad">   سيء   ${rightAnswers}  /  ${count} </span>   " حتى فاطمة كانت حيجاوب احسن منك"   `  ; 
            } else {
                theResult = `<span class = "zero">   فاشل   ${rightAnswers}  /  ${count} </span>   " ادفن نفسك احسن"   `  ;
            }
            resultsContainer.innerHTML = theResult ;
            document.querySelector("i").classList.add("restart");
    }
}


function countdown (duration , count){

    let minutes , seconds ;

    minutes = parseInt(duration / 60) ;
    seconds = parseInt(duration % 60) ;
    minutes = minutes < 10 ? "0" + minutes :minutes ;
    seconds = seconds < 10 ? "0" + seconds :seconds ;
    countDownElement.innerHTML = `${minutes} : ${seconds}` ;

    if (currentIndex < count) {
       
        countDownElement.innerHTML = `${minutes} : ${seconds}` ;
      countDownIntrval = setInterval(() => {
            minutes = parseInt(duration / 60) ;
            seconds = parseInt(duration % 60) ;
            minutes = minutes < 10 ? "0" + minutes :minutes ;
            seconds = seconds < 10 ? "0" + seconds :seconds ;
            countDownElement.innerHTML = `${minutes} : ${seconds}` ;

            if (--duration < 0){
                clearInterval(countDownIntrval);
                // if time is finished Force Trigger
                submitButton.click();
            }
        }, 1000);

    }
}


function Questions_Shuffels(array_of_questions) {
    let question_length = array_of_questions.length ,
     random , Temp ;
     while (question_length > 0 ) {
     random = Math.floor (Math.random() * question_length) ; 
     question_length -- ;
     Temp = array_of_questions [question_length]  ;
     array_of_questions[question_length]  = array_of_questions[random]  ;
     array_of_questions[random]  =  Temp ; 
     }
}


