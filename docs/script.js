const right_1 = document.getElementById('show_calculator');
const Calculator = document.getElementById('calculator');

right_1.addEventListener('mouseenter', () => {
    Calculator.style.display = 'block';
});

function showCalculator(tention, required, admitted) {
    Calculator.style.display = 'block';
    document.getElementById("tention").placeholder = tention;
    document.getElementById("force").placeholder = required;
    document.getElementById("area").placeholder = admitted;
}

document.querySelectorAll('.Calculations').forEach(element => {
    element.addEventListener('mouseenter', (event) => {
        const elementDivId = event.target.id; //Get ID of Hovered Element
        const Head = event.target.innerHTML; //Get Caption of Hovered Element
        showExtraContent(elementDivId, Head)
    });
});
function showExtraContent(Cnategory_ID, Head) {
    document.getElementById("extra_content").style.visibility = "visible" // Make Vissible
    document.getElementById("extra_content_head").innerHTML = Head; // Update Head
    const ExtraContent = document.getElementById(`E_${Cnategory_ID}`).innerHTML;
    document.getElementById("main_extra_content").innerHTML = ExtraContent; //Update Content
}

function ClearAll() {
    document.getElementById("extra_content").style.visibility = "hidden";//Hide extra_Content
    Calculator.style.display = 'none';//Hide calculator
    Clear_Calc();//Clear calculator values
    New_Pin ? Pin_note() : false;//Pin last note
    document.querySelectorAll('.content-container').forEach(div => { div.classList.add('hidden_content'); });//Hide all content divs
}

function showContentDiv(divId) {
    document.querySelectorAll('.content-container').forEach(div => {
        div.classList.add('hidden_content');
    });
    document.getElementById(divId).classList.remove('hidden_content');
}

document.querySelectorAll('.submenu_special_left').forEach(element => {
    element.addEventListener('mouseenter', (event) => {
        showContentDiv(`${event.target.id}` + "_content")
    });
});

//show subcategory of chategory inside content div's
document.querySelectorAll('.definition').forEach(element => {
    element.addEventListener('mouseenter', (event) => {
        const Content = event.target.children[0];
        event.target.style.height = `${parseInt(Content.id)}px`;
        Content.classList.remove("hidden_content");
        event.target.style.width = "250px";
        event.target.children[1].classList.remove("hidden_content");
    });
});
//hide subcategory of chategory when button is clicked
function close_definition_sub(buttonID) {
    const parentDiv = buttonID.parentElement;
    parentDiv.style.width = "170px";
    parentDiv.style.height = "20px";
    buttonID.classList.add("hidden_content");
    parentDiv.querySelector(".definition_sub").classList.add("hidden_content");
}

//     element.addEventListener('mouseleave', (event) => {
//     event.target.children[0].classList.add("hidden_content");
//     event.target.style.width = "135px";
//     event.target.style.height = "20px";
//     });
// }

const infoBox = document.querySelector('.info-box');
const notes = document.querySelector('.note-box');
const noteContent = document.querySelector('.note_content')
const h1 = document.querySelector('.h1')
const note_button = document.querySelector('.B_notes')

infoBox.addEventListener('mouseenter', () => {
    notes.style.top = '230px';
});
infoBox.addEventListener('mouseleave', () => {
    notes.style.top = '80px';
});

document.getElementById("right").addEventListener("mouseenter", () => {
    notes.style.right = "330px";
    infoBox.style.right = "330px";
});

document.getElementById("right").addEventListener("mouseleave", () => {
    notes.style.right = "120px";
    infoBox.style.right = "120px";
});

noteContent.addEventListener('input', () => { AutoResize() })

function AutoResize() {
    if (noteContent.scrollHeight >= 60) {
        notes.style.height = noteContent.scrollHeight + 100 + "px";
    }
}

let zoom_after_note = false;
let New_Pin = false;

notes.addEventListener("mouseenter", () => {
    New_Pin = true;
    if (noteContent.scrollHeight < 60) {
        notes.style.width = "150px";
        notes.style.height = "150px";
    }
    if (zoom_after_note === true) {
        notes.style.width = "150px";
        notes.style.height = noteContent.scrollHeight + 100 + "px";
        zoom_after_note = 0;
    }
    noteContent.style.opacity = "1";
    h1.style.opacity = "0";
    h1.style.transition = "opacity 0.1s ease-in";
    note_button.style.opacity = "1";
});

