/*
 * Copyright Nate Sutton 2013
 * Version 1.0
 * This code includes "window.setInterval" to poll the page every 300 milliseconds to check if the number
 * counter generation toggle has been activated.  If it has than the current minimum column height and
 * maximum column number are stored.  Those stored values are used as instructions about what layout
 * the generated numbers should be in.  Calculations are run based on those values to create a container
 * for the number series with the right dimensions.  Css styling allows the number to be displayed in the
 * intended format once the container with the customized dimensions is created.
 *
 * References:
 * http://stackoverflow.com/questions/1829925/javascript-getelementbyid-not-working
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
		var HeightOfIndividualNumbers = $('.CounterDigits').height();
		var WidthOfIndividualNumbers = $('.CounterDigits').width();
		var iDiv = document.createElement('div');
		Counter++;
		iDiv.innerHTML = Counter;
		iDiv.className = 'CounterDigits';
		document.getElementById('NumberSeriesContainer').appendChild(iDiv);

		if (Counter == (MinimumColumnHeightUserInput * 2)) {
			$('div#NumberSeriesContainer').css({
				height : (MinimumColumnHeightUserInput * HeightOfIndividualNumbers) + 'px',
				width : ($('div#NumberSeriesContainer').width() + WidthOfIndividualNumbers) + 'px'
			});
		} else if ((Counter > (MinimumColumnHeightUserInput * 2)) & (Counter < (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput))) {
			$('div#NumberSeriesContainer').css({
				height : (Math.ceil(Counter / (Math.floor(Counter / MinimumColumnHeightUserInput))) * HeightOfIndividualNumbers) + 'px',
				width : (Math.floor(Counter / MinimumColumnHeightUserInput) * WidthOfIndividualNumbers) + 'px'
			});
		} else if (Counter >= (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)) {
			$('div#NumberSeriesContainer').css({
				/*height : ((MinimumColumnHeightUserInput * HeightOfIndividualNumbers) + ((Math.floor((Counter - (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)) / MaximumNumberOfColumnsUserInput) + 1) * HeightOfIndividualNumbers)) + 'px',*/
				height : (Math.ceil(Counter / MaximumNumberOfColumnsUserInput) * HeightOfIndividualNumbers) + 'px',
				width : (MaximumNumberOfColumnsUserInput * WidthOfIndividualNumbers) + 'px'
			});
		}

		RelabelNumberSeriesElements()
	}
}

function RelabelNumberSeriesElements() {
	var div = document.getElementById('NumberSeriesContainer');
	var divs = div.getElementsByTagName('div');
	var MinimumColumnHeightUserInput = $('input#MinimumColumnHeight').val();
	var MaximumNumberOfColumnsUserInput = $('input#MaximumNumberOfColumns').val();
	var IndividualNumberContainerWidth = $('.CounterDigits').width();
	var IndividualNumberContainerHeight = $('.CounterDigits').height();
	var HeightOfEntireNumberContainer = $('div#NumberSeriesContainer').height();
	var NumberSeriesElement = 0
	var CompleteRectangleShapeLayoutIsPresent = false;
	var Column, Row, ScaledSizeOfColumns, ElementsInLastRow;
	for (var i = 0; i < divs.length; i += 1) {
		Column = divs[i].offsetLeft / IndividualNumberContainerWidth
		Row = divs[i].offsetTop / IndividualNumberContainerHeight
		ScaledSizeOfColumns = HeightOfEntireNumberContainer / IndividualNumberContainerHeight
		if (divs.length < (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)) {
			ElementsInLastRow = divs.length % (Math.floor(divs.length / MinimumColumnHeightUserInput))
			CompleteRectangleShapeLayoutIsPresent = (divs.length % MinimumColumnHeightUserInput == 0 | divs.length % MaximumNumberOfColumnsUserInput == 0)
		} else {
			ElementsInLastRow = divs.length % MaximumNumberOfColumnsUserInput
			CompleteRectangleShapeLayoutIsPresent = divs.length % MaximumNumberOfColumnsUserInput == 0
		}

		NumberSeriesElement = (Column * ScaledSizeOfColumns) + (Row + 1)
		if ((Column > ElementsInLastRow) & !(CompleteRectangleShapeLayoutIsPresent) & !(ElementsInLastRow == 0)) {
			NumberSeriesElement = NumberSeriesElement - (Column - ElementsInLastRow);
		}
		divs[i].innerHTML = NumberSeriesElement;
	}
}

window.setInterval("IncreaseItemsList()", 300);
