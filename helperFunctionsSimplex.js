function setMatrix(numVariables, numEquations) {

    // First, push the value of the variables for each equation
    let matrix = [];
    
    for (let i = 0; i < numEquations; i++) {

        matrix.push([]);

        for (let j = 0; j < numVariables; j++) 
            matrix[i].push(new Fraction(document.getElementById(`x${j + 1}${i + 1}`).value));

        
    }



    // Then, push, as the last row, the values of the objective function
    // If the type is maximize, negate them, otherwise keep them as is

    // Create new row 
    matrix.push([]);
    
    // Set the values
    if (document.getElementById("functionType").value == "Maximize") {
        for (let j = 0; j < numVariables; j++) 
            matrix[matrix.length - 1].push(new Fraction(document.getElementById(`x${j + 1}O`).value).mul(-1));
        
    }

    else {

        for (let j = 0; j < numVariables; j++) 
            matrix[matrix.length - 1].push(new Fraction(document.getElementById(`x${j + 1}O`).value));
        

    }



    // Then, push the corresponding slack variables and z values
    // Again, the number of slack variables is the number of equations
    // We have to repeat the process (num of equations) time

    for (let i = 0; i < numEquations + 1; i++) {

        for (let j = 0; j < numEquations + 1; j++) 
            matrix[i].push((i === j) ? new Fraction(1) : new Fraction(0));
        
    }



    // Finally, add the b values at the end of each column/equation
    for (let i = 0; i < numEquations; i++) 
        matrix[i].push(new Fraction(document.getElementById(`b${i + 1}`).value));
    

    // Push 0 as the last element of the matrix
    // This will represent the Z value
    matrix[matrix.length - 1].push(new Fraction(0));

    return matrix;


}

function findSmallestElementBottomRow(matrix, numVariables, numEquations) {

    // Find smallest element in the bottom row, keep track of the index
    let min = new Fraction(Number.MAX_VALUE); 
    let index_j = -1;
    for (let j = 0; j < numVariables + numEquations; j++) {

        if (matrix[matrix.length - 1][j].compare(min) == -1) {
            min = matrix[matrix.length - 1][j];
            index_j = j;
        }
    }

    return index_j;


}

function outputEasyResult(matrix, numVariables, numEquations) {

    // Depending on function type, we negate the value
    let Z = document.getElementById("functionType").value === "Maximize" ? 
    matrix[numEquations][numEquations + numVariables + 1].toFraction() : 
    matrix[numEquations][numEquations + numVariables + 1].mul(-1).toFraction();
    
    displayCoords(matrix, Z, numVariables, numEquations);
}