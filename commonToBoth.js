function isValidInput(numVariables, numEquations) {

    // First, check objective function
    for (let j = 0; j < numVariables; j++) {

        if (document.getElementById(`x${j + 1}O`).value == '')
            return false;
    }

    // Then, check the constraints
    for (let i = 0; i < numEquations; i++) {

        for (let j = 0; j < numVariables; j++) {

            if (document.getElementById(`x${j + 1}${i + 1}`).value == '')
                return false;
        }

        // Should also check for b values
        if (document.getElementById(`b${i + 1}`).value == '')
            return false;
    }

    return true;
}


function isEasy(numEquations) {

    // Check if b values are non-negative, and all operators are of type "<="
    // a matrix "isEasy" if the zero vector is always a feasible solution 

    for (let i = 1; i <= numEquations; i++) {

        if (parseFloat(document.getElementById(`b${i}`).value) < 0 || document.getElementById(`ineq${i}`).value == "equal" 
        || document.getElementById(`ineq${i}`).value == "greaterOrEqual")
            return false;
    }

    return true;
}


function isLessThanZero(element) {

    if (element instanceof BigMVariable)
        return (element.coefficient.compare(0) == -1 || 
        (element.coefficient.compare(0) == 0 && element.nonCoefficient.compare(0) == -1));

    return element.compare(0) == -1;
}


function findSmallestNonNegativeRatio(matrix, numEquations, index_j) {

    // Find pivot such that the ratio bi / xji is the smallest (non negative)
    let min = new Fraction(Number.MAX_VALUE);
    let index_i = -1;
    for (let i = 0; i < numEquations; i++) {

        // Only consider numbers > 0
        if (matrix[i][index_j].compare(0) == 1) {

            let ratio = matrix[i][matrix[i].length - 1].div(matrix[i][index_j]); // bi / xji
            if (ratio.compare(min) == 0 || ratio.compare(min) == -1) {

                min = ratio;
                index_i = i;
            }

        }
    }

    return index_i;


}


function performRowOperations(matrix, numEquations, index_i, index_j) {

    const divSteps = document.getElementById("steps");
    let htmlContent = '';

    // Perform pivot operations, first put the number to 1
    let pivot = matrix[index_i][index_j];

    for (let j = 0; j < matrix[0].length; j++) 
        matrix[index_i][j] = matrix[index_i][j].div(pivot);

    if (pivot.compare(1) != 0)
        htmlContent += `<b>R<sub>${index_i + 1}</sub> = R<sub>${index_i + 1}</sub>/${pivot.toString()}</b><br>`;

    else 
        htmlContent += `<b>R<sub>${index_i + 1}</sub> = R<sub>${index_i + 1}</sub></b><br>`;
    


    // Perform row operations: all elements above and below pivot should be 0
    for (let i = 0; i < numEquations + 1; i++) {

        if (i == index_i) continue; // skip pivot row as we have to keep it 1

        let ratio = matrix[i][index_j];

        if (ratio instanceof BigMVariable) {

            let ratio2 = new BigMVariable(ratio.coefficient, ratio.nonCoefficient);

            for (let j = 0; j < matrix[i].length; j++) {

                let numberToRemove = new BigMVariable(ratio2.coefficient, ratio2.nonCoefficient);
                numberToRemove.multiply(matrix[index_i][j]);
                matrix[i][j].subtract(numberToRemove);

            }

            // We have a null M
            if (ratio2.coefficient.compare(0) == 0) 
                htmlContent += `<b>R<sub>${i + 1}</sub> = R<sub>${i + 1}</sub> + ${ratio2.nonCoefficient.mul(-1).toString()}R<sub>${index_i + 1}</sub></b><br>`;
            
            // We have a negative M
            else if (ratio2.coefficient.compare(0) == -1) {
                let negate = new BigMVariable(ratio2.coefficient.mul(-1), ratio2.nonCoefficient.mul(-1));
                htmlContent += `<b>R<sub>${i + 1}</sub> = R<sub>${i + 1}</sub> + (${negate.toString()})R<sub>${index_i + 1}</sub></b><br>`;
            }

        }

        else {

            for (let j = 0; j < matrix[i].length; j++) {
                let numberToRemove = ratio.mul(matrix[index_i][j]);
                matrix[i][j] = matrix[i][j].sub(numberToRemove);

            }

            if (ratio.compare(1) == 0)
                htmlContent += `<b>R<sub>${i + 1}</sub> = R<sub>${i + 1}</sub> - R<sub>${index_i + 1}</sub></b><br>`;
    
            else if (ratio.compare(-1) == 0)
                htmlContent += `<b>R<sub>${i + 1}</sub> = R<sub>${i + 1}</sub> + R<sub>${index_i + 1}</sub></b><br>`;
                
            else if (ratio.compare(0) == 1)
                htmlContent += `<b>R<sub>${i + 1}</sub> = R<sub>${i + 1}</sub> - ${ratio.toString()}R<sub>${index_i + 1}</sub></b><br>`;
    
            else if (ratio.compare(0) == -1)
                htmlContent += `<b>R<sub>${i + 1}</sub> = R<sub>${i + 1}</sub> + ${ratio.mul(-1).toString()}R<sub>${index_i + 1}</sub></b><br>`;

        }
    }

    htmlContent += '<hr>';
    divSteps.innerHTML += htmlContent;
}


