function setBigMMatrix(numVariables, numEquations) {

    // First, set the basic variables in the matrix
    // We have to ensure that right hand side values are always >= 0

    let matrix = [];
    let bValues = [];
    let ineqs = [];

    for (let i = 0; i < numEquations; i++) {

        matrix.push([]);
        let exponent; // 0 will represent >= 0, while 1 will represent < 0
        let inequality = document.getElementById(`ineq${i + 1}`).value;

        if (document.getElementById(`b${i + 1}`).value < 0) {

            // Change inequality sign (unless it's an equality)
            if (inequality === "greaterOrEqual") 
                ineqs.push("lessOrEqual");

            else if (inequality === "lessOrEqual")
                ineqs.push("greaterOrEqual");

            else 
                ineqs.push("equal");


            // Multiply the b value by -1 to ensure non-negativity
            exponent = 1;
            bValues.push(new Fraction(document.getElementById(`b${i + 1}`).value).mul(-1));
        }

        else {

            ineqs.push(inequality);
            exponent = 0;
            bValues.push(new Fraction(document.getElementById(`b${i + 1}`).value));
        }


        for (let j = 0; j < numVariables; j++) 
            matrix[i].push(new Fraction(document.getElementById(`x${j + 1}${i + 1}`).value).mul(Math.pow(1, exponent)));
        

    }


    /* 
    We add a slack variable for every inequality,
    and add a column for every equation

    If <=, then slack is positive
    If >=, then slack is negative and we add an artifical variable ak
    If =, then slack is null (0), add an artificial variable ak
    */

    for (let i = 0; i < numEquations; i++) {

        const inequality = ineqs[i];

        for (let j = 0; j < numEquations; j++) {

            if (i === j) {

                if (inequality === "lessOrEqual") 
                    matrix[i].push(new Fraction(1));
                
                else if (inequality === "greaterOrEqual")
                    matrix[i].push(new Fraction(-1));

                else
                    matrix[i].push(new Fraction(0));

                    
            }

            else 
                matrix[i].push(new Fraction(0));
            


        }


        // Add artificial variables to the matrix, at the end
        for (let j = 0; j < numEquations; j++) {

            if (i === j) {

                if (inequality === "lessOrEqual")
                    matrix[i].push(new Fraction(0));

                else 
                    matrix[i].push(new Fraction(1));
            }

            else
                matrix[i].push(new Fraction(0));
        }

    }

    
    
    // Push 0 entries (for Z column) and b values in the matrix
    for (let i = 0; i < numEquations; i++) {
        matrix[i].push(new Fraction(0));
        matrix[i].push(bValues[i]);
    }

    



    // Set z-values at the end
    matrix.push([]);
    
    // If the function is maximize, then put the negated values. Otherwise put the original values
    if (document.getElementById("functionType").value == "Maximize") {

        for (let j = 0; j < numVariables; j++) 
            matrix[matrix.length - 1].push(new BigMVariable(0, 
            document.getElementById(`x${j + 1}O`).value * -1));
        
        
    }

    else {

        for (let j = 0; j < numVariables; j++) 
            matrix[matrix.length - 1].push(new BigMVariable(0, 
            document.getElementById(`x${j + 1}O`).value));
        

    }


    // Fill the rest with Big M variables
    for (let j = 0; j < 2 * numEquations; j++)
        matrix[matrix.length - 1].push(new BigMVariable(0, 0));

    // Push 1 for Z value, then push 0 again to set objective value
    matrix[matrix.length - 1].push(new BigMVariable(0, 1));
    matrix[matrix.length - 1].push(new BigMVariable(0, 0));


    // Then, if there is an artifical variable somewhere we need to remove it in the matrix 
    // To ensure that no artifical variables are included in the final solution
    let i = 0;
    while (i < numEquations) {

        if (matrix[i][numVariables + numEquations + i].compare(1) == 0) {

            for (let k = 0; k < numVariables + numEquations; k++) 
                matrix[matrix.length - 1][k].subtract(new BigMVariable(matrix[i][k], 0));

            matrix[matrix.length - 1][matrix[i].length - 1].subtract(new BigMVariable(matrix[i][matrix[i].length - 1], 0));


        }

        i++;


    }

    return matrix;


}


// Finds the smallest big M instance in the bottom row of a matrix
// Per Bland's rule, given a tie, the element with the smallest index should be returned
function findSmallestElementBottomRowBigM(matrix) {

    let min = new BigMVariable(Number.MAX_VALUE, Number.MAX_VALUE);
    let index_j = -1;
    for (let j = 0; j < matrix[0].length - 1; j++) {

        if ((matrix[matrix.length - 1][j]).coefficient.compare(min.coefficient) == -1
        || (matrix[matrix.length - 1][j].coefficient.compare(min.coefficient) == 0
        && matrix[matrix.length - 1][j].nonCoefficient.compare(min.nonCoefficient) == -1)) {

            min = matrix[matrix.length - 1][j];
            index_j = j;
        }

    }

    return index_j;
}



function isInfeasible(matrix, numVariables, numEquations) {

    for (let j = numVariables + numEquations; j < matrix[0].length - 1; j++) {

        let count = 0;

        for (let i = 0; i < numEquations; i++) {

            // Good here
            if (matrix[i][j].compare(0) != 0 && matrix[i][j].compare(1) != 0)
                break;

            else if (matrix[i][j].compare(1) == 0) {
                count++;

                // Also good here
                if (count > 1)
                    break;

            }

            if (i == numEquations - 1 && count == 1)
                return true;
        }
    }

    return false;


}


function outputResult(matrix, numVariables, numEquations) {

    let Z;

    if (document.getElementById("functionType").value === "Maximize")
        Z = matrix[matrix.length - 1][matrix[0].length - 1];

    else {

        Z = new BigMVariable(matrix[matrix.length - 1][matrix[0].length - 1].coefficient,
            matrix[matrix.length - 1][matrix[0].length - 1].nonCoefficient);

            Z.multiply(-1);
    }

    displayCoords(matrix, Z, numVariables, numEquations);


}