function explainBigMBeginning(numVariables, numEquations) {

    const divSteps = document.getElementById("steps");

    // Keep track of slacks, artificials, and sign of RHS
    let slackAndArtificials = [];

    // Explain that we can't use the standard simplex algorithm
    let htmlContent = `<br>Since not all constraints are of type &le;, and/or some right hand side values are 
    non-negative, then we can't proceed with the standard simplex algorithm. We must modify the input first. <br> <hr>`;


    // Explain, for each equation, why we add slack/surplus/artificial variables
    for (let i = 0; i < numEquations; i++) {

        // RHS is negative
        if (parseFloat(document.getElementById(`b${i + 1}`).value) < 0) {

            htmlContent += `Since constraint #${i + 1} has a negative right hand side value, we must multiply this constraint by -1. <br> <br>
            <b>R${i+1} = -R${i+1}</b> <br> <br>`;

            switch(document.getElementById(`ineq${i + 1}`).value) {

                // <= becomes >=, add surplus and artificial variable
                case ("lessOrEqual") :
                    htmlContent += `Constraint #${i + 1} is of type &le;, so it becomes &ge;. We then need to add a surplus variable (-s<sub>${i + 1}</sub>)
                    and an artifical variable (a<sub>${i + 1}</sub>). <br> <hr>`;

                    slackAndArtificials.push(["-", -1, 1]);
                    break;

                // = stays =, add an artificial variable
                case ("equal") :
                    htmlContent += `Constraint #${i + 1} is of type &equals;, so it stays the same. We don't need to add any slack or surplus variables,
                    but we do need to add an artifical variable (a<sub>${i + 1}</sub>). <br> <hr>`;

                    slackAndArtificials.push(["-", 0, 1]);
                    break;

                // >= becomes <=, add a slack variable
                case ("greaterOrEqual") :
                    htmlContent += `Constraint #${i + 1} is of type &ge;, so it becomes &le;. We then need to add a slack variable (s<sub>${i + 1}</sub>),
                    but we do not need to add an artificial variable. <br> <hr>`;

                    slackAndArtificials.push(["-", 1, 0]);
                    break;
            }
        }

        // RHS is non-negative
        else {

            htmlContent += `Since constraint #${i + 1} has a non-negative right hand side value, we keep the constraint as is. <br> <br>`;

            switch(document.getElementById(`ineq${i + 1}`).value) {

                // <= : add a slack variable
                case ("lessOrEqual") :
                    htmlContent += `Constraint #${i + 1} is of type &le;, so we need to add a slack variable (s<sub>${i + 1}</sub>),
                    but we do not need to add an artificial variable. <br> <hr>`;

                    slackAndArtificials.push(["+", 1, 0]);
                    break;

                // = : add an artificial variable
                case ("equal") :
                    htmlContent += `Constraint #${i + 1} is of type &equals;, so we don't need to add any slack or surplus variables,
                    but we do need to add an artifical variable (a<sub>${i + 1}</sub>). <br> <hr>`;

                    slackAndArtificials.push(["+", 0, 1]);
                    break;

                // >= : add a surplus variable and an artificial variable
                case ("greaterOrEqual") :
                    htmlContent += `Constraint #${i + 1} is of type &ge;, so we need to add a surplus variable (-s<sub>${i + 1}</sub>)
                    and an artifical variable (a<sub>${i + 1}</sub>). <br> <hr>`;

                    slackAndArtificials.push(["+", -1, 1]);
                    break;
            }
        }

    }


    // Display the objective function
    htmlContent += `The objective function then becomes Z = `;

    // The first coefficients might be zero: handle the case
    // Otherwise, just print out the coefficients and the variable name

    let flag = false;
    for (let j = 0; j < numVariables; j++) {

        let coefficient = document.getElementById(`x${j + 1}O`).value;

        // Not the first coefficient
        if (flag) { 

            if (coefficient > 0) 
                htmlContent += `+ ${coefficient == 1 ? "" : coefficient}x<sub>${j + 1}</sub> `;
            
            else if (coefficient < 0)
                htmlContent += `- ${(coefficient == -1 ? "" : -1 * coefficient)}x<sub>${j + 1}</sub> `;

        }

        // Potential first coefficient
        else {

            if (coefficient > 0) {
                htmlContent += `${coefficient == 1 ? "" : coefficient}x<sub>${j + 1}</sub> `;
                flag = true;
            }
            
            else if (coefficient < 0) {
                htmlContent += `-${(coefficient == -1 ? "" : -1 * coefficient)}x<sub>${j + 1}</sub> `;
                flag = true;
            }

        }
        
    }




    // If there are any artificials variables needed to be introduced, put them
    for (let i = 0; i < slackAndArtificials.length; i++) {

        if (slackAndArtificials[i][2] == 1) 
            htmlContent += `- <i>M</i>a<sub>${i + 1}</sub> `;
        
    }



    // Explain that we must isolate artificial variables
    htmlContent += `<br> <br> In the initial tableau, all artificial variables' coefficients have to be 0 in the last row. Therefore, we must isolate all 
    artifical variables. <br> <br> <b>`;

    // For each equation where we have an artificial variable, isolate it. Don't forget that some values can be negated because of a negative RHS input
    for (let i = 0; i < numEquations; i++) {

        // If RHS was positive and we have an artificial variable
        if (slackAndArtificials[i][0] == "+" && slackAndArtificials[i][2] == 1) {

            htmlContent += positiveCase(numVariables, i);

            // Add surplus variable if need be
            if (slackAndArtificials[i][1] == -1)
                htmlContent += `- s<sub>${i + 1}</sub> `;

            // Equation implies that artificial variable equals...
            htmlContent += `+ a<sub>${i + 1}</sub> = ${document.getElementById(`b${i + 1}`).value} &rArr; <i>M</i>a<sub>${i + 1}</sub> = <i>M</i>(`;
            htmlContent += negativeCase(numVariables, i);

            // Again, add surplus variable if need be
            if (slackAndArtificials[i][1] == -1)
                htmlContent += `+ s<sub>${i + 1}</sub> `;

            // Add b value to the end
            htmlContent += `+ ${document.getElementById(`b${i + 1}`).value}) <br><br>`;

        }


        // If RHS was negative and we have an artificial variable
        else if (slackAndArtificials[i][0] == "-" && slackAndArtificials[i][2] == 1) {

            htmlContent += negativeCase(numVariables, i, slackAndArtificials);

            // Add surplus variable if need be
            if (slackAndArtificials[i][1] == -1)
                htmlContent += `- s<sub>${i + 1}</sub> `;

            // Equation implies that artificial variable equals...
            htmlContent += `+ a<sub>${i + 1}</sub> = ${-1 * parseFloat(document.getElementById(`b${i + 1}`).value)} &rArr; <i>M</i>a<sub>${i + 1}</sub> = <i>M</i>(`;
            htmlContent += positiveCase(numVariables, i, slackAndArtificials);

            // Again, add surplus variable if need be
            if (slackAndArtificials[i][1] == -1)
                htmlContent += `+ s<sub>${i + 1}</sub> `;

            // Add b value to the end
            htmlContent += `+ ${-1 * parseFloat(document.getElementById(`b${i + 1}`).value)}) <br><br>`;

        }

    }

    htmlContent += `</b>`;



    // Explain, given the type of function, what we do with the objective coefficients
    if (document.getElementById("functionType").value == "Maximize") { 
        htmlContent += `Since the function type is maximization, we put the negated coefficients of each variable in the objective function, 
        in the last row of the tableau. <br><br>`;
    }

    else {

        htmlContent += `Since the function type is minimization, we put the coefficients of each variable in the objective function, in the last row of the
        tableau, but we have to remember to multiply the objective value by -1 when we get to our final tableau. <br> <br>` 
    }

    htmlContent += `Regardless of the function type, we always have to remove <i>M</i>A in the objective function, 
        where A = {all artificial variables we introduced}.<br><br><b>Here is the initial tableau: </b><br>`;

    divSteps.innerHTML = htmlContent;

}


