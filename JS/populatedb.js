"use strict";
console.log ("PopulateDB"); 

let i; 

//1. Generate the chords and add them to MyApp.DBchords. Schema: 
if (MyApp.DBchords.length ===  0){ 
	LoadDB(); 
	console.log(String(MyApp.DBchords.length) +" chords added to the DB");
}

//2. For each chord: generate Formula and Optional (integer) 
for (i = 0; i < MyApp.DBchords.length; i++) {
	MyApp.DBchords[i].FormulaInt = GetChordDegrees (MyApp.DBchords[i].FormulaStr); 
	MyApp.DBchords[i].OptionalInt = GetChordDegrees (MyApp.DBchords[i].OptionalStr); 
}		

//3. For each chord: generate Name  (diads have the name already defined in MyApp.DBintervals)
for (i = 0; i < MyApp.DBchords.length; i++) {
	MyApp.DBchords[i].ChordName = BuildChordName (MyApp.DBchords[i].FormulaRaw); 	
}

//4. For each chord: add them to Select 
for (i = 0; i < MyApp.DBchords.length; i++) {
	
	//MyApp.DBchords[i].ChordName = BuildChordName (MyApp.DBchords[i].FormulaRaw); 	
}




//DEBUG
for (i = 0; i < MyApp.DBchords.length; i++) {
	let sDebug = "FALSE"; 	
	//if (MyApp.DBchords[i].ChordName.indexOf("Aug") > -1) { sDebug="TRUE"; }
	//if (MyApp.DBchords[i].ChordName === "min add 13") { sDebug="TRUE"; }
	//arrFormulaStr.indexOf("5") > -1)

	if (sDebug === "TRUE") {
		console.log (MyApp.DBchords[i].CHORDId + "\t\t\t" + "Chord Name: " + MyApp.DBchords[i].ChordName) ;
	}
}

console.log (MyApp.DBchords[0]);
let iRandom = (Math.floor(Math.random() * MyApp.DBchords.length));
console.log (MyApp.DBchords[iRandom]);



