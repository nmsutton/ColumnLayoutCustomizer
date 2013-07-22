/* 
* Copyright Nate Sutton 2013
* Version 1.0
* This code includes "window.setInterval" to poll the page every 300 milliseconds to check if the number 
* counter generation toggle has been activated.  If it has than the current minimum column height and 
* maximum column number are stored.  Those stored values are used as instructions about what layout 
* the generated numbers should be in.  Calculations are run based on those values to create a container 
* for the number series with the right dimensions.  Css styling allows the number to be displayed in the 
* intended format once the container with the customized dimensions is created.
*/

ActivateCounterSwitch = false;
Counter = 0;

function NumberSeriesGenerationToggole() {
	if (ActivateCounterSwitch == true) {
		ActivateCounterSwitch = false
	} else if (ActivateCounterSwitch == false) {
		ActivateCounterSwitch = true
	}
}

function IncreaseItemsList() {
	if (ActivateCounterSwitch == true) {
		var MinimumColumnHeightUserInput = $('input#MinimumColumnHeight').val();
		var MaximumNumberOfColumnsUserInput = $('input#MaximumNumberOfColumns').val();
		Counter++;
		var iDiv = document.createElement('div');
		iDiv.innerHTML = Counter;
		iDiv.className = 'CounterDigits';
		document.getElementById('NumberSeriesContainer').appendChild(iDiv);

		if (((Counter % MinimumColumnHeightUserInput == 0) & (Counter <= (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)))|(Counter < (MinimumColumnHeightUserInput))) {
			$('div#NumberSeriesContainer').css({
				height : (MinimumColumnHeightUserInput * 20) + 'px'
			});
		} else if ((Counter % (Math.floor(Counter / MinimumColumnHeightUserInput)) == 0) & (Counter < (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput))) {
			$('div#NumberSeriesContainer').css({
				height : ($('div#NumberSeriesContainer').height() + 20) + 'px'
			});
		} else if (Counter > (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)) {
			$('div#NumberSeriesContainer').css({
				height : ((MinimumColumnHeightUserInput * 20) + ((Math.floor((Counter - (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)) / MaximumNumberOfColumnsUserInput) + 1) * 20)) + 'px'
			});
		}
	}
}

window.setInterval("IncreaseItemsList()", 300);