function showBigMTableau(matrix, numVariables, numEquations, columnsToRemove, id) {

    const divSteps = document.getElementById("steps");

    // Create table
    let htmlContent = `
    <br>
    <table id="table${id}">
        <thead>
            <tr>`;

    // Set vars coefficients header
    for (let j = 0; j < numVariables; j++) {
        htmlContent += `
            <th> x<sub>${j + 1}</sub> </th> `;
    }

    // Set slack variables header
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `
            <th> s<sub>${i + 1}</sub> </th> `;
    }

    // Set artificial variables header
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `
            <th> a<sub>${i + 1}</sub> </th> `;
    }

    // Close of head, start body of table
    htmlContent += `<th> Z </th> <th> RHS </th> 
    </tr> </thead> <tbody>`;

    // Push all non-objective coefficients into table
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `<tr> `;
        for (let j = 0; j < matrix[i].length; j++) {
            htmlContent += `
                <td> ${matrix[i][j].toFraction()} </td> `;
        }
        htmlContent += `</tr> `;
    }

    // Push objective coefficients into table
    htmlContent += `<tr> `
    for (let j = 0; j < matrix[0].length; j++) {

        htmlContent += `
            <td class="last_row"> ${matrix[matrix.length - 1][j].toString()} </td> `;
    }

    // Finish table
    htmlContent += ' </tr> </tbody> </table> <br> <hr>';

    // Assign the constructed HTML to divSteps.innerHTML
    divSteps.innerHTML += htmlContent;

    // Remove columns
    removeEmptyColumns(numEquations, id, columnsToRemove)

}