function LoadDB(){
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
    let i, j, k; 
    let i1, i2, i4, i3, i5, i6, i7, i9, i11, i13;
    let counterChords = 0;
	let iSeven=0; 
	let bolOK = true; 
	
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
											bolOK = true; 

											//generate the Chord Formula "raw"
											let arrFormulaRaw=[]; 
											arrFormulaRaw.length = 0; 
											arrFormulaRaw.push(arr1[i1]); 
											arrFormulaRaw.push(arr2[i2]);
											arrFormulaRaw.push(arr3[i3]);
											arrFormulaRaw.push(arr4[i4]);
											arrFormulaRaw.push(arr5[i5]);
											arrFormulaRaw.push(arr6[i6]);
											arrFormulaRaw.push(arr7[i7]);
											arrFormulaRaw.push(arr9[i9]);
											arrFormulaRaw.push(arr11[i11]);
											arrFormulaRaw.push(arr13[i13]);
											
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
								
											if (bolOK){	
												if (arrFormulaStr.length <= 1){bolOK = false;}	
											}											
											
											if (bolOK){	
												//discard obvious errors
												if (IsValidChord (arrFormulaRaw)=== false){bolOK = false; }
											}											
												
											if (bolOK){			
												//determine iSeven
												iSeven = GetSeven (arrFormulaRaw);		
												let arrOptionalStr=[]; 
												arrOptionalStr.length = 0;
												//determine Optional Notes (degrees) 
												if (iSeven > 0) {
													if (arrFormulaStr.indexOf("5") > -1) {
														arrOptionalStr.push("5");
													}
													if (iSeven === 13) {
														arrOptionalStr.push("11");
														arrOptionalStr.push("9");
													}
													if (iSeven === 11) {
														arrOptionalStr.push("9");
													}
													if (iSeven === 9) { }			
												}
												//determine Optional Notes (NotesRef) 
												let arrOptionalNotesRef =[]; 
												arrOptionalNotesRef.length = 0; 
												let arrTEMP1 = []; 
												arrTEMP1.length = 0; 
												for (i=0; i < arrOptionalStr.length; i++){
													arrTEMP1 = MyApp.DBdegrees.filter(function(el){return el.DegreeStr === arrOptionalStr[i];}); //search REFERENCE note in the DB
													arrOptionalNotesRef.push (arrTEMP1[0].NoteRef); 
												}	
																						
												//add to database
												counterChords++;
												MyApp.DBchords.push({
													FormulaRaw: arrFormulaRaw, 
													FormulaStr: arrFormulaStr, 
													OptionalStr: arrOptionalStr,
													OptionalNotesRef:arrOptionalNotesRef, 
													CHORDId:arrFormulaStr.join()
												});
												//console.log ("1", arr2[i2], arr3[i3], arr4[i4], arr5[i5], arr6[i6], arr7[i7], arr9[i9], arr11[i11], arr13[i13]);
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
function GetSeven(arrIN){
	//INPUT: arrIN with degrees (NOT integers) 
	//OUPUT: integer: 0, 7, 9, 11, 13 
	let iiSeven = 0; 
	let i=0; 

	let s1 = arrIN[0];
	let s2 = arrIN[1]; 
	let s3 = arrIN[2]; 
	let s4 = arrIN[3]; 
	let s5 = arrIN[4]; 
	let s6 = arrIN[5]; 
	let s7 = arrIN[6]; 
	let s9 = arrIN[7]; 
	let s11 = arrIN[8]; 
	let s13 = arrIN[9]; 	

	//bb7 only valid for Dim 
	if (s7 === "bb7") {
		if (s3 === "b3"  && s5 === "b5" ) {
			//do nothing 
		}
		else {
			isOk = false;
			return isOk; 	
		}
	}

	if (s7 === "b7" || s7 === "7" || s7 === "bb7") { 
		iiSeven = 7; 
		if (s9 === "9" && s11 === "11" && s13 === "13") {iiSeven = 13;}
		if (s9 === "9" && s11 === "11" && s13 !== "13") {iiSeven = 11;}
		if (s9 === "9" && s11 !== "11")   {iiSeven = 9;}	
	}
	return iiSeven; 
}
function IsValidChord (array){
	//INPUT	: array of strings with degrees (even empty) 
	//OUTPUT: true or false
	let isOk = true; 
	let s1 = array[0];
	let s2 = array[1]; 
	let s3 = array[2]; 
	let s4 = array[3]; 
	let s5 = array[4]; 
	let s6 = array[5]; 
	let s7 = array[6]; 
	let s9 = array[7]; 
	let s11 = array[8]; 
	let s13 = array[9]; 
	
	let i=0;
	let iNotes=0;	
	let sTemp=""; 
	
	//remember that 9, 11 and 13 can also be thought of as 2, 4 and 6
	if (1){
		if ((array.indexOf("1") > -1) && (array.indexOf("#7") > -1)) {
			isOk = false; return isOk; 		
		}

		if ((array.indexOf("b2") > -1) && (array.indexOf("b9") > -1)) {
			isOk = false;return isOk; 		
		}	
		if ((array.indexOf("2") > -1) && (array.indexOf("9") > -1)) {
			isOk = false;return isOk; 		
		}

		if ((array.indexOf("b3") > -1) && (array.indexOf("#9") > -1)) {
			isOk = false;return isOk; 		
		}		

		if ((array.indexOf("3") > -1) && (array.indexOf("b11") > -1)) {
			isOk = false;return isOk; 		
		}	

		if ((array.indexOf("4") > -1) && (array.indexOf("11") > -1)) {
			isOk = false;return isOk; 		
		}
		
		if ((array.indexOf("b5") > -1) && (array.indexOf("#11") > -1)) {
			isOk = false;return isOk; 		
		}	

		if ((array.indexOf("5") > -1) && (array.indexOf("bb13") > -1)) {
			isOk = false;return isOk; 		
		}	

		if ((array.indexOf("#5") > -1) && (array.indexOf("b13") > -1)) {
			isOk = false;return isOk; 		
		}

		if ((array.indexOf("6") > -1) && (array.indexOf("13") > -1)) {
			isOk = false;return isOk; 		
		}

		if ((array.indexOf("b7") > -1) && (array.indexOf("#13") > -1)) {
			isOk = false;return isOk; 	
		}
		if ((array.indexOf("bb7") > -1) && (array.indexOf("6") > -1)) {
			isOk = false;return isOk; 	
		}		
	}

	//detect if it's a diad
	iNotes = 0;
	for (i=0; i< array.length; i++){
		if (array[i] !== ""){ iNotes++;	}
	}		

	//if it's not a diad, check if it's a valid triad
	if (iNotes  !== 2) {
		if (GetTriad(array)=== "ERROR"){
			isOk = false;
			return isOk;			
		}
	}	

	//bb7 only valid for Dim 
	if (s7 === "bb7") {
		if (s2 === "" && s3 === "b3" && s4 === "" && s5 === "b5" && s6 === "") {
			//do nothing 
		}
		else {
			isOk = false;
			return isOk; 
		}
	}

	return isOk; 	
}
function GetTriad (arrIN){
	//INPUT: arrIN with degrees (NOT integers) 
	//OUTPUT: string with triad name; returns "ERROR" if not valid triad 
	let sTriad = "ERROR";
	let i=0; 
	let arrTriad = []; 
	let sTemp = ""; 
	
	for (i=0; i<5; i++){
		if (arrIN[i] !== ""){
			arrTriad.push (arrIN[i]); 
		}
	}

	sTemp = arrTriad.join(); 
	switch (sTemp) {
		case ("1,3,5")  : sTriad="Maj"; break;
		case ("1,3,b5") : sTriad="Maj b5"; break;
		case ("1,3,#5") : sTriad="Aug"; break;

		case ("1,b3,5") : sTriad="min"; break;
		case ("1,b3,b5"): sTriad="dim"; break;

		case ("1,2,5")  : sTriad="sus2"; break;
		case ("1,b2,5") : sTriad="susb2"; break;
		case ("1,b2,b5"): sTriad="sus b2b5"; break;

		case ("1,4,5")  : sTriad="sus4"; ;break;
		//case ("1,#4,5") : sTriad="sus#4"; ;break;
		case ("1,4,b5") : sTriad="sus4b5"; ;break;

		default: sTriad="ERROR";  break; 
	}
	
	return sTriad; 
}
function GetChordDegrees (arrIN){
	//INPUT: array with degrees (string) of the formula
	//OUTPUT: array with degrees (integer) of the formula
	let arrOUT=[];
	let arrTEMP1=[];
	let i; 

	for (i=0; i<arrIN.length; i++){
		if (arrIN[i] !== ""){
			arrTEMP1 = MyApp.DBdegrees.filter(function(el){return el.DegreeStr === arrIN[i];}); //search degree in the DB
			arrOUT.push (arrTEMP1[0].DegreeInt); 
		} 
	}
	return arrOUT;
}
function BuildChordName (arrIN) {
	//INPUT: array with degrees (NOT integers) 
	//OUTPUT: string with chord name; returns "ERROR" if not valid triad or < not diad 
	//https://music.stackexchange.com/questions/11659/what-determines-a-chords-name	
	//https://music.stackexchange.com/questions/42999/how-do-you-figure-out-a-chords-name
	//http://www.smithfowler.org/music/Chord_Formulas.htm
	//https://music.stackexchange.com/questions/91623/whats-an-add-chord 
	
	let sName = "ERROR";
	let sTriad = "ERROR"; 
	let iSeven = 0; 
	let sExtensions = []; 
	let arrNotes = []; 
	let iNotes = 0; 
	let i=0;
	let arrTriad = []; 
	let sTemp = ""; 	

	let s1 = arrIN[0];
	let s2 = arrIN[1]; 
	let s3 = arrIN[2]; 
	let s4 = arrIN[3]; 
	let s5 = arrIN[4]; 
	let s6 = arrIN[5]; 
	let s7 = arrIN[6]; 
	let s9 = arrIN[7]; 
	let s11 = arrIN[8]; 
	let s13 = arrIN[9]; 

	//check if diad or triad
	for (i=0; i< arrIN.length; i++){
		if (arrIN[i] !== ""){ arrNotes.push (arrIN[i]);}
	}		
	
	if (arrNotes.length === 2){
		sName = arrNotes[1]+" "+ "Interval"; 
		sName = sName.trim(); 
		return sName; 
	}

	if (arrNotes.length > 2 ){
		sTriad = GetTriad (arrIN); 
		iSeven = GetSeven (arrIN); 
		
		for (i=0; i<5; i++){
			if (arrIN[i] !== ""){
				arrTriad.push (arrIN[i]); 
			}
		}		
		
		sTemp = sTriad; 
		switch (sTemp) {
			case ("Maj")  	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "Dom";}
				}
				break;
			case ("Maj b5")	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "Dom b5";}
				}
				break;				
			case ("Aug") 	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "Aug min";}
					if (s7 === "7")  {sTriad = "Aug Maj";}
				}			
				break;
			case ("min") 	: 
				if (iSeven > 0){
					if (s7 === "7")  {sTriad = "min/Maj";}
				}
				break;			
			case ("dim")	: 
				if (iSeven > 0){
					if (s7 === "bb7") {sTriad = "dim";}
					if (s7 === "b7")  {sTriad = "half dim";}
					if (s7 === "7")  {sTriad = "dim Maj";}
				}
				break;	
			case ("sus2")  	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "sus2";}
					if (s7 === "7")  {sTriad = "Maj sus2";}
				}			
				break;
			case ("susb2")  	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "susb2";}
					if (s7 === "7")  {sTriad = "Maj susb2";}
				}			
				break;				
			case ("sus b2b5")  	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "sus b2b5";}
					if (s7 === "7")  {sTriad = "Maj sus b2b5";}
				}			
				break;	
			case ("sus4")  	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "sus4";}
					if (s7 === "7")  {sTriad = "Maj sus4";}
				}				
				break;
			case ("sus4b5")  	: 
				if (iSeven > 0){
					if (s7 === "b7") {sTriad = "sus4b5";}
					if (s7 === "7")  {sTriad = "Maj sus4b5";}
				}				
				break;
			default			: break; 
		}		

		switch (iSeven){
			case 0: 
				if (s6 !== "") {sExtensions.push (s6); }
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
		
		//START correct special cases... 
		if (sName.indexOf("Dom b5") > -1 && iSeven > 0 ) {
			if (sName.indexOf("Dom b5 7") > -1) {sName = sName.replace ("Dom b5 7","Dom 7 b5"); }
			if (sName.indexOf("Dom b5 9") > -1) {sName = sName.replace ("Dom b5 9","Dom 9 b5"); }		
			if (sName.indexOf("Dom b5 11") > -1) {sName = sName.replace ("Dom b5 11","Dom 11 b5");}			
			if (sName.indexOf("Dom b5 13") > -1) {sName = sName.replace ("Dom b5 13","Dom 13 b5"); 	}			
		}

		if (sName.indexOf("Maj b5") > -1 && iSeven > 0 ) {
			if (sName.indexOf("Maj b5 7") > -1) {sName = sName.replace ("Maj b5 7","Maj 7 b5"); }
			if (sName.indexOf("Maj b5 9") > -1) {sName = sName.replace ("Maj b5 9","Maj 9 b5");}		
			if (sName.indexOf("Maj b5 11") > -1) {sName = sName.replace ("Maj b5 11","Maj 11 b5"); }			
			if (sName.indexOf("Maj b5 13") > -1) {sName = sName.replace ("Maj b5 13","Maj 13 b5");}						
		}
		
		if (sName.indexOf("sus2") === 0  && iSeven > 0 ) {
			if (sName.indexOf("sus2 7") > -1) {	sName = sName.replace ("sus2 7","7sus2"); }
			if (sName.indexOf("sus2 9") > -1) {sName = sName.replace ("sus2 9","9sus2");}		
			if (sName.indexOf("sus2 11") > -1) {sName = sName.replace ("sus2 11","11sus2");}			
			if (sName.indexOf("sus2 13") > -1) {sName = sName.replace ("sus2 13","13sus2"); }	
		}	
		if (sName.indexOf("susb2") === 0  && iSeven > 0 ) {
			if (sName.indexOf("susb2 7") > -1) {sName = sName.replace ("susb2 7","7susb2"); }
			if (sName.indexOf("susb2 9") > -1) {sName = sName.replace ("susb2 9","9susb2"); }		
			if (sName.indexOf("susb2 11") > -1) {sName = sName.replace ("susb2 11","11susb2"); }			
			if (sName.indexOf("susb2 13") > -1) {sName = sName.replace ("susb2 13","13susb2"); 			}	
		}	
		if (sName.indexOf("sus b2b5") === 0  && iSeven > 0 ) {
			if (sName.indexOf("sus b2b5 7") > -1) {sName = sName.replace ("sus b2b5 7","7susb2 b5"); }
			if (sName.indexOf("sus b2b5 9") > -1) {sName = sName.replace ("sus b2b5 9","9susb2 b5"); }		
			if (sName.indexOf("sus b2b5 11") > -1) {sName = sName.replace ("sus b2b5 11","11susb2 b5"); }			
			if (sName.indexOf("sus b2b5 13") > -1) {sName = sName.replace ("sus b2b5 13","13susb2 b5"); }	
		}			
		if (sName.indexOf("sus4") === 0  && iSeven > 0 ) {
			if (sName.indexOf("sus4 7") > -1) {sName = sName.replace ("sus4 7","7sus4"); }
			if (sName.indexOf("sus4 9") > -1) {sName = sName.replace ("sus4 9","9sus4"); }		
			if (sName.indexOf("sus4 11") > -1) {sName = sName.replace ("sus4 11","11sus4"); }			
			if (sName.indexOf("sus4 13") > -1) {sName = sName.replace ("sus4 13","13sus4"); 			}	
		}	
		if (sName.indexOf("sus4b5") === 0  && iSeven > 0 ) {
			if (sName.indexOf("sus4b5 7") > -1) {sName = sName.replace ("sus4b5 7","7susb4 b5"); }
			if (sName.indexOf("sus4b5 9") > -1) {sName = sName.replace ("sus4b5 9","9susb4 b5"); }		
			if (sName.indexOf("sus4b5 11") > -1) {sName = sName.replace ("sus4b5 11","11susb4 b5");}			
			if (sName.indexOf("sus4b5 13") > -1) {sName = sName.replace ("sus4b5 13","13susb4 b5"); 			}	
		}			

		if (sName.indexOf("Maj sus2") === 0  ) {
			if (sName.indexOf("Maj sus2 7") > -1) {sName = sName.replace ("Maj sus2 7","Maj 7 sus2"); }
			if (sName.indexOf("Maj sus2 9") > -1) {sName = sName.replace ("Maj sus2 9","Maj 9 sus2"); }
			if (sName.indexOf("Maj sus2 11") > -1) {sName = sName.replace ("Maj sus2 11","Maj 11 sus2"); }
			if (sName.indexOf("Maj sus2 13") > -1) {sName = sName.replace ("Maj sus2 13","Maj 13 sus2"); }		
		}
		if (sName.indexOf("Maj susb2") === 0  ) {
			if (sName.indexOf("Maj susb2 7") > -1) {sName = sName.replace ("Maj susb2 7","Maj 7 susb2"); }
			if (sName.indexOf("Maj susb2 9") > -1) {sName = sName.replace ("Maj susb2 9","Maj 9 susb2"); }
			if (sName.indexOf("Maj susb2 11") > -1) {sName = sName.replace ("Maj susb2 11","Maj 11 susb2"); }
			if (sName.indexOf("Maj susb2 13") > -1) {sName = sName.replace ("Maj susb2 13","Maj 13 susb2"); }	
		}
		if (sName.indexOf("Maj sus b2b5") === 0  ) {
			if (sName.indexOf("Maj sus b2b5 7") > -1) {sName = sName.replace ("Maj sus b2b5 7","Maj 7 susb2 b5"); }
			if (sName.indexOf("Maj sus b2b5 9") > -1) {sName = sName.replace ("Maj sus b2b5 9","Maj 9 susb2 b5"); }
			if (sName.indexOf("Maj sus b2b5 11") > -1) {sName = sName.replace ("Maj sus b2b5 11","Maj 11 susb2 b5"); }
			if (sName.indexOf("Maj sus b2b5 13") > -1) {sName = sName.replace ("Maj sus b2b5 13","Maj 13 susb2 b5"); }	
		}		
		if (sName.indexOf("Maj sus4") === 0  ) {
			if (sName.indexOf("Maj sus4 7") > -1) {sName = sName.replace ("Maj sus4 7","Maj 7 sus4"); }
			if (sName.indexOf("Maj sus4 9") > -1) {sName = sName.replace ("Maj sus4 9","Maj 9 sus4"); }
			if (sName.indexOf("Maj sus4 11") > -1) {sName = sName.replace ("Maj sus4 11","Maj 11 sus4"); }
			if (sName.indexOf("Maj sus4 13") > -1) {sName = sName.replace ("Maj sus4 13","Maj 13 sus4"); }		
		}			
		if (sName.indexOf("Maj sus4b5") === 0  && iSeven > 0 ) {
			if (sName.indexOf("Maj sus4b5 7") > -1) {sName = sName.replace ("Maj sus4b5 7","Maj 7 sus4 b5"); }
			if (sName.indexOf("Maj sus4b5 9") > -1) {sName = sName.replace ("Maj sus4b5 9","Maj 9 sus4 b5"); }		
			if (sName.indexOf("Maj sus4b5 11") > -1) {sName = sName.replace ("Maj sus4b5 11","Maj 11 sus4 b5");}			
			if (sName.indexOf("Maj sus4b5 13") > -1) {sName = sName.replace ("Maj sus4b5 13","Maj 13 sus4 b5"); 			}	
		}			
		//END correct special cases... 
		
		sName = sName.trim(); 
	}	

	//DEBUG 
	//if (sTriad.toLowerCase()===("Maj b5").toLowerCase()) {
		// if (iSeven === 0) {
			// console.log (arrIN +"\t\t\t"+ sName +"\t\t\t" + sTriad + "\t\t\t" +iSeven.toString() + "\t\t\t" +sExtensions);
		// }				
	//}

	return sName; 
}