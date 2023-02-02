import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { currentMember } from 'wix-members';
import wixWindow from 'wix-window';
import { getSet } from 'backend/examGenerator';

let rollOptions = {
    "duration": 300,
    "delay": 0
};

let timePermitted = "";
let totalNumberOfQuestions; // sets total number of questions to be presented
let questionNumber = 1;
let scoreArray = [];
let questionPack = [];
const questions = [];
const chosenAnswers = [];
const correctAnswers = [];
const explanations = [];
const explanationImages = [];
let questionArray = [];
let selectorArray = [];
let module;
let selectedAnswer = "none";
let percentage;
let timeTakenConverted;
let startTime;
let endTime;
let references = [];
let examResultsDataset;
let answer;
let writtenAnswersArray = [];

function startTimer() {
    startTime = new Date();
}

function endTimer() {
    endTime = new Date();
    let timeTaken = endTime - startTime; //in ms
    // strip the ms
    timeTaken /= 1000;
    // get seconds 
    let seconds = Math.round(timeTaken);
    timeTakenConverted = convertHMS(seconds);
}

function convertHMS(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    if (hours > 1) { return hours + ` hrs ` + minutes + ` mins ` + seconds + ` secs` }
    if (hours == 1) { return hours + ` hr ` + minutes + ` mins ` + seconds + ` secs` } else { return +minutes + ` mins ` + seconds + ` secs` }
}

$w.onReady(function () {
    $w("#dynamicDataset").onReady(() => {
        questionPack = $w("#dynamicDataset").getCurrentItem().refArray;
        timePermitted = $w("#dynamicDataset").getCurrentItem().timeAllowed;
        module = $w("#dynamicDataset").getCurrentItem().module;
        if ($w("#dynamicDataset").getCurrentItem().permittedResources) {
            $w("#openMaterials").expand(); 
            $w("#arrowDown").expand();
            }
        totalNumberOfQuestions = questionPack.length;

        let getMemberOptions = {
            fieldsets: ['FULL']
        }
        currentMember.getMember(getMemberOptions)
            .then((member) => {
                const loginEmail = member.loginEmail;
                $w("#text40").text = loginEmail;
                startTimer();
                initiate();
            })
            .catch((error) => {
                console.error("Login Error (please report to administrator): " + error);
                wixLocation.to(wixLocation.url);
            });
    });
    $w("#dropdown1").onChange((event) => {
        let selection = $w("#dropdown1").value;
        wixLocation.to(selection);
    });
});

async function initiate() {

    questionArray = await getSet(module, questionPack);
    $w("#repeater1").expand();
    $w("#repeater1").data = [questionArray[0]];
    $w("#questionText").text = questionNumber + ". " + questionArray[0].question;
    $w("#answerA").text = questionArray[0].answerA;
    $w("#answerB").text = questionArray[0].answerB;
    $w("#answerC").text = questionArray[0].answerC;
    $w("#answerD").text = questionArray[0].answerD;
    $w("#correctAnswerText").text = questionArray[0].correctAnswer;
    $w("#qImage").src = questionArray[0].relatedImage;
    $w("#qImage").tooltip = questionArray[0].question;
    if (!questionArray[0].relatedImage) {
        $w("#qImage").collapse();
    } else {
        $w("#qImage").expand();
    }
    $w("#progressBar1").targetValue = totalNumberOfQuestions;
    $w("#progressBar1").value = questionNumber;
    $w("#progressText").text = questionNumber + "/" + totalNumberOfQuestions;
    $w("#progressPercent").text = ((questionNumber / totalNumberOfQuestions) * 100).toFixed(1) + "%";
    $w("#qRefText").text = "Question Reference: " + questionArray[0].reference;
    if (!questionArray[0].answerB && !questionArray[0].answerC && !questionArray[0].answerD) {
        $w("#input").expand();
        $w("#answerA").collapse();
        $w("#answerB").collapse();
        $w("#answerC").collapse();
        $w("#answerD").collapse();
        $w('#answerCSelector').collapse();
        $w('#answerASelector').collapse();
        $w('#answerBSelector').collapse();
        $w('#answerDSelector').collapse();
        $w('#answerCTick').collapse();
        $w('#answerATick').collapse();
        $w('#answerBTick').collapse();
        $w('#answerDTick').collapse();
    } else {
        $w("#input").collapse();
        $w("#answerA").expand();
        $w("#answerB").expand();
        $w("#answerC").expand();
        $w("#answerD").expand();
        $w('#answerCSelector').expand();
        $w('#answerASelector').expand();
        $w('#answerBSelector').expand();
        $w('#answerDSelector').expand();
        $w('#answerCTick').expand();
        $w('#answerATick').expand();
        $w('#answerBTick').expand();
        $w('#answerDTick').expand();
    }
}

