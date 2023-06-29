"use strict";
console.log ("Hello Chords");

//1. Create listeners ----------------- 
document.getElementById("selRootNote").addEventListener("change", ChordFinderMain, false);
document.getElementById("selChordList").addEventListener("change", ChordFinderMain, false);
document.getElementById("selBassNote").addEventListener("change", ChordFinderMain, false);
document.getElementById("selTuning").addEventListener("change", ChordFinderMain, false);

//2. Create the chords -----------------
let chordsDB = BuildChordDB(); 
chordsDB.sort(function(a,b){
	let sortOrder5 = ["5", "b5"];
	if (a.FormulaInt.length < b.FormulaInt.length) {return -1} 
	if (a.FormulaInt.length > b.FormulaInt.length) {return 1;}
	if (a.FormulaInt.length == b.FormulaInt.length) {
		return sortOrder5.indexOf(a.FormulaStr[2]) - sortOrder5.indexOf(b.FormulaStr[2]);
	}
	});
							   
AddDiadsToDB(chordsDB); 

console.log (chordsDB[0]);
let iRandom = (Math.floor(Math.random() * chordsDB.length));
console.log (chordsDB[iRandom]);
 

//3. Add to Select box
let optGroupDiad = document.getElementById("OptGroupDiad");
let optGroupMaj = document.getElementById("OptGroupMaj");
let optGroupMin = document.getElementById("OptGroupMin");
let optGroupDim = document.getElementById("OptGroupDim"); 
let optGroupAug = document.getElementById("OptGroupAug");
let optGroupDom = document.getElementById("OptGroupDom");
let optGroupSus = document.getElementById("OptGroupSus");
let optGroupFam = document.getElementById("OptGroupFamous");

for (let i=0; i < chordsDB.length; i++){
	let str1 = chordsDB[i].ChordName;
    let str2 = chordsDB[i].FormulaStr; 
	if (chordsDB[i].FormulaStr.length === 2){ 
		optGroupDiad.appendChild(new Option(str1, str2));
	}else{
		if (chordsDB[i].Triad.startsWith("Major",0)){optGroupMaj.appendChild(new Option(str1, str2));}
		if (chordsDB[i].Triad.startsWith("minor",0)){optGroupMin.appendChild(new Option(str1, str2));}
		if (chordsDB[i].Triad.startsWith("Dim",0))	{optGroupDim.appendChild(new Option(str1, str2));}
		if (chordsDB[i].Triad.startsWith("Aug",0))	{optGroupAug.appendChild(new Option(str1, str2));} 
		if (chordsDB[i].Triad.startsWith("sus",0))	{optGroupSus.appendChild(new Option(str1, str2));} 
		if (chordsDB[i].Triad.startsWith("Dom",0))	{optGroupDom.appendChild(new Option(str1, str2));} 
	}
}

//Main! 
function ChordFinderMain(){
	//1. Read inputs --------------------------------------------------------------------------------------------------------------------------------------------------
	let elRoot = document.getElementById("selRootNote"); 
	let elChord = document.getElementById("selChordList"); 
	let elBass = document.getElementById("selBassNote"); 
	let arrTuning = document.getElementById("selTuning").value.split("-"); 	
	let sTuning = document.getElementById("selTuning").value; 	
	if  ((elRoot.selectedIndex === 0) || (elChord.selectedIndex === 0)) {return; }
	
	let strRoot = elRoot.options[elRoot.selectedIndex].value; 
	let strChordName = elChord.options[elChord.selectedIndex].text; 
	let strBass = elBass.options[elBass.selectedIndex].value; 
	let strFormulaStr = elChord.options[elChord.selectedIndex].value; 
	let arrFormulaStr = strFormulaStr.split(',');
	let arrFormulaInt =  GetChordDegrees(arrFormulaStr); 
	let iSeven = GetSeven (arrFormulaStr); 
	let arrOptionalStr = GetOptionalNotes (iSeven); 
	let arrOptionalInt = GetChordDegrees (arrOptionalStr);
	
	//2. Apply Notes to the Formula 
	let arrScale = GetChromaticScale(strRoot); 
	console.log ("%cCromatic Scale			:", "color: cyan", arrScale); 
	
	let arrNotes = []; 
	let arrOptionalNotes = []; 

	for (let i=0; i < arrFormulaInt.length; i++){arrNotes.push (arrScale[arrFormulaInt[i]]);}
	for (let i=0; i < arrOptionalInt.length; i++){arrOptionalNotes.push (arrScale[arrOptionalInt[i]]);}
	let arrMandatoryNotes = GetMandatoryNotes (arrNotes, arrOptionalNotes); 

	
	//3. Deal with the bass note 
	if  ((elBass.selectedIndex !== 0) && (strRoot !== strBass)) { //means the bass note is other than the default
		strChordName = strChordName + " / " + strBass;
		if (arrNotes.indexOf(strBass) === -1){
			console.log ("%cNOT AN INVERSION		:", "color: orange", strBass); 	
			//it's NOT an inversion, need to add strBass to the first position in the array of notes 
			arrNotes.unshift (strBass); 
			arrMandatoryNotes.unshift (strBass); 
		}else{
			console.log ("%cIT IS AN INVERSION		:", "color: orange", strBass); 	
			//it's an inversion, need to move strBass to the first position in the array of notes 
			let index =0; 
			index = arrNotes.indexOf(strBass); 
			arrNotes.unshift(arrNotes.splice(index, 1)[0]);
			index = arrMandatoryNotes.indexOf(strBass); 
			arrMandatoryNotes.unshift(arrMandatoryNotes.splice(index, 1)[0]);
		}
	}
	
	//4. Get the tabs 
	let arrTabs = GetTabs (arrNotes, arrOptionalNotes, arrMandatoryNotes, arrTuning); 

	arrTabs.sort(function(a,b){
		let xa = 0; let xb=0; 
		for (let i=0; i< a.length; i++){if (a[i]==="x") {xa++;}}
		for (let i=0; i< b.length; i++){if (b[i]==="x") {xb++;}}		
		if (xa < xb) {return -1} 
		if (xa > xb) {return 1;}
		if (xa === xb) {return 0;}; 
	});		

	//5. Output console
	console.clear(); 
	console.log ("%c-----------------------------------------------------------------------------------------------------------------------------------", 'color: cyan'); 
	console.log ("%cRoot			   	:", "color: cyan", strRoot); 
	console.log ("%cChord			 	:", "color: cyan", strChordName);  
	console.log ("%cBass Note			:", "color: cyan", strBass); 	
	console.log ("%cFormula				:", "color: cyan", strFormulaStr); 
	console.log ("%cFormula	(degrees)		:", "color: cyan", arrFormulaStr); 	
	console.log ("%cFormula	(integer)		:", "color: cyan", arrFormulaInt);
	console.log ("%cOptional notes (degrees)	:", "color: cyan", arrOptionalStr);
	console.log ("%cOptional notes (integer)	:", "color: cyan", arrOptionalInt);
	console.log ("%cSeven				:", "color: cyan", iSeven); 	
	console.log ("%cChord Notes			:", "color: cyan", arrNotes); 	
	console.log ("%cChord Optional Notes 		:", "color: cyan", arrOptionalNotes); 
	console.log ("%cChord Mandatory Notes 		:", "color: cyan", arrMandatoryNotes); 		
	console.log ("%cTabs for this chord 		:", "color: cyan", arrTabs.length); 	
	
	//6. Output text 
	//for each tab, find the note names
	for (let i=0; i< arrTabs.length; i++){
		//for each item in the tab, find the note name
		let arrTabNotes = []; 
		for (let j=0; j < arrTabs[i].length; j++){
			let iString = 0; 
			switch (j){
				case 0: iString = 6; break; 
				case 1: iString = 5; break; 
				case 2: iString = 4; break; 
				case 3: iString = 3; break; 
				case 4: iString = 2; break; 
				case 5: iString = 1; break; 
			}
			let iFret= arrTabs[i][j]; 
			let sNote = "x"; 
			if (typeof(iString) === "number" && typeof(iFret) === "number"){
				sNote = GetNoteForFret8(iString, iFret, sTuning); 
			}
			arrTabNotes.push (sNote); 
		}	
		console.log (arrTabs[i], arrTabNotes); 
	}
	
	//7. Output guitar 

}

