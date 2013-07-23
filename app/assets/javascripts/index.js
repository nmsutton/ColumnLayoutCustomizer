/*
 * Copyright Nate Sutton 2013
 * Version 1.1
 * This code includes "setInterval" to poll the page every 300 milliseconds to check if the number
 * counter generation toggle has been activated.  If it has than the current minimum column height and
 * maximum column number are stored.  Those stored values are used as instructions about what layout
 * the generated numbers should be in.  Calculations are run based on those values to create a container
 * for the number series with the right dimensions.  Css styling allows the number to be displayed in the
 * intended format once the container with the customized dimensions is created.
 *
 * References:
 * http://stackoverflow.com/questions/1829925/javascript-getelementbyid-not-working
 * http://techblog.shaneng.net/2005/04/javascript-setinterval-problem.html
 */

var ActivateCounterSwitch = false;
var Counter = 0;

function NumberSeriesGenerationToggle() {
	if (ActivateCounterSwitch == true) {
		ActivateCounterSwitch = false;
		clearInterval(this.NumberSeriesGenerationTimer);
	} else if (ActivateCounterSwitch == false) {
		var self = this;
		ActivateCounterSwitch = true;
		this.NumberSeriesGenerationTimer = setInterval(function() {
			IncreaseNumberSeries();
		}, 300);
	}
}

function IncreaseNumberSeries() {
	/* This method uses the user input of minimum column height and maximum column number to establish the
	 * layout shape of the number series, the series is bound to the container that is resized here.  The
	 * shape's design is customized specifcally for the series reaching the values set by the user's
	 * parameters through the if statements addressing the conditions.*/
	if (ActivateCounterSwitch == true) {
		var MinimumColumnHeightUserInput = $('input#MinimumColumnHeight').val();
		var MaximumNumberOfColumnsUserInput = $('input#MaximumNumberOfColumns').val();
		var IndividualNumberContainerHeight = $('.CounterDigits').height();
		var IndividualNumberContainerWidth = $('.CounterDigits').width();
		var ContainerForIndividualNumber = document.createElement('div');
		Counter++;
		ContainerForIndividualNumber.innerHTML = Counter;
		ContainerForIndividualNumber.className = 'CounterDigits';
		document.getElementById('NumberSeriesContainer').appendChild(ContainerForIndividualNumber);

		if ((Counter >= (MinimumColumnHeightUserInput * 2)) & (Counter < (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput))) {
			$('div#NumberSeriesContainer').css({
				height : (Math.ceil(Counter / (Math.floor(Counter / MinimumColumnHeightUserInput))) * IndividualNumberContainerHeight) + 'px',
				width : (Math.floor(Counter / MinimumColumnHeightUserInput) * IndividualNumberContainerWidth) + 'px'
			});
		} else if (Counter >= (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)) {
			$('div#NumberSeriesContainer').css({
				height : (Math.ceil(Counter / MaximumNumberOfColumnsUserInput) * IndividualNumberContainerHeight) + 'px',
				width : (MaximumNumberOfColumnsUserInput * IndividualNumberContainerWidth) + 'px'
			});
		}

		RelabelNumberSeriesElements(MinimumColumnHeightUserInput, MaximumNumberOfColumnsUserInput)
	}
}

function RelabelNumberSeriesElements(MinimumColumnHeightUserInput, MaximumNumberOfColumnsUserInput) {
	/* The number labels in the series are dynamically adjusted here based on the user's parameters and
	 * quantity of numbers present.  The numbers are labeled in a grid shape and an adustment is made
	 * if the last row of the number series is not a full row of numbers.  The html object positioning
	 * information is used to detect where in the grid the numbers are and they are relabeled based on
	 * their locations.  */
	var NumberSeriesParentContainer = document.getElementById('NumberSeriesContainer');
	var ChildrenOfNumberSeriesContainer = NumberSeriesParentContainer.getElementsByTagName('div');
	var HeightOfEntireNumberContainer = $('div#NumberSeriesContainer').height();
	var NumberSeriesElement = 0
	var CompleteRectangleShapeLayoutIsPresent = false;
	// IndividualNumberContainerWidth and IndividualNumberContainerHeight reinitialized here to avoid 'NaN' label on first number issue.
	var IndividualNumberContainerWidth = $('.CounterDigits').width();
	var IndividualNumberContainerHeight = $('.CounterDigits').height();
	for (var NumberSeriesIndex = 0; NumberSeriesIndex < ChildrenOfNumberSeriesContainer.length; NumberSeriesIndex += 1) {
		// Math.ceil() are used below to avoid a rounding error observed in IE 10.
		var CurrentColumn = Math.ceil(ChildrenOfNumberSeriesContainer[NumberSeriesIndex].offsetLeft / IndividualNumberContainerWidth)
		var CurrentRow = Math.ceil(ChildrenOfNumberSeriesContainer[NumberSeriesIndex].offsetTop / IndividualNumberContainerHeight)
		var ScaledSizeOfColumns = HeightOfEntireNumberContainer / IndividualNumberContainerHeight

		if (ChildrenOfNumberSeriesContainer.length < (MinimumColumnHeightUserInput * MaximumNumberOfColumnsUserInput)) {
			var ElementsInLastRow = ChildrenOfNumberSeriesContainer.length % (Math.floor(ChildrenOfNumberSeriesContainer.length / MinimumColumnHeightUserInput))
			CompleteRectangleShapeLayoutIsPresent = (ChildrenOfNumberSeriesContainer.length % MaximumNumberOfColumnsUserInput == 0 | ChildrenOfNumberSeriesContainer.length % MinimumColumnHeightUserInput == 0)
		} else {
			var ElementsInLastRow = ChildrenOfNumberSeriesContainer.length % MaximumNumberOfColumnsUserInput
			CompleteRectangleShapeLayoutIsPresent = ChildrenOfNumberSeriesContainer.length % MaximumNumberOfColumnsUserInput == 0
		}

		NumberSeriesElement = (CurrentColumn * ScaledSizeOfColumns) + (CurrentRow + 1)
		if ((CurrentColumn > ElementsInLastRow) & !(CompleteRectangleShapeLayoutIsPresent) & !(ElementsInLastRow == 0)) {
			NumberSeriesElement = NumberSeriesElement - (CurrentColumn - ElementsInLastRow);
		}
		ChildrenOfNumberSeriesContainer[NumberSeriesIndex].innerHTML = Math.ceil(NumberSeriesElement);
	}
}