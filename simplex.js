// Main function for the simplex/BigM algorithm
function calculate2() {

    // Get the selected number of variables and equations
    const numVariables = parseInt(document.getElementById("numVariables").value);
    const numEquations = parseInt(document.getElementById("numEquations").value);

    // Count for table ids
    let count = 0;

    // First, check the input
    if (!isValidInput(numVariables, numEquations)) {

        const r = document.getElementById("result");
        r.innerHTML = "Input is not valid! Make sure that all boxes are filled with numbers.";
        return;
    }

    // Check if we absolutely need to use BigM method
    // In this branch, we can use the standard simplex algorithm
    if (isEasy(numEquations)) {

        explainSimplexBeginning();
        let matrix = setMatrix(numVariables, numEquations);
        showSimplexTableau(matrix, numVariables, numEquations);
        let index_j = findSmallestElementBottomRow(matrix, numVariables, numEquations);

        // Now that we have our matrix, we can proceed with the algorithm
        while (isLessThanZero(matrix[matrix.length - 1][index_j])) {

            let index_i = findSmallestNonNegativeRatio(matrix, numEquations, index_j);

            // All pivot elements are negative, solution is unbounded
            if (index_i === -1) {

                explainSimplexEnd();
                showSimplexTableau(matrix, numVariables, numEquations);
                const r = document.getElementById("result");
                r.innerHTML = 
                `Result: <br> Z is unbounded! (&infin; in this case)`;

                explainSimplexUnbounded();
                return;
            }

            

            // Else proceed normally
            showIteration(matrix, numVariables, numEquations, index_i, index_j, ++count);
            performRowOperations(matrix, numEquations, index_i, index_j);
            index_j = findSmallestElementBottomRow(matrix, numVariables, numEquations);


        }


        // If we reach here, this means we have our optimal, bounded value
        explainSimplexEnd();
        showSimplexTableau(matrix, numVariables, numEquations);
        explainSimplexResult(matrix, numVariables, numEquations);
        outputEasyResult(matrix, numVariables, numEquations);

        
    }



    // In this branch, we resort to using the BigM method
    else {

        let id = 0;
    
        explainBigMBeginning(numVariables, numEquations);
        let matrix = setBigMMatrix(numVariables, numEquations);
        let columnsToRemove = findEmptyColumns(matrix, numVariables, numEquations);
        showBigMTableau(matrix, numVariables, numEquations, columnsToRemove, id++);
        let index_j = findSmallestElementBottomRowBigM(matrix);

        while (isLessThanZero(matrix[matrix.length - 1][index_j])) {

            let index_i = findSmallestNonNegativeRatio(matrix, numEquations, index_j);

            // All pivot elements are negative, solution is unbounded
            if (index_i === -1) {

                explainSimplexEnd();
                showBigMTableau(matrix, numVariables, numEquations, columnsToRemove, id++);
                const r = document.getElementById("result");
                r.innerHTML = 
                `Result: <br> Z is unbounded!`;
                if (document.getElementById("functionType").value == "Maximize")
                    r.innerHTML += ` (&infin; in this case)`;

                else 
                    r.innerHTML += ` (-&infin; in this case)`;

                explainSimplexUnbounded();
                return;

            }

            // Else proceed normally
            showBigMIteration(matrix, numVariables, numEquations, index_i, index_j, ++count, columnsToRemove, id++);
            performRowOperations(matrix, numEquations, index_i, index_j);
            index_j = findSmallestElementBottomRowBigM(matrix);
        }


        // Here, we have reached the final tableau
        // If we have an artifical variable in the basis columns, then no solution exists
        if (isInfeasible(matrix, numVariables, numEquations)) {

            explainSimplexEnd();
            showBigMTableau(matrix, numVariables, numEquations, columnsToRemove, id++);
            const r = document.getElementById("result");
                r.innerHTML = 
                `Result: <br> No solutions exist!`;

            explainInfeasible();
            return;
            
        }

        // We have reached a (finite) optimal solution!
        else {

            explainSimplexEnd();
            showBigMTableau(matrix, numVariables, numEquations, columnsToRemove, id++);
            explainSimplexResult(matrix, numVariables, numEquations);
            outputResult(matrix, numVariables, numEquations);
        }
    }

}