//------Sound ----------------------------------------------------------
function GetNoteForFret8(iString, iFret, strTuning) {
    //INPUT:  a guitar string number (1 to 6), fret number and tuning
	//OUTPUT: (string) note in that string/fret
	//strTuning format: "E-A-D-g-b-e" 
	
	//console.log (iString, iFret, strTuning); 

	if (arguments.length < 3) 			{console.log ("ERROR: Invalid number of arguments"); return;};
	if (typeof(iString) !== "number") 	{console.log ("ERROR: Invalid type"); return;};
	if (typeof(iFret) !== "number") 	{console.log ("ERROR: Invalid type"); return;};
	if (iString < 0 || iString > 6) 	{console.log ("ERROR: Invalid arguments");return;};
	if (iFret < 0) 						{console.log ("ERROR: Invalid arguments");return;};
		
	//reference, we build the string from here 
	let arrString = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2","C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3","C4", "C#4", "D4","D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4","C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5","C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6","C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7"]; 	
	
	let arrString2 = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B","C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B","C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B","C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B","C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B","C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; 		
	
	//----------------sanitize strTuning--------------
	if (strTuning.indexOf("'") > -1 ){
		strTuning = strTuning.replace (/'/g,''); 
	}
	if (strTuning.indexOf("b") > -1 ){
		strTuning = strTuning.replace (/Ab/g,'G#'); 
		strTuning = strTuning.replace (/Bb/g,'A#'); 
		strTuning = strTuning.replace (/Cb/g,'B'); 
		strTuning = strTuning.replace (/Db/g,'C#'); 
		strTuning = strTuning.replace (/Eb/g,'D#'); 
		strTuning = strTuning.replace (/Fb/g,'E'); 
		strTuning = strTuning.replace (/Gb/g,'F#');
	}
	//-------------------------------------------------
		
	const arrTuning = strTuning.split ("-"); 
	if (arrTuning.length < 6) {return "ERROR: arguments"}
	
	//----------------everything to uppercase---------- 
	for (let i=0; i<arrTuning.length; i++){
		arrTuning[i]=arrTuning[i].toUpperCase(); 
	}
	
	//----------------we build the guitar for this tuning---------- 
	let s0String6 = arrTuning[0]+"2";  //find the lowest note 
	let i0String6 = arrString.indexOf(s0String6); 
	
	let i0String5 = arrString2.indexOf(arrTuning[1], i0String6); 
	let s0String5 = arrString[i0String5]; 
	
	let i0String4 = arrString2.indexOf(arrTuning[2], i0String5); 
	let s0String4 = arrString[i0String4]; 	
	
	let i0String3 = arrString2.indexOf(arrTuning[3], i0String4); 
	let s0String3 = arrString[i0String3]; 

	let i0String2 = arrString2.indexOf(arrTuning[4], i0String3); 
	let s0String2 = arrString[i0String2]; 

	let i0String1 = arrString2.indexOf(arrTuning[5], i0String2); 
	let s0String1 = arrString[i0String1]; 		

	//------------this is a hack for the Ostrich tuning:   E-E-e-e-e'-e' or C-C-c-c-c'-c'
	if (i0String6 === i0String5 && i0String4 === i0String3 &&  i0String2 === i0String1) {
		s0String6 = arrTuning[0]+"2";
		s0String5 = arrTuning[0]+"2";
		s0String4 = arrTuning[0]+"3"; i0String4 = i0String6 + 12; 
		s0String3 = arrTuning[0]+"3"; i0String3 = i0String4; 	
		s0String2 = arrTuning[0]+"4"; i0String2 = i0String3 + 12; 
		s0String1 = arrTuning[0]+"4"; i0String1 = i0String2; 		
	}
	//-------------------------------------------------------------	

	switch (iString){
		case 6: return (arrString[i0String6+iFret]); 
		case 5: return (arrString[i0String5+iFret]); 
		case 4: return (arrString[i0String4+iFret]); 
		case 3: return (arrString[i0String3+iFret]); 
		case 2: return (arrString[i0String2+iFret]);  
		case 1: return (arrString[i0String1+iFret]); 
	}

	return (""); 
}




//------The Dom ----------------------------------------------------------
function DrawTabs (){
	console.log ("Update the tabs!"); 
}

//-------Music Theory-----------------------------------------------------
function BuildChordDB (){
    //INPUT: none
	//OUTPUT: array of objects:
		//arrOUT.push({
			//FormulaStr: arrFormulaStr, 
			//ChordName: sName,	
			//CHORDId:arrFormulaStr.join()
		//});	
	
	let arrOUT = []; 
	
	let arr1 = ["1"];
	let arr2 = ["","b2", "2"]; 
	let arr3 = ["","b3", "3"];
    let arr4 = ["", "4"]; 
	let arr5 = ["","b5", "5", "#5"];
    let arr6 = ["", "6"];
    let arr7 = ["", "bb7", "b7", "7"];
	let arr9 = ["", "b9", "9", "#9"];
    let arr11 = ["", "b11", "11", "#11"];
    let arr13 = ["", "b13", "13", "#13"];												
 
    let i1, i2, i4, i3, i5, i6, i7, i9, i11, i13;

	let bolOk = true; 	
	
	for (i1 = 0; i1 < arr1.length; i1++){
		for (i2 = 0; i2 < arr2.length; i2++) {
			for (i3 = 0; i3 < arr3.length; i3++) {
				for (i4=0; i4< arr4.length; i4++){
					for (i5 = 0; i5 < arr5.length; i5++) {
						for (i6 = 0; i6 < arr6.length; i6++) {
							for (i7 = 0; i7 < arr7.length; i7++) {
								for (i9 = 0; i9 < arr9.length; i9++) {
									for (i11 = 0; i11 < arr11.length; i11++) {
										for (i13 = 0; i13 < arr13.length; i13++) {
											//console.log ("1", arr2[i2], arr3[i3], arr5[i5], arr6[i6], arr7[i7], arr9[i9], arr11[i11], arr13[i13]);	
											bolOk = true;
											
											//generate the Chord FormulaStr 
											let arrFormulaStr=[]; 
											arrFormulaStr.length = 0; 
											if (arr1[i1] !== "") {arrFormulaStr.push(arr1[i1])}; 
											if (arr2[i2] !== "") {arrFormulaStr.push(arr2[i2])};
											if (arr3[i3] !== "") {arrFormulaStr.push(arr3[i3])};
											if (arr4[i4] !== "") {arrFormulaStr.push(arr4[i4])};
											if (arr5[i5] !== "") {arrFormulaStr.push(arr5[i5])};
											if (arr6[i6] !== "") {arrFormulaStr.push(arr6[i6])};
											if (arr7[i7] !== "") {arrFormulaStr.push(arr7[i7])};
											if (arr9[i9] !== "") {arrFormulaStr.push(arr9[i9])};
											if (arr11[i11] !== "") {arrFormulaStr.push(arr11[i11])};
											if (arr13[i13] !== "") {arrFormulaStr.push(arr13[i13])};
											
											//remember that 9, 11 and 13 can also be thought of as 2, 4 and 6
											if (bolOk){
												if (arr1[i1] ==="1" 	&& arr7[i7]  ==="#7")	{bolOk = false;}
												if (arr2[i2] ==="b2" 	&& arr9[i9]  ==="b9") 	{bolOk = false;}	
												if (arr2[i2] ==="2" 	&& arr9[i9]  ==="9") 	{bolOk = false;}
												if (arr3[i3] ==="b3" 	&& arr9[i9]  ==="#9") 	{bolOk = false;}		
												if (arr3[i3] ==="3" 	&& arr11[i11] ==="b11")	{bolOk = false;}	
												if (arr4[i4] ==="4" 	&& arr11[i11] ==="11") 	{bolOk = false;}
												if (arr5[i5] ==="b5" 	&& arr11[i11] ==="#11")	{bolOk = false;}	
												if (arr5[i5] ==="5" 	&& arr13[i13] ==="bb13"){bolOk = false;}	
												if (arr5[i5] ==="#5" 	&& arr13[i13] ==="b13") {bolOk = false;}
												if (arr6[i6] ==="6" 	&& arr13[i13] ==="13") 	{bolOk = false;}
												if (arr7[i7] ==="b7" 	&& arr13[i13] ==="#13") {bolOk = false;}
												if (arr7[i7] ==="bb7" 	&& arr6[i6]   ==="6") 	{bolOk = false;}		
											}
											
											//bb7 only valid for Dim 
											if (arr7[i7] === "bb7") {
												if (arr2[i2] === "" && arr3[i3]=== "b3" && arr4[i4] === "" && arr5[i5] === "b5" && arr6[i6]  === "") {
													//do nothing 
												}
												else {
													bolOk = false;
												}
											}											
											
											//check if valid triad 
											let sTriad = GetTriad (arrFormulaStr); 
											if (sTriad.length === 0) {bolOk = false;}
											
											
											if (bolOk){
												let sName = BuildChordName(arrFormulaStr);
												let iSeven = GetSeven (arrFormulaStr);
												if (sName.length > 1){
													//add to database
													arrOUT.push({
														Triad		:sTriad,
														Seven		:iSeven, 
														ChordName	:sName,	
														FormulaStr	:arrFormulaStr, 
														FormulaInt	:GetChordDegrees (arrFormulaStr), 
														CHORDId		:arrFormulaStr.join()
													});
												}			
											}
										}
									}
								}														
							}
						}
					}
				}
			}
		}
	}
	console.log (arrOUT.length + "  " + "chords!");  
	return (arrOUT); 
}
function BuildChordName (arrIN) {  
	//INPUT: arrIN with degrees (NOT integers). Example: ["1","b3","5","b7"]; 
	//OUTPUT: string with chord name; returns "" if not valid triad or < not diad 
	//https://music.stackexchange.com/questions/11659/what-determines-a-chords-name	
	//https://music.stackexchange.com/questions/42999/how-do-you-figure-out-a-chords-name
	//http://www.smithfowler.org/music/Chord_Formulas.htm
	//https://music.stackexchange.com/questions/91623/whats-an-add-chord 
	
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (Array.isArray(arrIN)) {}else{console.log ("ERROR: Invalid type");return; }   	
	
	let s1 = ""; 	
	let s2 = ""; 	
	let s3 = ""; 
	let s4 = ""; 
	let s5 = ""; 
	let s6 = "";
	let s7 = ""; 
	let s9 = ""; 
	let s11 = ""; 
	let s13 = ""; 	
	
	if (arrIN.indexOf("1")  > -1){s1 = "1"; }
	if (arrIN.indexOf("b2") > -1){s2 = "b2"; }
	if (arrIN.indexOf("2")  > -1){s2 = "2"; }
	if (arrIN.indexOf("b3") > -1){s3 = "b3"; }
	if (arrIN.indexOf("3")  > -1){s3 = "3"; }
	if (arrIN.indexOf("4")  > -1){s4 = "4"; }
	if (arrIN.indexOf("#5") > -1){s5 = "#5"; }
	if (arrIN.indexOf("5") > -1) {s5 = "5"; }
	if (arrIN.indexOf("b5") > -1){s5 = "b5"; }
	if (arrIN.indexOf("6")  > -1){s6 = "6"; }
	if (arrIN.indexOf("bb7")> -1){s7 = "bb7";}
	if (arrIN.indexOf("b7") > -1){s7 = "b7"; }
	if (arrIN.indexOf("7")  > -1){s7 = "7"; }
	if (arrIN.indexOf("#7") > -1){s7 = "#7"; }
	if (arrIN.indexOf("b9") > -1){s9 = "b9";  }
	if (arrIN.indexOf("9")  > -1){s9 = "9";  }
	if (arrIN.indexOf("#9") > -1){s9 = "#9";  }
	if (arrIN.indexOf("b11")> -1){s11 = "b11";  }
	if (arrIN.indexOf("11") > -1){s11 = "11";}
	if (arrIN.indexOf("#11")> -1){s11 = "#11";  }
	if (arrIN.indexOf("b13")> -1){s13 = "b13";}
	if (arrIN.indexOf("13") > -1){s13 = "13";}
	if (arrIN.indexOf("#13")> -1){s13 = "#13";}
	
	let sName = "";
	//------------ Check if single note or diad 
	if (arrIN.length === 1) { return (sName.trim())	}; 
	if (arrIN.length === 2) { 
		sName = arrIN[1]+" "+ "Interval"; 
		sName = sName.trim(); 
		return (sName);
	}; 
	
	//--------Finally build the chord name 
	let sTriad = GetTriad (arrIN); 
	let iSeven = GetSeven (arrIN); 
	if (sTriad === "") {return (sName.trim())}
		
	let sExtensions = [];

	switch (iSeven){
		case 0: 
			if (s6 !== "") {sExtensions.push (s6);}
			if (s7 !== "") {sExtensions.push (s7); }
			if (s9 !== "") {sExtensions.push (s9); }		
			if (s11 !== "") {sExtensions.push (s11); }
			if (s13 !== "") {sExtensions.push (s13); }
			sName = sTriad + " " + sExtensions.join("/");
			//---- ver si esta excepción es válida, como son los 7 para los sus?
			if (sExtensions[0]==="7" || sExtensions[0]==="b7" || sExtensions[0]==="9" || sExtensions[0]==="11" || sExtensions[0]==="13") {
				sName = sTriad + " add " + sExtensions.join("/");
			}	
			break; 
		case 7:
			if (s6 !== "") {sExtensions.push (s6); }
			if (s9 !== "") {sExtensions.push (s9); }		
			if (s11 !== "") {sExtensions.push (s11); }
			if (s13 !== "") {sExtensions.push (s13); }	
			sName = sTriad + " " + iSeven.toString() + " " + sExtensions.join("/");		
			if (sExtensions[0]==="9" || sExtensions[0]==="11" || sExtensions[0]==="13") {
				sName = sTriad + " " + iSeven.toString() + " add " + sExtensions.join("/");
			}	
			break; 
		case 9:
			if (s6 !== "") {sExtensions.push (s6); }
			if (s11 !== "") {sExtensions.push (s11); }
			if (s13 !== "") {sExtensions.push (s13); }
			sName = sTriad + " " + iSeven.toString() + " " + sExtensions.join("/");
			if (sExtensions[0]==="13") {
				sName = sTriad + " " + iSeven.toString() + " add " + sExtensions.join("/");
			}				
			break; 
		case 11: 
			if (s6 !== "") {sExtensions.push (s6); }
			if (s13 !== "") {sExtensions.push (s13); }
			sName = sTriad + " " + iSeven.toString() + " " + sExtensions.join("/");
			break; 
		case 13: 
			sName = sTriad + " " + iSeven.toString() + " " + sExtensions.join("/");
			break; 
		default:
			break; 
	}

	//---exceptions .... 
	//"Diminished 6" --> "Diminished" ("1,b3,b5,6" --> ": 1,b3,b5,bb7")
	if (sName.toLowerCase().indexOf("dim") > -1 && sName.indexOf("6") >-1 ){
		sName = sName.replace ("6",""); 
	}
	
	//"Half Diminished 7" --> "Half Diminished"  ("E Half Diminished (m7b5) 7"  --> "E Half Diminished (m7b5)" 
	if (sName.toLowerCase().indexOf("(m7b5) 7")) {
		sName = sName.replace ("(m7b5) 7","(m7b5)"); 
	}

	sName = sName.trim(); 
	return (sName); 
}
function AddDiadsToDB(arrIN) {
	let arrTemp = ["b2","2","b3","3","4","b5","5", "#5","6","b7","7","b9","9","#9","11","b11","#11","13","b13","#13"]; 	
	for (let i=0; i<arrTemp.length; i++){
		arrIN.push({
			Triad		:"Diad",
			Seven		:"", 
			ChordName	:arrTemp[i].toString() +" Diad",
			FormulaStr	:["1", arrTemp[i]],
			FormulaInt	:GetChordDegrees (["1", arrTemp[i]]),
			CHORDId		:["1", arrTemp[i]].join()
		});
	}
	console.log (arrIN.length + "  " + "chords!");  
}
function GetTriad (arrIN) {  
	//INPUT: arrIN with degrees (NOT integers). Example: ["1","b3","5","b7"]; 
	//OUTPUT: string with triad name; returns "" if not valid triad
	
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (Array.isArray(arrIN)) {}else{console.log ("ERROR: Invalid type");return; }   	
	
	let s1 = ""; 	
	let s2 = ""; 	
	let s3 = ""; 
	let s4 = ""; 
	let s5 = ""; 
	let s6 = "";
	let s7 = ""; 
	
	if (arrIN.indexOf("1")  > -1){s1 = "1"; }
	if (arrIN.indexOf("b2") > -1){s2 = "b2"; }
	if (arrIN.indexOf("2")  > -1){s2 = "2"; }
	if (arrIN.indexOf("b3") > -1){s3 = "b3"; }
	if (arrIN.indexOf("3")  > -1){s3 = "3"; }
	if (arrIN.indexOf("4")  > -1){s4 = "4"; }
	if (arrIN.indexOf("#5") > -1){s5 = "#5"; }
	if (arrIN.indexOf("5") > -1) {s5 = "5"; }
	if (arrIN.indexOf("b5") > -1){s5 = "b5"; }
	if (arrIN.indexOf("6")  > -1){s6 = "6"; }
	if (arrIN.indexOf("bb7")> -1){s7 = "bb7";}
	if (arrIN.indexOf("b7") > -1){s7 = "b7"; }
	if (arrIN.indexOf("7")  > -1){s7 = "7"; }
	if (arrIN.indexOf("#7") > -1){s7 = "#7"; }
	
	//------------ Get the triad 
	let arrTriad = []; 
	let sTriad = ""; 
	if (s1 !== "") {arrTriad.push(s1);}
	if (s2 !== "") {arrTriad.push(s2);}
	if (s3 !== "") {arrTriad.push(s3);}
	if (s4 !== "") {arrTriad.push(s4);}
	if (s5 !== "") {arrTriad.push(s5);}
	if (s6 !== "") {arrTriad.push(s6);}
	if (s7 !== "") {arrTriad.push(s7);}

	let sTemp = arrTriad[0]+","+arrTriad[1]+","+arrTriad[2]; 
	let iSeven = GetSeven (arrIN);

	switch (sTemp) {
		case ("1,3,5") 	: 
			sTriad="Major"; 
			if (iSeven > 0){if (s7 === "b7") {sTriad = "Dominant";}}
			break;
		case ("1,3,b5") : 
			sTriad="Major b5"; 
			if (iSeven > 0){if (s7 === "b7") {sTriad = "Dominant b5";}}
			break;
		case ("1,3,#5") : 
			sTriad="Augmented"; 
			if (iSeven > 0){
				if (s7 === "b7") {sTriad = "Augmented minor";}
				if (s7 === "7")  {sTriad = "Augmented Major";}
			}			
			break;		
		case ("1,b3,5") :
			sTriad="minor"; 
			if (iSeven > 0){
				if (s7 === "7")  {sTriad = "min/Maj";}
			}			
			break;
		case ("1,b3,b5"): 
			sTriad="Diminished"; 
			if (iSeven > 0){
				if (s6 === "6") {sTriad = "Diminished";	}
				if (s7 === "bb7") {sTriad = "Diminished";}
				if (s7 === "b7")  {sTriad = "Half Diminished (m7b5)";}
				if (s7 === "7")  {sTriad = "dim Maj";}
			}
			break;
		case ("1,2,5")  : 
			sTriad="sus2"; 
			if (iSeven > 0){
				if (s7 === "b7") {sTriad = "sus2";}
				if (s7 === "7")  {sTriad = "Maj sus2";}
			}					
			break;
		case ("1,b2,5") : 
			sTriad="susb2"; 
			if (iSeven > 0){
				if (s7 === "b7") {sTriad = "susb2";}
				if (s7 === "7")  {sTriad = "Maj susb2";}
			}				
			break;
		case ("1,b2,b5"): 
			sTriad="sus b2b5"; 
			if (iSeven > 0){
				if (s7 === "b7") {sTriad = "sus b2b5";}
				if (s7 === "7")  {sTriad = "Maj sus b2b5";}
			}			
			break;
		case ("1,4,5")  : 
			sTriad="sus4"; 
			if (iSeven > 0){
				if (s7 === "b7") {sTriad = "sus4";}
				if (s7 === "7")  {sTriad = "Maj sus4";}
			}			
			break;
		case ("1,4,b5") : 
			sTriad="sus4b5"; 
			if (iSeven > 0){
				if (s7 === "b7") {sTriad = "sus4b5";}
				if (s7 === "7")  {sTriad = "Maj sus4b5";}
			}				
			break;

		default: sTriad="";  break; 
	}	
	return (sTriad); 
	
}
function GetSeven (arrIN) {  
	//INPUT: arrIN with degrees (NOT integers). Example: ["1","b3","5","b7"]
	//OUTPUT: integer with value of Seven: 0, 7, 9, 11, 13
	
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (Array.isArray(arrIN)) {}else{console.log ("ERROR: Invalid type");return; }   		

	let s1 = ""; 	
	let s2 = ""; 	
	let s3 = ""; 
	let s4 = ""; 
	let s5 = ""; 
	let s6 = "";
	let s7 = ""; 
	let s9 = ""; 
	let s11 = ""; 
	let s13 = ""; 	
	
	if (arrIN.indexOf("1")  > -1){s1 = "1"; }
	if (arrIN.indexOf("b2") > -1){s2 = "b2"; }
	if (arrIN.indexOf("2")  > -1){s2 = "2"; }
	if (arrIN.indexOf("b3") > -1){s3 = "b3"; }
	if (arrIN.indexOf("3")  > -1){s3 = "3"; }
	if (arrIN.indexOf("4")  > -1){s4 = "4"; }
	if (arrIN.indexOf("#5") > -1){s5 = "#5"; }
	if (arrIN.indexOf("5") > -1) {s5 = "5"; }
	if (arrIN.indexOf("b5") > -1){s5 = "b5"; }
	if (arrIN.indexOf("6")  > -1){s6 = "6"; }
	if (arrIN.indexOf("bb7")> -1){s7 = "bb7";}
	if (arrIN.indexOf("b7") > -1){s7 = "b7"; }
	if (arrIN.indexOf("7")  > -1){s7 = "7"; }
	if (arrIN.indexOf("#7") > -1){s7 = "#7"; }
	if (arrIN.indexOf("b9") > -1){s9 = "b9";  }
	if (arrIN.indexOf("9")  > -1){s9 = "9";  }
	if (arrIN.indexOf("#9") > -1){s9 = "#9";  }
	if (arrIN.indexOf("b11")> -1){s11 = "b11";  }
	if (arrIN.indexOf("11") > -1){s11 = "11";}
	if (arrIN.indexOf("#11")> -1){s11 = "#11";  }
	if (arrIN.indexOf("b13")> -1){s13 = "b13";}
	if (arrIN.indexOf("13") > -1){s13 = "13";}
	if (arrIN.indexOf("#13")> -1){s13 = "#13";}

	let iSeven = 0;
	if (s7 === "b7" || s7 === "7" || s7 === "bb7") { 
		iSeven = 7; 
		if (s13 === "13") {
			if ((s9 === "9") && (s11 === "11")) {iSeven = 13;} 
		}
		if (s11 === "11" && s13 !== "13"){
			if (s9 === "9")  {iSeven = 11;} 
		}
		if (s9 === "9" && s11 !== "11" && s13 !== "13"){
			iSeven = 9; 
		}		
	}	
	
	//bb7 only valid for Dim 
	//bb7 = 6 
	if (s7 === "bb7" || s6  === "6") {
		if (s3 === "b3"  && s5 === "b5" ) {iSeven=7; }
	}	
	return (iSeven); 
}
function GetChordDegrees (arrIN){
	//convers a chord formula to integers 
	//INPUT: array with degrees (string) of the formula
	//OUTPUT: array with degrees (integer) of the formula
	
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (Array.isArray(arrIN)) {}else{console.log ("ERROR: Invalid type");return; }   		

	let arrDegrees = []; 
	arrDegrees.push ({ "DegreeInt": 0, "DegreeStr": "1", "NoteRef":"C" }); 
	arrDegrees.push ({ "DegreeInt": 1, "DegreeStr": "b2", "NoteRef":"C#" });
	arrDegrees.push ({ "DegreeInt": 2, "DegreeStr": "2", "NoteRef":"D" });
	arrDegrees.push ({ "DegreeInt": 3, "DegreeStr": "b3" , "NoteRef":"D#"});
	arrDegrees.push ({ "DegreeInt": 4, "DegreeStr": "3", "NoteRef":"E" });
	arrDegrees.push ({ "DegreeInt": 5, "DegreeStr": "4", "NoteRef":"F" });
	arrDegrees.push ({ "DegreeInt": 6, "DegreeStr": "b5", "NoteRef":"F#" });
	arrDegrees.push ({ "DegreeInt": 7, "DegreeStr": "5", "NoteRef":"G" });
	arrDegrees.push ({ "DegreeInt": 8, "DegreeStr": "#5", "NoteRef":"G#" });
	arrDegrees.push ({ "DegreeInt": 9, "DegreeStr": "6", "NoteRef":"A" });
	arrDegrees.push ({ "DegreeInt": 9, "DegreeStr": "bb7", "NoteRef":"A" });
	arrDegrees.push ({ "DegreeInt": 10, "DegreeStr": "b7", "NoteRef":"A#" });
	arrDegrees.push ({ "DegreeInt": 11, "DegreeStr": "7", "NoteRef":"B" });
	arrDegrees.push ({ "DegreeInt": 12, "DegreeStr": "#7", "NoteRef":"C" });
	arrDegrees.push ({ "DegreeInt": 13, "DegreeStr": "b9", "NoteRef":"C#" });
	arrDegrees.push ({ "DegreeInt": 14, "DegreeStr": "9", "NoteRef":"D" });
	arrDegrees.push ({ "DegreeInt": 15, "DegreeStr": "#9", "NoteRef":"D#" });
	arrDegrees.push ({ "DegreeInt": 16, "DegreeStr": "b11", "NoteRef":"E" });
	arrDegrees.push ({ "DegreeInt": 17, "DegreeStr": "11", "NoteRef":"F" });
	arrDegrees.push ({ "DegreeInt": 18, "DegreeStr": "#11", "NoteRef":"F#" });
	arrDegrees.push ({ "DegreeInt": 19, "DegreeStr": "5", "NoteRef":"F#" });
	arrDegrees.push ({ "DegreeInt": 20, "DegreeStr": "b13", "NoteRef":"G#" });
	arrDegrees.push ({ "DegreeInt": 21, "DegreeStr": "13", "NoteRef":"A" });
	arrDegrees.push ({ "DegreeInt": 22, "DegreeStr": "#13", "NoteRef":"A#" });
	arrDegrees.push ({ "DegreeInt": 23, "DegreeStr": "7", "NoteRef":"B" });

	let arrOUT=[];
	let arrTEMP1=[];

	for (let i=0; i<arrIN.length; i++){
		if (arrIN[i] !== ""){
			arrTEMP1 = arrDegrees.filter(function(el){return el.DegreeStr === arrIN[i];}); //search degree in the DB
			arrOUT.push (arrTEMP1[0].DegreeInt); 
		} 
	}
	return arrOUT;
}
function GetChromaticScale(strNote) {
	//INPUT: <string>. A note. 
	//OUTPUT: <Array> of <string> 
	
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (typeof(strNote)=== "string") {} else{console.log ("ERROR: Invalid type");return; }

	//reference, we build the string from here 
    let arrScale = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
	let i=0; 	

	let index = arrScale.indexOf(strNote.toUpperCase());
	if (index === -1) {
		let arrScale = []; 
		return arrScale; 
	}
	for (i=0; i < index; i++){
		arrScale.push (arrScale.shift());
	}
	return arrScale;		
}
function GetOptionalNotes (iSeven) {  
	//--------------------5th can be ommitted for 7/b7 chords for guitar, http://www.smithfowler.org/music/Chord_Formulas.htm
	//("1,3,b7"), ("1,3,7"), ("1,b3,7"),("1,b3,b7") :
	//-------------------5th can be omitted for Maj6 and min6? ----------------------------------------------------------------------
	//("1,3,6"),("1,b3,6")
	//5 is optional for 7/9/11/13 chords 
	//9 is optional por 11/13 chords 
	//11 is optional por 13 chords 
			
	//INPUT: <INTEGER>: 0,7,9,11,13
	//OUTPUT: array of <strings> with optional degrees 
	
	let arrOut=[]; 
	
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return(arrOut);}
	if (typeof iSeven === 'number')  {} else {console.log ("ERROR: Invalid type");return(arrOut); }   	

	switch (iSeven) {
		case 0: return (arrOut); break;	
		case 7: 
			arrOut.push ("5"); 
			break; 
		case 9: 
			arrOut.push ("5"); 
			break; 		
		case 11: 
			arrOut.push ("5"); 
			arrOut.push ("9"); 			
			break; 		
		case 13: 
			arrOut.push ("5"); 
			arrOut.push ("9"); 			
			arrOut.push ("11"); 						
			break; 			
		default: break; 
	}
	return (arrOut);  

}
function GetMandatoryNotes (arrNotes, arrOptionalNotes) {  
	//read rules in GetOptionalNotes function for an explanation 
	//INPUT: 
	//arrNotes: array of <string>. 						E.g.: ["C","E","G","D"]
	//arrOptionalNotes: array of <string>. 				E.g.: ["G"]
	//OUTPUT: array of <strings> with optional notes	E.g.: ["C","E","D"]

	if (arguments.length !==2) {console.log ("ERROR: Invalid number of arguments"); return(arrOut);}
	if (Array.isArray(arrNotes)) {}else{console.log ("ERROR: Invalid type");return(arrOut);}	
	if (Array.isArray(arrOptionalNotes)) {}else{console.log ("ERROR: Invalid type");return(arrOut);}	

	let arrOut=[]; 
	for (let i=0; i<arrNotes.length; i++){
		if (arrOptionalNotes.indexOf(arrNotes[i]) === -1) {
			arrOut.push (arrNotes[i]); 	
		}
	}
	return (arrOut);  
}
function GetTabs(arrNotes, arrOptionalNotes, arrMandatoryNotes, arrTuning){
	//INPUT : 
	//	arrNotes: array of <string>. Notes of the chord 
	// 	arrOptionalNotes: array of <string>. Optional notes of the chord 
	//	arrMandatoryNotess: array of <string>. Mandatory notes of the chord 
	// 	arrTuning: array of <string>. Guitar tuning 
	//OUTPUT:  array of arrays. Each array being a tab. 

	let arrOUT = []; 
	
	if (arguments.length !==4) {console.log ("ERROR: Invalid number of arguments"); return (arrOUT);}
	if (Array.isArray(arrNotes)) {}else{console.log ("ERROR: Invalid type");return (arrOUT); }   	
	if (Array.isArray(arrOptionalNotes)) {}else{console.log ("ERROR: Invalid type");return (arrOUT); }  
	if (Array.isArray(arrMandatoryNotes)) {}else{console.log ("ERROR: Invalid type");return (arrOUT); }   	
	if (Array.isArray(arrTuning)) {}else{console.log ("ERROR: Invalid type");return (arrOUT); }   	
		
	
	//1.----------------sanitize arrTuning------------------------------------------------
	for (let i=0; i < arrTuning.length; i++){
		if (arrTuning[i].indexOf("'") > -1 ){
			arrTuning[i] = arrTuning[i].replace (/'/g,''); 
		}
		if (arrTuning[i].indexOf("b") > -1 ){
			arrTuning[i] = arrTuning[i].replace (/Ab/g,'G#'); 
			arrTuning[i] = arrTuning[i].replace (/Bb/g,'A#'); 
			arrTuning[i] = arrTuning[i].replace (/Cb/g,'B'); 
			arrTuning[i] = arrTuning[i].replace (/Db/g,'C#'); 
			arrTuning[i] = arrTuning[i].replace (/Eb/g,'D#'); 
			arrTuning[i] = arrTuning[i].replace (/Fb/g,'E'); 
			arrTuning[i] = arrTuning[i].replace (/Gb/g,'F#');
		}
	}
	//2.----------------build the guitar------------------------------------------------
	let cuerda1 = GetChromaticScale (arrTuning[5]);  
	let cuerda2 = GetChromaticScale (arrTuning[4]);
	let cuerda3 = GetChromaticScale (arrTuning[3]);
	let cuerda4 = GetChromaticScale (arrTuning[2]);
	let cuerda5 = GetChromaticScale (arrTuning[1]);
	let cuerda6 = GetChromaticScale (arrTuning[0]);
	//3.---------------find all chord notes in the strings------------------------------
	let arrStr6=[];let arrStr5=[]; let arrStr4=[]; let arrStr3=[]; let arrStr2=[]; let arrStr1=[];  
	arrStr6.push("x");arrStr5.push("x");arrStr4.push("x");arrStr3.push("x");arrStr2.push("x");arrStr1.push("x");
	arrNotes.forEach (function(chordnote){
		cuerda6.forEach (function (cuerdaNote,i){if (chordnote === cuerdaNote) {arrStr6.push(i)};});
		cuerda5.forEach (function (cuerdaNote,i){if (chordnote === cuerdaNote) {arrStr5.push(i)};});
		cuerda4.forEach (function (cuerdaNote,i){if (chordnote === cuerdaNote) {arrStr4.push(i)};});
		cuerda3.forEach (function (cuerdaNote,i){if (chordnote === cuerdaNote) {arrStr3.push(i)};});
		cuerda2.forEach (function (cuerdaNote,i){if (chordnote === cuerdaNote) {arrStr2.push(i)};});
		cuerda1.forEach (function (cuerdaNote,i){if (chordnote === cuerdaNote) {arrStr1.push(i)};});
	});	
	//4.--------------create patterns--------------------------------------------------
	for (let i6=0; i6 < arrStr6.length; i6++){
		for (let i5=0; i5 < arrStr5.length; i5++){
			for (let i4=0; i4 < arrStr4.length; i4++){
				for (let i3=0; i3 < arrStr3.length; i3++){
					for (let i2=0; i2 < arrStr2.length; i2++){
						for (let i1=0; i1 < arrStr1.length; i1++){

							let arrTab =[];
							arrTab.push (arrStr6[i6]);
							arrTab.push (arrStr5[i5]);
							arrTab.push (arrStr4[i4]);
							arrTab.push (arrStr3[i3]);
							arrTab.push (arrStr2[i2]);
							arrTab.push (arrStr1[i1]);
							
							let iMin = GetMin (arrTab); let iMax = GetMax (arrTab); 
							
							if (isFinite (iMin) && isFinite (iMax)){
								if ((iMax - iMin) < 5){
									if (AllMandatoryNotesInTab (arrTab, arrMandatoryNotes)){ 
										if (RootIsRoot (arrTab, arrMandatoryNotes[0])){
											if (RootIsNotDup (arrTab)){
												if (TabIsPlayable (arrTab)){
													//console.log (arrTab);
													arrOUT.push (arrTab); 
												}
											}
										}
									}
								}
							}
						}//1						
					}//2					
				}//3
			}//4				
		}//5		
	}//6
	
	return (arrOUT); 
}
function AllMandatoryNotesInTab (arrTab, arrMandatoryNotes){
	//INPUT : 
	//	arrTab: array of <string>. e.g.: ["x",1,0,3,"x",4]
	// 	arrMandatoryNotes: array of <string>. Mandatory notes of the chord. 
	// 	arrTuning: array of <string>. Guitar tuning 
	//OUTPUT: True or False 

	if (arguments.length !==2) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (Array.isArray(arrTab)) {}else{console.log ("ERROR: Invalid type");return; }   	
	if (Array.isArray(arrMandatoryNotes)) {}else{console.log ("ERROR: Invalid type");return; }   	
	
	let arrTuning = document.getElementById("selTuning").value.split("-"); 
		
	//1.---find the notes for this tab 	
	let arrTabNotes = []; 
	let iString = 0; 
	for (let i=0; i < arrTab.length; i++){
		if (typeof (arrTab[i]) == "number") {
			switch (i){
				case 5: iString=1; break; 
				case 4: iString=2; break; 
				case 3: iString=3; break; 
				case 2: iString=4; break; 
				case 1: iString=5; break; 
				case 0: iString=6; break; 
			}
			let sNote = GetNoteForFret (iString, arrTab[i], arrTuning); 
			arrTabNotes.push (sNote);
		}else{
			arrTabNotes.push ("x");
		}
	}
	//2.---check if all mandatory notes are in this tab 
	for (let i=0; i < arrMandatoryNotes.length; i++){
		if (arrTabNotes.indexOf(arrMandatoryNotes[i]) === -1){return false;}
	}
	return true; 
}
function GetNoteForFret(iString, iFret, arrTuning) {
    //INPUT:  a guitar string number (1 to 6), fret number and tuning
	//OUTPUT: (string) note in that string/fret

	if (arguments.length < 3) {return "ERROR: Invalid number of arguments"}; 
	if (typeof(iString) !== "number") {return "ERROR: Invalid type"}; 
	if (typeof(iFret) !== "number") {return "ERROR: Invalid type"}; 
	if (iString < 0 || iString > 6) {return "ERROR: Invalid arguments"};
	if (iFret < 0) {return "ERROR: Invalid arguments"};
		
	//1.----------------sanitize arrTuning------------------------------------------------
	for (let i=0; i < arrTuning.length; i++){
		if (arrTuning[i].indexOf("'") > -1 ){
			arrTuning[i] = arrTuning[i].replace (/'/g,''); 
		}
		if (arrTuning[i].indexOf("b") > -1 ){
			arrTuning[i] = arrTuning[i].replace (/Ab/g,'G#'); 
			arrTuning[i] = arrTuning[i].replace (/Bb/g,'A#'); 
			arrTuning[i] = arrTuning[i].replace (/Cb/g,'B'); 
			arrTuning[i] = arrTuning[i].replace (/Db/g,'C#'); 
			arrTuning[i] = arrTuning[i].replace (/Eb/g,'D#'); 
			arrTuning[i] = arrTuning[i].replace (/Fb/g,'E'); 
			arrTuning[i] = arrTuning[i].replace (/Gb/g,'F#');
		}
	}
	//2.----------------build the guitar--------------------------------------------------
	let cuerda1 = GetChromaticScale (arrTuning[5]);  
	let cuerda2 = GetChromaticScale (arrTuning[4]);
	let cuerda3 = GetChromaticScale (arrTuning[3]);
	let cuerda4 = GetChromaticScale (arrTuning[2]);
	let cuerda5 = GetChromaticScale (arrTuning[1]);
	let cuerda6 = GetChromaticScale (arrTuning[0]);	
	//3.--------------find the note in guitar string--------------------------------------
	switch (iString){
		case 6: return (cuerda6[iFret]); break; 
		case 5: return (cuerda5[iFret]); break; 
		case 4: return (cuerda4[iFret]); break; 
		case 3: return (cuerda3[iFret]); break; 
		case 2: return (cuerda2[iFret]); break; 
		case 1: return (cuerda1[iFret]); break; 
	}
	return arrString[iFret];
}
function RootIsRoot (arrTab, strNote){
	//INPUT:
	//arrTab: <array>. E.g.: [ "x", 1, 1, 2, 5, 3 ]
	//strNote: <string> representing the root note of the chord E.g.: "C#"
	//OUTPUT: 
	//true: lowest note of the tab = root note of the chord
	//false: lowest note of the tab != root note of the chord
	
	if (arguments.length !==2) {console.log ("ERROR: Invalid number of arguments"); return false;}
	if (Array.isArray(arrTab)) {}else{console.log ("ERROR: Invalid type");return false; }   	
	
	let arrTuning = document.getElementById("selTuning").value.split("-"); 
		
	//1.---find the notes for this tab 	
	let arrTabNotes = []; 
	let iString = 0; 
	for (let i=0; i < arrTab.length; i++){
		if (typeof (arrTab[i]) == "number") {
			switch (i){
				case 5: iString=1; break; 
				case 4: iString=2; break; 
				case 3: iString=3; break; 
				case 2: iString=4; break; 
				case 1: iString=5; break; 
				case 0: iString=6; break; 
			}
			let sNote = GetNoteForFret (iString, arrTab[i], arrTuning); 
			arrTabNotes.push (sNote);
		}else{
			arrTabNotes.push ("x");
		}
	}	
	
	//2.---check if root is root 
	if (arrTabNotes[0]!== "x"){
		if  (arrTabNotes[0]!== strNote) {return false;}
	}
	if (arrTabNotes[0]=== "x" && arrTabNotes[1]!== "x"){
		if  (arrTabNotes[1]!== strNote) {return false;}
	}
	if (arrTabNotes[0]=== "x" && arrTabNotes[1]=== "x" && arrTabNotes[2]!== "x"){
		if  (arrTabNotes[2]!== strNote) {return false;}
	}
	if (arrTabNotes[0]=== "x" && arrTabNotes[1]=== "x" && arrTabNotes[2]=== "x"){
		if  (arrTabNotes[3]!== strNote) {return false;}
	}

	return true; 
}
function RootIsNotDup (arrTab){
	//INPUT: <array>. E.g.: [ "x", 1, 1, 2, 5, 3 ]
	//OUTPUT: true or false
	
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return false;}
	if (Array.isArray(arrTab)) {}else{console.log ("ERROR: Invalid type");return false; }   		

	if (arrTab[0]!== "x"){
		if  (arrTab[0] > 11)  return false;
	}

	if (arrTab[0]=== "x" && arrTab[1] !== "x"){
		if  (arrTab[1] > 11)  return false;
	}
	
	if (arrTab[0]=== "x" && arrTab[1] === "x" && arrTab[2] !== "x"){
		if  (arrTab[2] > 11)  return false;
	}

	if (arrTab[0]=== "x" && arrTab[1] === "x" && arrTab[2] === "x"){
		if  (arrTab[3] > 11)  return false;
	}

	return true; 
}
function TabIsPlayable (arrTab){
	let s6 = arrTab[0]; 
	let s5 = arrTab[1]; 
	let s4 = arrTab[2]; 
	let s3 = arrTab[3];
	let s2 = arrTab[4]; 
	let s1 = arrTab[5];
	let aTEMP = []; 
	let aMIN=0, fingers=0, iBarre=0; 
	
	//cuerdas no consecutivas
	let mutes = 0; 
	if (s6 === "x") {mutes+=1;}	if (s5 === "x") {mutes+=1;};if (s4 === "x") {mutes+=1;};if (s3 === "x") {mutes+=1;};if (s2 === "x") {mutes+=1;};if (s1 === "x") {mutes+=1;};		
	//if (mutes === 4) {return false;}
	if (mutes === 3) {
		if (s6 !== "x" && s5 !== "x" && s4 === "x"){return false;}
		if (s6 === "x" && s5 !== "x" && s4 !== "x" && s3 === "x"){return false;}	
		if (s6 === "x" && s5 === "x" && s4 !== "x" && s3 !== "x" && s2 === "x"){return false;}	
		if (s6 === "x" && s5 === "x" && s4 !== "x" && s3 === "x"){return false;}
		if (s6 === "x" && s4 === "x" && s3 === "x"){return false;}	
		if (s6 === "x" && s4 === "x" && s2 === "x"){return false;}	
		if (s6 === "x" && s4 === "x" && s1 === "x"){return false;}	
		if (s5 === "x" && s4 === "x" && s1 === "x"){return false;}
		if (s5 === "x" && s4 === "x" && s2 === "x"){return false;}
		if (s5 === "x" && s3 === "x" && s1 === "x"){return false;}	
		if (s5 === "x" && s3 === "x" && s2 === "x"){return false;}
		if (s5 === "x" && s2 === "x" && s1 === "x"){return false;}	
		if (s5 === "x" && s4 === "x" && s3 === "x"){return false;}
	}
	//kill them all to the right (from the minimum fret) if it has JUST ONE "x" and more than 3 fingers to the right
	if (s6 !== "x") {aTEMP.push(s6)};
	if (s5 !== "x") {aTEMP.push(s5)};
	if (s4 !== "x") {aTEMP.push(s4)};
	if (s3 !== "x") {aTEMP.push(s3)};
	if (s2 !== "x") {aTEMP.push(s2)};
	if (s1 !== "x") {aTEMP.push(s1)};

	if (aTEMP.length >= 5){
		aMIN = Math.min(...aTEMP);
		fingers = 0;
		iBarre = 0; 
		if (s1 > aMIN){
			if (s1 === s2){
				if (s2 === s3){
					if (s3 === s4){
						if (s4 === s5){
							iBarre = 5;
						}else{
							iBarre = 4;
						}
					}else{
						iBarre = 3; 
					}
				}else{
					iBarre = 2; 
				}
			}else{
				iBarre = 0; 
			}
		}
		if (iBarre === 0){
			if (s1 > aMIN) {fingers++;}
			if (s2 > aMIN) {fingers++;}
			if (s3 > aMIN) {fingers++;}
			if (s4 > aMIN) {fingers++;}
			if (s5 > aMIN) {fingers++;}
			if (s6 > aMIN) {fingers++;}
			if (fingers > 3){return false;}			
		}
		if (iBarre === 2){
			if (s1 > aMIN) {fingers++;}
			if (s3 > aMIN) {fingers++;}
			if (s4 > aMIN) {fingers++;}
			if (s5 > aMIN) {fingers++;}
			if (s6 > aMIN) {fingers++;}	
			if (fingers > 3){return false;}			
		}
		if (iBarre === 3){
			if (s3 > aMIN) {fingers++;}
			if (s4 > aMIN) {fingers++;}
			if (s5 > aMIN) {fingers++;}
			if (s6 > aMIN) {fingers++;}	
			if (fingers > 3){return false;}			
		}	
		if (iBarre === 4){
			if (s4 > aMIN) {fingers++;}
			if (s5 > aMIN) {fingers++;}
			if (s6 > aMIN) {fingers++;}	
			if (fingers > 3){return false;}
		}
		if (iBarre === 5){
			if (s5 > aMIN) {fingers++;}
			if (s6 > aMIN) {fingers++;}	
			if (fingers > 3){return false;}			
		}
	}
	return true;
}
//---AUXILIARY Functions
function GetMax (arrIN){
	//get the max of an array, even if it has NaN
	//INPUT: array (any type)
	//OUTPUT: integer
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (Array.isArray(arrIN)) {}else{console.log ("ERROR: Invalid type");return; }   		
	
	let arrTEMP =[]; 

	//weed out NaNs
	for (let i=0; i<arrIN.length; i++){
		if (typeof arrIN[i] === 'number'){arrTEMP.push(arrIN[i]);}
	}
	
	return (Math.max (...arrTEMP)); 
}
function GetMin (arrIN){
	//get the min of an array, even if it has NaN
	//INPUT: array (any type)
	//OUTPUT: integer
	if (arguments.length !==1) {console.log ("ERROR: Invalid number of arguments"); return;}
	if (Array.isArray(arrIN)) {}else{console.log ("ERROR: Invalid type");return; }   	
	
	let arrTEMP =[]; 
	
	//weed out NaNs
	for (let i=0; i<arrIN.length; i++){
		if (typeof arrIN[i] === 'number'){arrTEMP.push(arrIN[i]);}
	}
	return (Math.min (...arrTEMP)); 
}
