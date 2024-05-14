// Functions to change display

function handleChange() {

    // Get the selected number of variables and equations
    const numVariables = parseInt(document.getElementById("numVariables").value);
    const numEquations = parseInt(document.getElementById("numEquations").value);

    // Get the objective function
    const divObjective = document.getElementById("objective");

    // Get the constraints
    const divConstraints = document.getElementById("equations");

    // Get the non-negativity constraints
    const divNoNeg = document.getElementById("noNeg");

    // Get the output 
    const divOutput = document.getElementById("result");

    // Get the steps
    const divSteps = document.getElementById("steps");


    let objectiveHTML = "Z = ";

    for (let i = 1; i <= numVariables; i++) {

        if (document.getElementById(`x${i}O`) != undefined) {

            objectiveHTML += `<input class="vars2" id="x${i}O" type="number" value="${parseFloat(document.getElementById(`x${i}O`).value)}" 
            onchange="handleChangeConstraint()"> 
            x<sub>${i}</sub>`;

        }

        else
            objectiveHTML += `<input class="vars2" id="x${i}O" type="number" onchange="handleChangeConstraint()"> x<sub>${i}</sub>`;
        
        if (i !== numVariables) objectiveHTML += ` + `;
        
    }

    objectiveHTML += `<br><br>`;



    // Start template string
    let constraintsHTML = '';

    // Get values that should be kept
    for (let i = 1; i <= numEquations; i++) {

        for (let j = 1; j <= numVariables; j++) {

            if (document.getElementById(`x${j}${i}`) != undefined) {

                constraintsHTML += `<input class="vars" id="x${j}${i}" type="number" value="${parseFloat(document.getElementById(`x${j}${i}`).value)}" onchange="handleChangeConstraint()"> 
                x<sub>${j}</sub>`;
                
            }

            else 
                constraintsHTML += `<input class="vars" id="x${j}${i}" type="number" onchange="handleChangeConstraint()"> x<sub>${j}</sub>`;

            if (j !== numVariables) constraintsHTML += ' + ';
            
        }


        if (document.getElementById(`ineq${i}`) != undefined) {

            switch (document.getElementById(`ineq${i}`).value) {

                case ("lessOrEqual"):

                    constraintsHTML += 
                
                        ` <select id="ineq${i}" class="ineqs" onchange="handleChangeConstraint()">
                            <option value="lessOrEqual" selected="selected"> &le;</option>
                            <option value="equal"> &equals;</option>
                            <option value="greaterOrEqual"> &ge;</option>
                        </select> `;
                        

                    break;

                case ("equal"):

                    constraintsHTML += 
                    
                    ` <select id="ineq${i}" class="ineqs" onchange="handleChangeConstraint()">
                        <option value="lessOrEqual"> &le;</option>
                        <option value="equal" selected="selected"> &equals;</option>
                        <option value="greaterOrEqual"> &ge;</option>
                    </select> `; 
                    

                    break;

                case ("greaterOrEqual"):

                    constraintsHTML += 
                    
                    ` <select id="ineq${i}" class="ineqs" onchange="handleChangeConstraint()">
                        <option value="lessOrEqual"> &le;</option>
                        <option value="equal"> &equals;</option>
                        <option value="greaterOrEqual" selected="selected"> &ge;</option>
                    </select> `;
                    

                    break;

            }
        }

        else {

            constraintsHTML +=
            
            ` <select id="ineq${i}" class="ineqs" onchange="handleChangeConstraint()">
                <option value="lessOrEqual"> &le;</option>
                <option value="equal"> &equals;</option>
                <option value="greaterOrEqual"> &ge;</option>
            </select> `;
            

        }



        if (document.getElementById(`b${i}`) != undefined)
            constraintsHTML += `<input id="b${i}" style="width: 10%;" type="number" value="${parseFloat(document.getElementById(`b${i}`).value)}" 
        onchange="handleChangeConstraint()"> <br><br>`;

        else 
            constraintsHTML += `<input id="b${i}" style="width: 10%;" type="number" onchange="handleChangeConstraint()"> <br><br>`;

    }




    // Reset the non-negativity constraints
    divNoNeg.innerHTML = '';

    for (let i = 1; i <= numVariables; i++) {

        divNoNeg.innerHTML += `x<sub>${i}`;
        if (i !== numVariables) divNoNeg.innerHTML += ', ';
    }

    divNoNeg.innerHTML += ` &ge; 0 `;

    // Set all the appropriate inner HTML's
    divObjective.innerHTML = objectiveHTML;
    divConstraints.innerHTML = constraintsHTML;
    divOutput.innerHTML = "Result: <br>";
    divSteps.innerHTML = "";

}

function handleChangeFunctionType() {

    // Get Output div
    const divOutput = document.getElementById("result");

    // Get steps div
    const divSteps = document.getElementById("steps");

    // If we are just changing the type of function (i.e., not changing the number of equations or variables)
    // Then we shouldn't reset the current values
    if (document.getElementById("functionType").value == "Maximize") 
        document.getElementById("maxOrMin").innerHTML = `MAXIMIZE <br><br>`;

    else
        document.getElementById("maxOrMin").innerHTML = `MINIMIZE <br><br>`;


    // Reset the output's inner HTML (previous computed results should disappear)
    divOutput.innerHTML = "Result: <br>";
    divSteps.innerHTML = "";

}

function handleChangeConstraint() {

    // Get Output div
    const divOutput = document.getElementById("result");

    // Get steps div
    const divSteps = document.getElementById("steps");

    // Simply reset both divs
    divOutput.innerHTML ="Result: <br>";
    divSteps.innerHTML = "";


}