// Function to calculate the C-scan algorithm
function Calculate() {
    // Get input values
    var inputNumbers = document.getElementById('inputNumbers').value;
    var inputHeadPos = parseInt(document.getElementById('inputHeadPos').value);
    var userInputDirection = document.getElementById('userInputDirection').value;
  
    // Validate input
    if (inputNumbers === '') {
      document.getElementById('errorMessage').innerHTML = 'Please enter input numbers.';
      return;
    }
    if (isNaN(inputHeadPos)) {
      document.getElementById('errorMessage').innerHTML = 'Please enter a valid head position.';
      return;
    }
    if (userInputDirection === 'null') {
      document.getElementById('errorMessage').innerHTML = 'Please select a direction.';
      return;
    }
  
    // Clear error message
    document.getElementById('errorMessage').innerHTML = '';
  
    // Convert input numbers to an array
    var numbers = inputNumbers.split(' ').map(Number);
  
    // Sort the numbers
    numbers.sort(function (a, b) {
      return a - b;
    });
  
    // Initialize variables
    var totalDistance = 0;
    var path = [];
    var currentIndex = -1;
    var direction = userInputDirection;
    var maxPos = Math.max.apply(null, numbers);
    var minPos = Math.min.apply(null, numbers);
  
    // Determine the initial position
    var initialPos;
    if (direction === 'right') {
      initialPos = minPos;
    } else {
      initialPos = maxPos;
    }
  
    // Perform the C-scan algorithm
    if (direction === 'right') {
      for (var i = inputHeadPos; i <= maxPos; i++) {
        if (numbers.includes(i)) {
          totalDistance += Math.abs(currentIndex - i);
          path.push(i);
          currentIndex = i;
        }
      }
      totalDistance += Math.abs(currentIndex - maxPos);
      currentIndex = maxPos;
  
      for (var j = minPos; j < inputHeadPos; j++) {
        if (numbers.includes(j)) {
          totalDistance += Math.abs(currentIndex - j);
          path.push(j);
          currentIndex = j;
        }
      }
    } else {
      for (var k = inputHeadPos; k >= minPos; k--) {
        if (numbers.includes(k)) {
          totalDistance += Math.abs(currentIndex - k);
          path.push(k);
          currentIndex = k;
        }
      }
      totalDistance += Math.abs(currentIndex - minPos);
      currentIndex = minPos;
  
      for (var l = maxPos; l > inputHeadPos; l--) {
        if (numbers.includes(l)) {
          totalDistance += Math.abs(currentIndex - l);
          path.push(l);
          currentIndex = l;
        }
      }
    }
  
    // Display the calculated results
    document.getElementById('count-output').innerHTML =
      'Total Distance: ' + totalDistance + '<br />' +
      'Path: ' + path.join(' -> ');
  
    // Update the chart with the path
    UpdateChart(path);
  }
  
  // Function to update the chart with the path
  function UpdateChart(path) {
    // Get the canvas element
    var ctx = document.getElementById('line-chart').getContext('2d');
  
    // Clear the existing chart if it exists
    if (window.myChart) {
      window.myChart.destroy();
    }
  
    // Create the chart
    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: path.map(String),
        datasets: [
          {
            label: 'C-scan Path',
            data: path,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  