export function answerASelector_click(event) {
    $w("#answerASelector").hide();
    $w('#answerATick').show("roll", rollOptions);

    $w('#answerBTick').hide();
    $w('#answerBSelector').show();

    $w('#answerCTick').hide();
    $w('#answerCSelector').show();

    $w('#answerDTick').hide();
    $w('#answerDSelector').show();

    selectedAnswer = $w("#answerA").text; //changes selected answer to that which has been clicked
    selectorArray[questionNumber - 1] = "A";
}

export function answerBSelector_click(event) {
    $w("#answerBSelector").hide();
    $w('#answerBTick').show("roll", rollOptions);

    $w('#answerATick').hide();
    $w('#answerASelector').show();

    $w('#answerCTick').hide();
    $w('#answerCSelector').show();

    $w('#answerDTick').hide();
    $w('#answerDSelector').show();

    selectedAnswer = $w("#answerB").text; //changes selected answer to that which has been clicked  
    selectorArray[questionNumber - 1] = "B";
}

export function answerCSelector_click(event) {
    $w("#answerCSelector").hide();
    $w('#answerCTick').show("roll", rollOptions);

    $w('#answerATick').hide();
    $w('#answerASelector').show();

    $w('#answerBTick').hide();
    $w('#answerBSelector').show();

    $w('#answerDTick').hide();
    $w('#answerDSelector').show();

    selectedAnswer = $w("#answerC").text; //changes selected answer to that which has been clicked
    selectorArray[questionNumber - 1] = "C";
}

export function answerDSelector_click(event) {
    $w("#answerDSelector").hide();
    $w('#answerDTick').show("roll", rollOptions);
    $w('#answerATick').hide();
    $w('#answerASelector').show();

    $w('#answerCTick').hide();
    $w('#answerCSelector').show();

    $w('#answerBTick').hide();
    $w('#answerBSelector').show();

    selectedAnswer = $w("#answerD").text; //changes selected answer to that which has been clicked
    selectorArray[questionNumber - 1] = "D";
}

export function answerA_click(event) {
    $w("#answerASelector").hide();
    $w('#answerATick').show("roll", rollOptions);

    $w('#answerBTick').hide();
    $w('#answerBSelector').show();

    $w('#answerCTick').hide();
    $w('#answerCSelector').show();

    $w('#answerDTick').hide();
    $w('#answerDSelector').show();

    selectedAnswer = $w("#answerA").text; //changes selected answer to that which has been clicked    
    selectorArray[questionNumber - 1] = "A";
}

export function answerB_click(event) {
    $w("#answerBSelector").hide();
    $w('#answerBTick').show("roll", rollOptions);

    $w('#answerATick').hide();
    $w('#answerASelector').show();

    $w('#answerCTick').hide();
    $w('#answerCSelector').show();

    $w('#answerDTick').hide();
    $w('#answerDSelector').show();

    selectedAnswer = $w("#answerB").text; //changes selected answer to that which has been clicked
    selectorArray[questionNumber - 1] = "B";
}

export function answerC_click(event) {
    $w("#answerCSelector").hide();
    $w('#answerCTick').show("roll", rollOptions);

    $w('#answerATick').hide();
    $w('#answerASelector').show();

    $w('#answerBTick').hide();
    $w('#answerBSelector').show();

    $w('#answerDTick').hide();
    $w('#answerDSelector').show();

    selectedAnswer = $w("#answerC").text; //changes selected answer to that which has been clicked
    selectorArray[questionNumber - 1] = "C";
}
export function answerD_click(event) {
    $w("#answerDSelector").hide();
    $w('#answerDTick').show("roll", rollOptions);
    $w('#answerATick').hide();
    $w('#answerASelector').show();

    $w('#answerCTick').hide();
    $w('#answerCSelector').show();

    $w('#answerBTick').hide();
    $w('#answerBSelector').show();

    selectedAnswer = $w("#answerD").text; //changes selected answer to that which has been clicked
    selectorArray[questionNumber - 1] = "D";
}

