function explainSimplexBeginning() {

    const divSteps = document.getElementById("steps");

    // Explain that we can proceed with the standard simplex tableau.
    let htmlContent = `<br>Since all constraints are of type &le;, and all right hand side values are non-negative, 
    we can proceed with the standard simplex algorithm. <br> <br> `;

    if (document.getElementById("functionType").value == "Maximize") { 
        htmlContent += `Since the function type is maximization, we put the negated coefficients of each variable in the objective function, 
        in the last row of the tableau. <br><br>`;
    }

    else {
        htmlContent += `Since the function type is minimization, we put the coefficients of each variable in the objective function, in the last row of the
        tableau, but we have to remember to multiply the objective value by -1 when we get to our final tableau. <br> <br> `;
    }

    htmlContent += "Here is the initial tableau:<br>";

    divSteps.innerHTML = htmlContent;
}

function showSimplexTableau(matrix, numVariables, numEquations) {

    const divSteps = document.getElementById("steps");

    // Create table
    let htmlContent = `
    <br>
    <table>
        <thead>
            <tr>`;

    for (let j = 0; j < numVariables; j++) {
        htmlContent += `
            <th> x<sub>${j + 1}</sub> </th> `;
    }

    for (let i = 0; i < numEquations; i++) {
        htmlContent += `
            <th> s<sub>${i + 1}</sub> </th> `;
    }

    htmlContent += `<th> Z </th> <th> RHS </th> 
    </tr> </thead> <tbody>`;

    // Put all non-objective coefficients in table
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `<tr> `;
        for (let j = 0; j < numVariables + numEquations + 2; j++) {
            htmlContent += `
                <td> ${matrix[i][j].toString()} </td> `;
        }
        htmlContent += `</tr> `;
    }

    htmlContent += `<tr> `
    // Put all objective coefficients in table
    for (let j = 0; j < numVariables + numEquations + 2; j++) {

        htmlContent += `
            <td class="last_row"> ${matrix[matrix.length - 1][j].toString()} </td> `;
    }

    htmlContent += ' </tr> </tbody> </table> <br> <hr>';

    // Assign the constructed HTML to divSteps.innerHTML
    divSteps.innerHTML += htmlContent;
}

function showIteration(matrix, numVariables, numEquations, index_i, index_j, count) {

    const divSteps = document.getElementById("steps");

    // Create tableau, with theta column
    let htmlContent = `
    <br>
    <table>
        <caption>
            <b> Iteration ${count} </b>
        </caption>
        <thead>
            <tr>`;

    for (let j = 0; j < numVariables; j++) {
        htmlContent += `
            <th> x<sub>${j + 1}</sub> </th> `;
    }

    for (let i = 0; i < numEquations; i++) {
        htmlContent += `
            <th> s<sub>${i + 1}</sub> </th> `;
    }

    htmlContent += `<th> Z </th> <th> RHS </th> <th> &theta; </th> 
    </tr> </thead> <tbody>`;


    // Push all non-objective coefficients in tableau
    // Bold the pivot
    for (let i = 0; i < numEquations; i++) {
        htmlContent += `<tr> `;
        for (let j = 0; j < numVariables + numEquations + 2; j++) {

            if (i === index_i && j === index_j) {

                htmlContent += `
                    <td> <b>${matrix[i][j].toString()}</b> </td> `; 

            }

            else {
                htmlContent += `
                    <td> ${matrix[i][j].toString()} </td> `; 
            }
        }

        // Theta column
        // Bold the smallest non-negative ratio
        if (matrix[i][index_j].compare(0) == 1) {

            htmlContent += 
            
            (i === index_i ? 
                
                `<td> <b><sup>${matrix[i][numVariables + numEquations + 1].toString()}</sup>/<sub>${matrix[i][index_j].toString()}</sub> = 
                ${matrix[i][numVariables + numEquations + 1].div(matrix[i][index_j]).toString()} </b> </td> </tr> ` 
                : 
                `<td> <sup>${matrix[i][numVariables + numEquations + 1]}</sup>/<sub>${matrix[i][index_j]}</sub> = 
                ${matrix[i][numVariables + numEquations + 1].div(matrix[i][index_j]).toString()} </td> </tr> `);

        }

        // Don't display negative ratios
        else 
            htmlContent += `<td> - </td> </tr>`;
        
    }

    // Display objective row, bold element at j = index_j
    htmlContent += `<tr> `
    for (let j = 0; j < numVariables + numEquations + 2; j++) {

        if (j === index_j) {

            htmlContent += `
                <td class="last_row"> <b>${matrix[matrix.length - 1][j].toString()}</b> </td> `;


        }

        else {

        htmlContent += `
                <td class="last_row"> ${matrix[matrix.length - 1][j].toString()} </td> `;

        }
    }

    htmlContent += ' <td class="last_row"> - </td> </tr> </tbody> </table> <br>';

    // Explain choices of entering and leaving variables
    htmlContent += `The most negative element in the bottom row is ${matrix[matrix.length - 1][index_j].toString()}, at column #${index_j + 1}.
    The smallest non-negative ratio is ${matrix[index_i][numVariables + numEquations + 1].div(matrix[index_i][index_j]).toString()}. Hence, the pivot is
    ${matrix[index_i][index_j].toString()}, at row #${index_i + 1} and column #${index_j + 1}. <br> <br>`;


    // Assign the constructed HTML to divSteps.innerHTML
    divSteps.innerHTML += htmlContent;

}