function showBigMIteration(matrix, numVariables, numEquations, index_i, index_j, count, columnsToRemove, id) {

    const divSteps = document.getElementById("steps");

    // Create table, with theta column
    let htmlContent = `
    <br>
    <table id="table${id}">
        <caption>
            <b> Iteration ${count} </b>
        </caption>
        <thead>
            <tr>`;

    // Set vars coefficients header
    for (let j = 0; j < numVariables; j++) {
        htmlContent += `
            <th> x<sub>${j + 1}</sub> </th> `;
    }

    // Set slack variables header
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `
            <th> s<sub>${i + 1}</sub> </th> `;
    }

    // Set artificial variables header
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `
            <th> a<sub>${i + 1}</sub> </th> `;
    }

    // Create columns for Z, RHS and theta
    htmlContent += `<th> Z </th> <th> RHS </th> <th style="width: 15%;"> &theta; </th> 
    </tr> </thead> <tbody>`;



    // Push all non-objective coefficients into table
    // Bold the pivot element
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `<tr> `;
        for (let j = 0; j < matrix[i].length; j++) {

            if (i === index_i && j === index_j) {

                htmlContent += `
                    <td> <b>${matrix[i][j].toFraction()}</b> </td> `; 

            }

            else {
                htmlContent += `
                    <td> ${matrix[i][j].toFraction()} </td> `; 
            }
        }

        // In the last column (theta column), put the ratios
        // Bold the ratio where i == index_i
        if (matrix[i][index_j].compare(0) == 1) {

            htmlContent += 
            
            (i === index_i ? 
                `<td style="width: 15%"> <b>${matrix[i][matrix[i].length - 1].toFraction()} &divide;
                ${matrix[i][index_j].toFraction()} = 
                ${matrix[i][matrix[i].length - 1].div(matrix[i][index_j]).toFraction()} </b> </td> </tr> ` 
                : 
                `<td style="width: 15%"> ${matrix[i][matrix[i].length - 1].toFraction()} &divide;
                ${matrix[i][index_j].toFraction()} = 
                ${matrix[i][matrix[i].length - 1].div(matrix[i][index_j]).toFraction()} </td> </tr> `);

        }

        // Don't display negative ratios
        else 
            htmlContent += `<td> - </td> </tr>`;
        
    }

    // Display objective row, bold the element at j = index_j
    htmlContent += `<tr> `
    for (let j = 0; j < matrix[0].length; j++) {

        if (j === index_j) {

            htmlContent += `
                <td class="last_row"> <b>${(matrix[matrix.length - 1][j]).toString()}</b> </td> `;


        }

        else {

        htmlContent += `
                <td class="last_row"> ${(matrix[matrix.length - 1][j]).toString()} </td> `;

        }
    }

    // Finish the table
    htmlContent += ' <td class="last_row"> - </td> </tr> </tbody> </table> <br>';

    // Assign the constructed HTML to divSteps.innerHTML
    divSteps.innerHTML += htmlContent;

    // Remove elements
    removeEmptyColumns(numEquations, id, columnsToRemove);

    // Assign real columns
    let realColumn = index_j;

    for (let j = 0; j < columnsToRemove; j++) {

        if (index_j > columnsToRemove[j])
            realColumn--;
    }

    // Explain the choices of entering and leaving variables
    divSteps.innerHTML += `The most negative element in the bottom row is ${matrix[matrix.length - 1][index_j].toString()}, at column #${realColumn + 1}.
    The smallest non-negative ratio is ${matrix[index_i][matrix[0].length - 1].div(matrix[index_i][index_j])}. Hence, the pivot is
    ${matrix[index_i][index_j].toFraction()}, at row #${index_i + 1} and column #${realColumn + 1}. <br> <br>`;


}