//----------------------------------------------------------------------------------------------------------------------------------------

export function nextButton_click(event) {

    if (selectorArray[questionNumber - 1] == "A" && $w('#answerATick').hidden) {
        $w('#answerASelector').hide()
        $w('#answerBSelector').show()
        $w('#answerCSelector').show()
        $w('#answerDSelector').show()
        $w('#answerATick').show()
        $w('#answerBTick').hide()
        $w('#answerCTick').hide()
        $w('#answerDTick').hide()
    }
    if (selectorArray[questionNumber - 1] == "B" && $w('#answerBTick').hidden) {
        $w('#answerBSelector').hide()
        $w('#answerASelector').show()
        $w('#answerCSelector').show()
        $w('#answerDSelector').show()
        $w('#answerBTick').show()
        $w('#answerATick').hide()
        $w('#answerCTick').hide()
        $w('#answerDTick').hide()
    }
    if (selectorArray[questionNumber - 1] == "C" && $w('#answerCTick').hidden) {
        $w('#answerCSelector').hide()
        $w('#answerASelector').show()
        $w('#answerBSelector').show()
        $w('#answerDSelector').show()
        $w('#answerCTick').show()
        $w('#answerATick').hide()
        $w('#answerBTick').hide()
        $w('#answerDTick').hide()
    }
    if (selectorArray[questionNumber - 1] == "D" && $w('#answerDTick').hidden) {
        $w('#answerDSelector').hide()
        $w('#answerASelector').show()
        $w('#answerCSelector').show()
        $w('#answerBSelector').show()
        $w('#answerDTick').show()
        $w('#answerATick').hide()
        $w('#answerCTick').hide()
        $w('#answerBTick').hide()
    }

    $w("#nextButton").collapse();
    $w("#prevButton").collapse();

    if ($w("#answerATick").hidden && $w("#answerBTick").hidden && $w("#answerCTick").hidden && $w("#answerDTick").hidden && answer == undefined) {
        selectedAnswer = "None selected";
        selectorArray[questionNumber - 1] = "None";
        $w('#answerDSelector').show()
        $w('#answerASelector').show()
        $w('#answerCSelector').show()
        $w('#answerBSelector').show()
        $w('#answerDTick').hide()
        $w('#answerATick').hide()
        $w('#answerCTick').hide()
        $w('#answerBTick').hide()
    } else {
        if (!$w("#answerATick").hidden) {
            selectedAnswer = $w("#answerA").text;
            selectorArray[questionNumber - 1] = "A";
        }
        if (!$w("#answerBTick").hidden) {
            selectedAnswer = $w("#answerB").text;
            selectorArray[questionNumber - 1] = "B";
        }
        if (!$w("#answerCTick").hidden) {
            selectedAnswer = $w("#answerC").text;
            selectorArray[questionNumber - 1] = "C";
        }
        if (!$w("#answerDTick").hidden) {
            selectedAnswer = $w("#answerD").text;
            selectorArray[questionNumber - 1] = "D";
        }
        if (answer != undefined) {
            selectedAnswer = answer;
            selectorArray[questionNumber - 1] = "E";
            writtenAnswersArray[questionNumber - 1] = answer;

        }
    }

    chosenAnswers[questionNumber - 1] = selectedAnswer;
    correctAnswers[questionNumber - 1] = $w("#correctAnswerText").text;
    questions[questionNumber - 1] = $w("#questionText").text;
    references[questionNumber - 1] = questionArray[questionNumber - 1].reference;
    explanations[questionNumber - 1] = questionArray[questionNumber - 1].explanation;
    explanationImages[questionNumber - 1] = questionArray[questionNumber - 1].explanationImage;

    if ($w("#correctAnswerText").text.includes(selectedAnswer)) {
        scoreArray[questionNumber - 1] = 1;
    } else {
        scoreArray[questionNumber - 1] = 0;

    }

    setTimeout(nextCheck, 600);

    function nextCheck() {
        questionNumber++;

        if (questionNumber == totalNumberOfQuestions) {
            $w("#nextButton").label = "Submit";
        }

        if (questionNumber > totalNumberOfQuestions) { //what happens at the end of the test

            endTimer();
            $w("#prevButton").collapse();
            $w("#repeater1").collapse();
            $w("#nextButton").collapse();
            $w("#answersGroup1").expand(); //had to split answers into two groups as there was too many items to group together as one
            $w("#answersGroup2").expand();
            $w("#answersGroup3").expand();
            $w("#answersGroup4").expand();
            $w("#answersGroup5").expand();
            $w("#answersGroup6").expand();
            $w("#answersGroup7").expand();

            let score = 0;
            for (let i = 0; i < scoreArray.length; i++) {
                score += scoreArray[i];
            }

            percentage = ((score / totalNumberOfQuestions) * 100).toFixed(2);
            if(percentage >= parseInt($w("#dynamicDataset").getCurrentItem().passMark)) { //nothing wrong with this line, ignore wavy line
              $w("#yourScoreText").text = "Result: Pass" + "\n" + "Your score is " + score + " out of " + totalNumberOfQuestions + " (" + percentage + "%)" + "\n" + "\n" +
                "Click on the correct answer of any question to view an explanation (requires online ground school).";  
            } else {
            $w("#yourScoreText").text = "Result: Fail" + "\n" + "Your score is " + score + " out of " + totalNumberOfQuestions + " (" + percentage + "%)" + "\n" + "\n" +
                "Click on the correct answer of any question to view an explanation (requires online ground school).";
            }

            for (let i = 1; i < 61; i++) {
                $w(`#q${i}QuestionText`).text = questions[i - 1];
                $w(`#q${i}CorrectAnswerText`).text = "Question Reference: " + references[i - 1] + "\nCorrect answer: " + correctAnswers[i - 1];
                let ca = "Your answer: " + chosenAnswers[i - 1];
                $w(`#q${i}ChosenAnswerText`).text = "Your answer: " + chosenAnswers[i - 1];
                if (correctAnswers[i - 1]) {
                    if (!correctAnswers[i - 1].includes(chosenAnswers[i - 1])) {
                        $w(`#q${i}ChosenAnswerText`).html = "<p style='font-size: 16px; font-style: lato light; text-align: left; color: #FF4040;'>" + ca; + "</p"
                    }
                }

                if (!questions[i - 1]) {
                    $w(`#q${i}QuestionText`).collapse()
                    $w(`#q${i}CorrectAnswerText`).collapse()
                    $w(`#q${i}ChosenAnswerText`).collapse()
                }
            }

            let today = new Date();
            let year = today.getFullYear();
            let day = today.getDate();
            let month = (today.getMonth() + 1);
            let hour = today.getHours();
            let minute = today.getMinutes();
            let second = today.getSeconds();
            let convertedDay;
            let convertedMonth;
            let convertedHour;
            let convertedMinute;
            let convertedSecond;
            if (day < 10) {
                convertedDay = '0' + day;
            } else {
                convertedDay = day;
            }
            if (month < 10) {
                convertedMonth = '0' + month;
            } else {
                convertedMonth = month;
            }
            if (hour < 10) {
                convertedHour = '0' + hour;
            } else {
                convertedHour = hour;
            }
            if (minute < 10) {
                convertedMinute = '0' + minute;
            } else {
                convertedMinute = minute;
            }
            if (second < 10) {
                convertedSecond = '0' + second;
            } else {
                convertedSecond = second;
            }

            let dateTime = `${convertedDay}/${convertedMonth}/${year} ${convertedHour}:${convertedMinute}:${convertedSecond}`

            let toInsert = {
                "exam": $w("#dynamicDataset").getCurrentItem().resultsName,
                "date": dateTime,
                "score": percentage.toString(),
                "email": $w("#text40").text,
                "pass": $w('#dynamicDataset').getCurrentItem().passMark,
                "time": timeTakenConverted,
                "correctAnswers": score.toString(),
                "outof": totalNumberOfQuestions.toString(),
                "timePermitted": timePermitted,
                "password": "Set",
            };

            if ($w("#text41").text.includes("progress") || $w("#text41").text.includes("Competency")) {
                examResultsDataset = "examResultsProg";
            } else {
                examResultsDataset = "examResults";
            }

            wixData.insert(examResultsDataset, toInsert)
                .then((results) => {
                    let item = results;
                })
                .catch((err) => {
                    let errorMsg = err;
                });

        }

        answer = undefined;
        $w("#repeater1").data = [questionArray[questionNumber - 1]];
        $w("#questionText").text = questionNumber + ". " + questionArray[questionNumber - 1].question;
        $w("#answerA").text = questionArray[questionNumber - 1].answerA;
        $w("#answerB").text = questionArray[questionNumber - 1].answerB;
        $w("#answerC").text = questionArray[questionNumber - 1].answerC;
        $w("#answerD").text = questionArray[questionNumber - 1].answerD;
        $w("#correctAnswerText").text = questionArray[questionNumber - 1].correctAnswer;
        $w("#qImage").src = questionArray[questionNumber - 1].relatedImage;
        $w("#qImage").tooltip = questionArray[questionNumber - 1].question;
        if (!questionArray[questionNumber - 1].relatedImage) {
            $w("#qImage").collapse();
        } else {
            $w("#qImage").expand();
        }
        $w("#progressBar1").targetValue = totalNumberOfQuestions;
        $w("#progressBar1").value = questionNumber;
        $w("#progressText").text = questionNumber + "/" + totalNumberOfQuestions;
        $w("#progressPercent").text = ((questionNumber / totalNumberOfQuestions) * 100).toFixed(1) + "%";
        $w("#qRefText").text = "Question Reference: " + questionArray[questionNumber - 1].reference;

        if (!questionArray[questionNumber - 1].answerB && !questionArray[questionNumber - 1].answerC && !questionArray[questionNumber - 1].answerD) {
            $w("#input").expand();
            $w("#answerA").collapse();
            $w("#answerB").collapse();
            $w("#answerC").collapse();
            $w("#answerD").collapse();
            $w('#answerCSelector').collapse();
            $w('#answerASelector').collapse();
            $w('#answerBSelector').collapse();
            $w('#answerDSelector').collapse();
            $w('#answerCTick').collapse();
            $w('#answerATick').collapse();
            $w('#answerBTick').collapse();
            $w('#answerDTick').collapse();

        } else {
            $w("#input").collapse();
            $w("#answerA").expand();
            $w("#answerB").expand();
            $w("#answerC").expand();
            $w("#answerD").expand();
            $w('#answerCSelector').expand();
            $w('#answerASelector').expand();
            $w('#answerBSelector').expand();
            $w('#answerDSelector').expand();
            $w('#answerCTick').expand();
            $w('#answerATick').expand();
            $w('#answerBTick').expand();
            $w('#answerDTick').expand();

        }

        if (selectorArray[questionNumber - 1] == "None" || !selectorArray[questionNumber - 1])
            $w('#answerATick').hide();
        $w('#answerBTick').hide();
        $w('#answerCTick').hide();
        $w('#answerDTick').hide();
        $w('#answerASelector').show();
        $w('#answerBSelector').show();
        $w('#answerCSelector').show();
        $w('#answerDSelector').show();

        if (selectorArray[questionNumber - 1] == "A" && $w('#answerATick').hidden) {
            $w('#answerASelector').hide()
            $w('#answerBSelector').show()
            $w('#answerCSelector').show()
            $w('#answerDSelector').show()
            $w('#answerATick').show()
            $w('#answerBTick').hide()
            $w('#answerCTick').hide()
            $w('#answerDTick').hide()
        }
        if (selectorArray[questionNumber - 1] == "B" && $w('#answerBTick').hidden) {
            $w('#answerBSelector').hide()
            $w('#answerASelector').show()
            $w('#answerCSelector').show()
            $w('#answerDSelector').show()
            $w('#answerBTick').show()
            $w('#answerATick').hide()
            $w('#answerCTick').hide()
            $w('#answerDTick').hide()
        }
        if (selectorArray[questionNumber - 1] == "C" && $w('#answerCTick').hidden) {
            $w('#answerCSelector').hide()
            $w('#answerASelector').show()
            $w('#answerBSelector').show()
            $w('#answerDSelector').show()
            $w('#answerCTick').show()
            $w('#answerATick').hide()
            $w('#answerBTick').hide()
            $w('#answerDTick').hide()
        }
        if (selectorArray[questionNumber - 1] == "D" && $w('#answerDTick').hidden) {
            $w('#answerDSelector').hide()
            $w('#answerASelector').show()
            $w('#answerCSelector').show()
            $w('#answerBSelector').show()
            $w('#answerDTick').show()
            $w('#answerATick').hide()
            $w('#answerCTick').hide()
            $w('#answerBTick').hide()
        }

        if (selectorArray[questionNumber - 1] == "E") {
            $w("#input").value = writtenAnswersArray[questionNumber - 1];
            answer = writtenAnswersArray[questionNumber - 1]
        }

        $w("#nextButton").expand();
        if (questionNumber !== 1) {
            $w("#prevButton").expand();
        }

    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

export function prevButton_click(event) {
    $w("#prevButton").collapse();
    $w("#nextButton").collapse();
    questionNumber--;
    delete chosenAnswers[questionNumber - 1];
    delete correctAnswers[questionNumber - 1];
    delete questions[questionNumber - 1];
    delete references[questionNumber - 1];
    answer = undefined;
    delete explanations[questionNumber - 1];
    delete explanationImages[questionNumber - 1];

    $w("#repeater1").data = [questionArray[questionNumber - 1]];
    $w("#questionText").text = questionNumber + ". " + questionArray[questionNumber - 1].question;
    $w("#answerA").text = questionArray[questionNumber - 1].answerA;
    $w("#answerB").text = questionArray[questionNumber - 1].answerB;
    $w("#answerC").text = questionArray[questionNumber - 1].answerC;
    $w("#answerD").text = questionArray[questionNumber - 1].answerD;
    $w("#correctAnswerText").text = questionArray[questionNumber - 1].correctAnswer;
    $w("#qImage").src = questionArray[questionNumber - 1].relatedImage;
    $w("#qImage").tooltip = questionArray[questionNumber - 1].question;
    if (!questionArray[questionNumber - 1].relatedImage) {
        $w("#qImage").collapse();
    } else {
        $w("#qImage").expand();
    }
    $w("#progressBar1").targetValue = totalNumberOfQuestions;
    $w("#progressBar1").value = questionNumber;
    $w("#progressText").text = questionNumber + "/" + totalNumberOfQuestions;
    $w("#progressPercent").text = ((questionNumber / totalNumberOfQuestions) * 100).toFixed(1) + "%";
    $w("#qRefText").text = "Question Reference: " + questionArray[questionNumber - 1].reference;

   if (!questionArray[questionNumber - 1].answerB && !questionArray[questionNumber - 1].answerC && !questionArray[questionNumber - 1].answerD) {
        $w("#input").expand();
        $w("#answerA").collapse();
        $w("#answerB").collapse();
        $w("#answerC").collapse();
        $w("#answerD").collapse();
        $w('#answerCSelector').collapse();
        $w('#answerASelector').collapse();
        $w('#answerBSelector').collapse();
        $w('#answerDSelector').collapse();
        $w('#answerCTick').collapse();
        $w('#answerATick').collapse();
        $w('#answerBTick').collapse();
        $w('#answerDTick').collapse();

    } else {
        $w("#input").collapse();
        $w("#answerA").expand();
        $w("#answerB").expand();
        $w("#answerC").expand();
        $w("#answerD").expand();
        $w('#answerCSelector').expand();
        $w('#answerASelector').expand();
        $w('#answerBSelector').expand();
        $w('#answerDSelector').expand();
        $w('#answerCTick').expand();
        $w('#answerATick').expand();
        $w('#answerBTick').expand();
        $w('#answerDTick').expand();

    }

    $w('#answerDSelector').show()
    $w('#answerASelector').show()
    $w('#answerCSelector').show()
    $w('#answerBSelector').show()
    $w('#answerDTick').hide()
    $w('#answerATick').hide()
    $w('#answerCTick').hide()
    $w('#answerBTick').hide()

    setTimeout(check, 600);

    function check() {
        if (selectorArray[questionNumber - 1] == "A") {
            $w('#answerASelector').hide()
            $w('#answerBSelector').show()
            $w('#answerCSelector').show()
            $w('#answerDSelector').show()
            $w('#answerATick').show()
            $w('#answerBTick').hide()
            $w('#answerCTick').hide()
            $w('#answerDTick').hide()
        } else if (selectorArray[questionNumber - 1] == "B") {
            $w('#answerBSelector').hide()
            $w('#answerASelector').show()
            $w('#answerCSelector').show()
            $w('#answerDSelector').show()
            $w('#answerBTick').show()
            $w('#answerATick').hide()
            $w('#answerCTick').hide()
            $w('#answerDTick').hide()
        } else if (selectorArray[questionNumber - 1] == "C") {
            $w('#answerCSelector').hide()
            $w('#answerASelector').show()
            $w('#answerBSelector').show()
            $w('#answerDSelector').show()
            $w('#answerCTick').show()
            $w('#answerATick').hide()
            $w('#answerBTick').hide()
            $w('#answerDTick').hide()
        } else if (selectorArray[questionNumber - 1] == "D") {
            $w('#answerDSelector').hide()
            $w('#answerASelector').show()
            $w('#answerCSelector').show()
            $w('#answerBSelector').show()
            $w('#answerDTick').show()
            $w('#answerATick').hide()
            $w('#answerCTick').hide()
            $w('#answerBTick').hide()
        } else if (selectorArray[questionNumber - 1] == "E") {
            $w("#input").value = writtenAnswersArray[questionNumber - 1];
            answer = writtenAnswersArray[questionNumber - 1];
        }

        $w("#nextButton").label = "Next";
        $w("#nextButton").expand();
        if (questionNumber !== 1) {
            $w("#prevButton").expand();
        }

    }
}
export function input_change(event) {
    answer = event.target.value;
}

function lFormer(arrayIndex) {
    wixWindow.openLightbox("Explanation", {
        "lQuestionText": (arrayIndex + 1) + ". " + questionArray[arrayIndex].question,
        "lAnswerAText": questionArray[arrayIndex].answerA,
        "lAnswerBText": questionArray[arrayIndex].answerB,
        "lAnswerCText": questionArray[arrayIndex].answerC,
        "lAnswerDText": questionArray[arrayIndex].answerD,
        "lRelatedImage": questionArray[arrayIndex].relatedImage,
        "lChosenAnswer": chosenAnswers[arrayIndex],
        "lCorrectAnswer": correctAnswers[arrayIndex],
        "lExplanation": explanations[arrayIndex],
        "lExplanationImage": explanationImages[arrayIndex],
        "lReference": references[arrayIndex],
        "lSubject": $w("#text41").text,
        "lModule": module
    });
}

export function q1CorrectAnswerText_click(event) {
    lFormer(0);
}

export function q2CorrectAnswerText_click(event) {
    lFormer(1)
}

export function q3CorrectAnswerText_click(event) {
    lFormer(2)
}

export function q4CorrectAnswerText_click(event) {
    lFormer(3)
}

export function q5CorrectAnswerText_click(event) {
    lFormer(4)
}

export function q6CorrectAnswerText_click(event) {
    lFormer(5)
}

export function q7CorrectAnswerText_click(event) {
    lFormer(6)
}

export function q8CorrectAnswerText_click(event) {
    lFormer(7)
}

export function q9CorrectAnswerText_click(event) {
    lFormer(8)
}

export function q10CorrectAnswerText_click(event) {
    lFormer(9)
}

export function q11CorrectAnswerText_click(event) {
    lFormer(10)
}

export function q12CorrectAnswerText_click(event) {
    lFormer(11)
}

export function q13CorrectAnswerText_click(event) {
    lFormer(12)
}

export function q14CorrectAnswerText_click(event) {
    lFormer(13)
}

export function q15CorrectAnswerText_click(event) {
    lFormer(14)
}

export function q16CorrectAnswerText_click(event) {
    lFormer(15)
}

export function q17CorrectAnswerText_click(event) {
    lFormer(16);
}

export function q18CorrectAnswerText_click(event) {
    lFormer(17)
}

export function q19CorrectAnswerText_click(event) {
    lFormer(18)
}

export function q20CorrectAnswerText_click(event) {
    lFormer(19)
}

export function q21CorrectAnswerText_click(event) {
    lFormer(20)
}

export function q22CorrectAnswerText_click(event) {
    lFormer(21)
}

export function q23CorrectAnswerText_click(event) {
    lFormer(22)
}

export function q24CorrectAnswerText_click(event) {
    lFormer(23)
}

export function q25CorrectAnswerText_click(event) {
    lFormer(24)
}

export function q26CorrectAnswerText_click(event) {
    lFormer(25)
}

export function q27CorrectAnswerText_click(event) {
    lFormer(26)
}

export function q28CorrectAnswerText_click(event) {
    lFormer(27)
}

export function q29CorrectAnswerText_click(event) {
    lFormer(28)
}

export function q30CorrectAnswerText_click(event) {
    lFormer(29)
}

export function q31CorrectAnswerText_click(event) {
    lFormer(30)
}

export function q32CorrectAnswerText_click(event) {
    lFormer(31)
}

export function q33CorrectAnswerText_click(event) {
    lFormer(32)
}

export function q34CorrectAnswerText_click(event) {
    lFormer(33)
}

export function q35CorrectAnswerText_click(event) {
    lFormer(34)
}

export function q36CorrectAnswerText_click(event) {
    lFormer(35)
}

export function q37CorrectAnswerText_click(event) {
    lFormer(36)
}

export function q38CorrectAnswerText_click(event) {
    lFormer(37)
}

export function q39CorrectAnswerText_click(event) {
    lFormer(38)
}

export function q40CorrectAnswerText_click(event) {
    lFormer(39)
}

export function q41CorrectAnswerText_click(event) {
    lFormer(40)
}

export function q42CorrectAnswerText_click(event) {
    lFormer(41)
}

export function q43CorrectAnswerText_click(event) {
    lFormer(42)
}

export function q44CorrectAnswerText_click(event) {
    lFormer(43)
}

export function q45CorrectAnswerText_click(event) {
    lFormer(44)
}

export function q46CorrectAnswerText_click(event) {
    lFormer(45)
}

export function q47CorrectAnswerText_click(event) {
    lFormer(46)
}

export function q48CorrectAnswerText_click(event) {
    lFormer(47)
}

export function q49CorrectAnswerText_click(event) {
    lFormer(48)
}

export function q50CorrectAnswerText_click(event) {
    lFormer(49)
}

export function q51CorrectAnswerText_click(event) {
    lFormer(50)
}

export function q52CorrectAnswerText_click(event) {
    lFormer(51)
}

export function q53CorrectAnswerText_click(event) {
    lFormer(52)
}

export function q54CorrectAnswerText_click(event) {
    lFormer(53)
}

export function q55CorrectAnswerText_click(event) {
    lFormer(54)
}

export function q56CorrectAnswerText_click(event) {
    lFormer(55)
}

export function q57CorrectAnswerText_click(event) {
    lFormer(56)
}

export function q58CorrectAnswerText_click(event) {
    lFormer(57)
}

export function q59CorrectAnswerText_click(event) {
    lFormer(58)
}

export function q60CorrectAnswerText_click(event) {
    lFormer(59)
}

export function openMaterials_click(event) {
if ($w("#resourceListText").collapsed) {
$w("#resourceListText").expand();
$w("#arrowDown").collapse();
$w("#arrowUp").expand(); 
} else {
$w("#resourceListText").collapse();
$w("#arrowDown").expand();
$w("#arrowUp").collapse(); 
}
}

export function arrowUp_click(event) {
openMaterials_click(event);
}
export function arrowDown_click(event) {
openMaterials_click(event);
}