let pinCounter = 0;
function Pin_note() {
    New_Pin = false;
    pinCounter++
    PinLogic(pinCounter)
    zoom_after_note = true;
    document.getElementById("loding_circle").classList.add("clicked");
    document.getElementById("noteButton").classList.add("clicked");
    setTimeout(() => {
        notes.style.width = "30px";
        notes.style.height = "30px";
        noteContent.style.opacity = "0";
        h1.style.opacity = "1";
        note_button.style.opacity = "0";
        document.getElementById("noteButton").classList.remove("clicked");
        document.getElementById("loding_circle").classList.remove("clicked");
    }, 750);
}

function PinLogic(Pins) {
    const newDiv = document.createElement('div');
    newDiv.id = 'Pin_' + Pins;
    newDiv.className = 'submenu_special_right Pin_div';
    newDiv.innerHTML = `<a href="#">Pin ${Pins}</a> <button class="Pin_Buttons" id="Button_Pin_${Pins}">C</button>`;
    document.getElementById('add_pins').appendChild(newDiv);
    const newContentDiv = document.createElement('div');
    newContentDiv.id = 'Pin_Content_' + Pins;
    newContentDiv.style.display = "none";
    newContentDiv.innerHTML = document.getElementById("Note_Content").innerHTML;
    newDiv.appendChild(newContentDiv);
    newDiv.addEventListener("mouseover", () => {
        document.getElementById("Note_Content").innerHTML = newContentDiv.innerHTML;
        notes.dispatchEvent(new Event("mouseenter"));
        AutoResize();
    });
    document.getElementById("Note_Content").innerHTML = "type something here...";
}

//delete selected pin
document.getElementById('add_pins').addEventListener('click', event => {
    if (event.target.classList.contains('Pin_Buttons')) {
        event.target.parentElement.remove();
        notes.style.width = "30px";
        notes.style.height = "30px";
        noteContent.style.opacity = "0";
        h1.style.opacity = "1";
        note_button.style.opacity = "0";
        document.getElementById("noteButton").classList.remove("clicked");
        document.getElementById("loding_circle").classList.remove("clicked");
    }
});

function Clear_Calc() {
    const Tention = document.getElementById("tention");
    const Area = document.getElementById("area");
    const Force = document.getElementById("force");
    Tention.value = "";
    Area.value = "";
    Force.value = "";
    Tention.placeholder = "Spannung";
    Area.placeholder = "Fläche";
    Force.placeholder = "Kraft";
}

function Reset() {
    pinCounter = 0;
}
function Clear() {
    Reset();
    document.getElementById("add_pins").innerHTML = "";
}

function Clear_Reset_Hover(input, B_id) {
    const Button = document.getElementById(`${B_id.id}`);
    Button.classList.add("clicked");
    setTimeout(() => {
        Button.classList.remove("clicked");
        input();
    }, 333);
}

["tention", "force", "area"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => calculate(id));
    document.getElementById(id).addEventListener("change", () => calculate(id));
});

// document.querySelectorAll(".Calculation_Menu").forEach(menuItem => {
//     menuItem.addEventListener("mouseenter", () => {
//       document.querySelectorAll(".Calculations").forEach(item => {
//         item.style.display = "block";
//       });
//     });
//   });

function calculate(id) {

    let Tention = parseFloat(document.getElementById("tention").value);
    let force = parseFloat(document.getElementById("force").value);
    let area = parseFloat(document.getElementById("area").value);

    const Calc_Tention = () => { document.getElementById("tention").value = force / area; }
    const Calc_Force = () => { document.getElementById("force").value = area * Tention; }
    const Calc_Area = () => { document.getElementById("area").value = force / Tention; }

    const IsEmpty = (id) => { document.getElementById(id).innerHTML === "" }

    switch (true) {
        case id === "tention": // Spannung
            isNaN(Tention) && !IsEmpty(id) ? console.log("fehler!") : false
            !isNaN(area) ? Calc_Force() : Calc_Area();
            break;
        case id === "force": // Kraft
            isNaN(force) && !IsEmpty(id) ? console.log("fehler!") : false
            !isNaN(area) ? Calc_Tention() : Calc_Area();
            break;
        case id === "area": // Fläche
            isNaN(area) && !IsEmpty(id) ? console.log("fehler!") : false
            !isNaN(Tention) ? Calc_Force() : Calc_Tention();
            break;
    }
}

["tention", "force", "area"].forEach(id => {
    const el = document.getElementById(id);

    el.addEventListener("input", () => Berechnung(id));
    el.addEventListener("change", () => Berechnung(id));
});