// When we have an artificial variable still present in tableau, solution is infeasible
function explainInfeasible() {

    const divSteps = document.getElementById("steps");
    divSteps.innerHTML += `<b>Since we still have an artifical variable in the tableau, this means that there does not exist a solution!</b><br><hr>`;

}


//----------------------------------Helper functions------------------------------------------//


// Present values, do not negate them
function positiveCase(numVariables, i) {

    let string = '';
    let flag = false; // for null coefficients

    for (let j = 0; j < numVariables; j++) {

        let coefficient = document.getElementById(`x${j + 1}${i + 1}`).value;

        // Previous coefficient exists, proceed normally
        if (flag) {

            if (coefficient > 0) 
                string += `+ ${coefficient == 1 ? "" : coefficient}x<sub>${j + 1}</sub> `;
            
            else if (coefficient < 0) 
                string += `- ${(coefficient == -1 ? "" : -1 * coefficient)}x<sub>${j + 1}</sub> ` ;

        }

        else if (coefficient > 0) {

            string += `${coefficient == 1 ? "" : coefficient}x<sub>${j + 1}</sub> `;
            flag = true;

        }
                
        
        else if (coefficient < 0) {

            string += `-${coefficient == -1 ? "" : -1 * coefficient}x<sub>${j + 1}</sub> `;
            flag = true;

        }
    }
    


    return string;

}


// Present values, negate them
function negativeCase(numVariables, i) {

    let string = '';
    let flag = false; // for null coefficients

    for (let j = 0; j < numVariables; j++) {

        let coefficient = document.getElementById(`x${j + 1}${i + 1}`).value;

        // Previous coefficient exists, proceed normally
        if (flag) {

            if (coefficient > 0) 
                string += `- ${coefficient == 1 ? "" : coefficient}x<sub>${j + 1}</sub> `;
            
            else if (coefficient < 0) 
                string += `+ ${(coefficient == -1 ? "" : -1 * coefficient)}x<sub>${j + 1}</sub> ` ;

        }

        else if (coefficient > 0) {

            string += `-${coefficient == 1 ? "" : coefficient}x<sub>${j + 1}</sub> `;
            flag = true;

        }
                
        
        else if (coefficient < 0) {

            string += `${coefficient == -1 ? "" : -1 * coefficient}x<sub>${j + 1}</sub> `;
            flag = true;

        }
    }
    


    return string;

}


// Removes any columns that are all 0's
function findEmptyColumns(matrix, numVariables, numEquations) {

    let emptyColumns = [];
    
    for (let j = numVariables; j < matrix[0].length - 2; j++) {

        let flag = true;

        for (let i = 0; i < numEquations; i++) {

            if (matrix[i][j].compare(0) != 0) {

                flag = false;
                break;
            }

        }

        if (flag)
            emptyColumns.push(j);
    }
    
    return emptyColumns;
    
}


// Returns columns where all elements are zero
function removeEmptyColumns(numEquations, id, emptyColumns) {

    let table = document.getElementById(`table${id}`);
    let rows = table.rows;
    let num = 0;

    for (let j = 0; j < emptyColumns.length; j++) {

        for (let i = 0; i < numEquations + 2; i++)
            rows[i].deleteCell(emptyColumns[j] - num);
        

        num++;
    }
}