function displayCoords(matrix, Z, numVariables, numEquations) {

    let optimals = getCoords(matrix, numVariables, numEquations);

    // Change html to print out the result
    const r = document.getElementById("result");
    r.innerHTML = 
    "Result: <br>" + `Z = ${Z.toString()} at (`;

    for (let i = 0; i < optimals.length; i++) {

        r.innerHTML += `x<sub>${i + 1}</sub>`
        if (i + 1 < optimals.length)
            r.innerHTML += ", ";
        }



    r.innerHTML += ") = (";
    for (let i = 0; i < optimals.length; i++) {

        r.innerHTML += `${optimals[i].toString()}`

        if (i + 1 < optimals.length)
            r.innerHTML += "; ";
        }

    r.innerHTML += ").";
}


function getCoords(matrix, numVariables, numEquations) {

    let optimals = [];

    // Create a matrix for the solution
    // By complementary slackness, all variables in non-basic columns are 0
    for (let i = 0; i < numVariables; i++) 
        optimals.push(new Fraction(0));
        

    // Check for trivial solutions (when columns are not basic, the corresponding x is always equal to 0)
    // And non-trivial solutions (basic columns) 
    for (let j = 0; j < numVariables; j++) {

        let count_one = 0;
        let row = -1;

        for (let i = 0; i < numEquations; i++) {

            if (matrix[i][j].compare(1) != 0 && matrix[i][j].compare(0) != 0) 
                break;

            if (matrix[i][j].compare(1) == 0) {
                count_one++;
                row = i;
            }

            if (count_one > 1)
                break;

            if (i == numEquations - 1) {

                let r = matrix[row][matrix[row].length - 1];
                optimals[j] = r;
            }
                
        }
    }

    return optimals;


}


function explainSimplexEnd() {

    const divSteps = document.getElementById("steps");
    divSteps.innerHTML += 'Here is the final tableau:<br>';
}


// Explains why the result above has specific coordinates
function explainSimplexResult(matrix, numVariables, numEquations) {

    divSteps = document.getElementById("steps");

    let htmlContent = `Since there are no more negative values in the bottom row, this means that we are done with the algorithm. <br><br>
        To determine the coordinates of the optimal value, we need to look at all variables' columns, and see if they are basic. <br><br>
    `;

    let optimals = getCoords(matrix, numVariables, numEquations);

    for (let k = 0; k < optimals.length; k++) {

        if (optimals[k].compare(0) == 0) 
            htmlContent += `Column #${k + 1} is not basic, therefore x<sub>${k + 1}</sub> is 0.<br><br>`;
        

        else 
            htmlContent += `Column #${k + 1} is basic, therefore x<sub>${k + 1}</sub> is ${optimals[k]}.<br><br>`
        
    }

    let Z;

    if (matrix[matrix.length - 1][matrix[0].length - 1] instanceof BigMVariable) {

        if (document.getElementById("functionType").value === "Maximize")
            Z = matrix[matrix.length - 1][matrix[0].length - 1];
    
        else {
    
            Z = new BigMVariable(matrix[matrix.length - 1][matrix[0].length - 1].coefficient,
                matrix[matrix.length - 1][matrix[0].length - 1].nonCoefficient);
    
            Z.multiply(-1);
            htmlContent += "Our type of function was minimization, so we have to negate Z. <br><br>";
        }
    }

    else {

        if (document.getElementById("functionType").value === "Maximize")
            Z = matrix[matrix.length - 1][matrix[0].length - 1];

        else {
            Z = matrix[matrix.length - 1][matrix[0].length - 1].mul(-1);
            htmlContent += "Our type of function was minimization, so we have to negate Z. <br><br>";
        }
    
    }

    htmlContent += `<b>Therefore, the final solution is Z =  ${Z.toString()}, at
        (`;

    for (let i = 0; i < optimals.length; i++) {

        htmlContent += `x<sub>${i + 1}</sub>`
        if (i + 1 < optimals.length)
            htmlContent += ", ";
        }



    htmlContent += ") = (";
    for (let i = 0; i < optimals.length; i++) {

        htmlContent += `${optimals[i].toString()}`

        if (i + 1 < optimals.length)
            htmlContent += "; ";
    }

    htmlContent += "). </b><hr>";

    divSteps.innerHTML += htmlContent;


}

function explainSimplexUnbounded() {

    const divSteps = document.getElementById("steps");
    divSteps.innerHTML += `We still have negative elements in the bottom. However, if we try to compute a ratio
    (RHS / element), we see that all possible ratios are negative. Since we need a non-negative ratio, this means that the solution is unbounded. <hr>`
}
