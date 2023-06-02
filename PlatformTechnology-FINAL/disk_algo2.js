//Random Number Generation from 1-499
function autoGenerate()
{
    var x = document.querySelector("#inputNumbers");
    var i = Math.floor((Math.random() * 499) + 1);
    x.value += i + " ";
}

function Calculate() {
    var errorMessage = document.getElementById('errorMessage');  
    hideError(errorMessage);

    //Getting numbers(data)from user input
    var inputNumbersString = document.getElementById('inputNumbers').value;
    inputNumbersString = inputNumbersString.trim();
    var inputNumbers = inputNumbersString.split(" ");
    var inputHeadPos = document.getElementById('inputHeadPos').value;

    //Removing header values from user input
    for (var i = 0; i < inputNumbers.length; i++)
    {
        if (inputNumbers[i] == inputHeadPos)
        {
            inputNumbers.splice(i, 1);
        }
    }
    inputNumbers.unshift(inputHeadPos);

    //Removing the duplicate values
    inputNumbers = inputNumbers.filter(function (item, pos)
    {
        return inputNumbers.indexOf(item) == pos;
    });

    //Validation
    var isValidInput = true; 
    
    if (inputHeadPos == "") {
        //displaying error if occurred
        showError(errorMessage, "Current Head position is required");
        isValidInput = false;
    }

    //if value of inputHeadPos is not a number
    else if (isNaN(inputHeadPos)) {
        //displaying error if occurred
        showError(errorMessage, "Only Numeric value allowed for current Head position !!!");
        isValidInput = false;
    }

    //if value of inputHeadPos is negative
    else if (parseInt(inputHeadPos) < 0) {
        showError(errorMessage, "Current Head position must be positive integer");
        isValidInput = false;
    }

    //if value of userInputQueue is empty
    else if (inputNumbersString == "") {
        //displaying error if occurred
        showError(errorMessage, "Numeric values required for Queue");
        isValidInput = false;
    }
    else {
        var totalNumbers = inputNumbers.length;

        //using for loop to check every input of inputNumbers
        for (var i = 0; i < totalNumbers; i++) {

            //if values of inputNumbers is not a number
            if (isNaN(inputNumbers[i])) {
                //displaying error if occurred
                showError(errorMessage, "Number queue must only contain numbers");
                isValidInput = false;
            }

            //if values of inputNumbers is negative
             else if (parseInt(inputNumbers[i]) < 0 || parseInt(inputNumbers[i]) > 499) {
                showError(errorMessage, "Number queue values must be in the range of 1-499");
                isValidInput = false;
            }
        }
    }

    if(isValidInput){
    // var graphType = document.getElementById("chartType").value;
    var ctx = document.getElementById("line-chart").getContext('2d');
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sstf(inputNumbers, inputHeadPos),
            legend: {
                display: true
            },
            datasets: [
                {
                    label: "Shortest Seek Time First (SSTF) Algorithm",
                    data: seekAddressed,
                    lineTension: 0,
                    fill: false,
                    backgroundColor: "rgba(0,255,230, 0.8)",
                    borderColor: "rgba(0,255,230, 1)",
                    pointBackgroundColor: "rgba(0,255,230, 0.5)",
                    pointBorderColor: "#55bae7",
                    pointHoverBackgroundColor: "#55bae7",
                    pointHoverBorderColor: "#55bae7",
                }
            ]
        },
        options: {
            tooltips: {
                enabled: true
            },
            hover: {
                animationDuration: 1
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Seek Sequence"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Seek Count (upto Particular Point)",
                    }
                }]
            }
        }
    });

    document.querySelector(".canvas button").classList.add("printChart");
    document.querySelector(".printChart").style.visibility = "initial";
    document.querySelector(".printChart").addEventListener("click", function () {
        printImage();
    });
}
}

function printImage()
{
    var canvas = document.querySelector("#line-chart");
    var canvas_img = canvas.toDataURL("image/png",1.0);
    var pdf = new jsPDF('landscape','in', 'letter');
    pdf.addImage(canvas_img, 'png', .5, 1.75, 10, 5);
    pdf.save('SSTF Chart.pdf');
};

function showError(errorMessage, msg)
{
    errorMessage.classList.add('alert');
    errorMessage.classList.add('alert-danger');
    errorMessage.innerHTML = msg;
}

function hideError(errorMessage)
{
    errorMessage.classList.remove('alert');
    errorMessage.classList.remove('alert-danger');
    errorMessage.innerHTML = "";
}

function showResult(count, seekSequence)
{
    var div = document.getElementById('count-output');
    if (count == "") div.innerHTML = "";
    else div.innerHTML = "<br/>Seek Sequence: <b>[" + seekSequence + "]</b><br /><br/>Total Seek Count: <b>" + count + "<b>";
}

var seekCountSequence = [];
var seekAddressed = [];

function sstf(Numbers, Head)
{
    var tempArray = [];
    var visited = [];
    var totalNumbers = Numbers.length;
    var totalHeadMovements = 0;
    var distance = 0;
    var temp;

    for (var i = 0; i < totalNumbers; i++)
    {
        Numbers[i] = parseInt(Numbers[i]);
    }
    
    for (var i = 0; i < totalNumbers; i++)
    {
        visited.push(0);
    }
    temp = parseInt(Head);

    for (var i = 0; i < totalNumbers; i++)
    {
        var minValue = 1000000;
        var index;
        for (var j = 0; j < totalNumbers; j++)
        {
            if (Math.abs(temp - Numbers[j]) < minValue && (visited[j] === 0))
            {
                index = j;
                minValue = Math.abs(temp - Numbers[j]);
            }
        }
        totalHeadMovements += Math.abs(temp - Numbers[index]);
        seekCountSequence.push(totalHeadMovements);
        visited[index] = 1;
        temp = Numbers[index];
        seekAddressed.push(Numbers[index]);
    }
    for (var i = 1; i < totalNumbers; i++)
    {
        tempArray.push(seekAddressed[i]);
    }
    showResult(totalHeadMovements, tempArray);
    return seekCountSequence;
}
