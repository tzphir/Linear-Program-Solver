class BigMVariable {

    #coefficient;
    #nonCoefficient;

    constructor(coefficient, nonCoefficient) {
        
        this.#coefficient = new Fraction(coefficient);
        this.#nonCoefficient = new Fraction(nonCoefficient);
    }

    get coefficient() {
        return this.#coefficient;
    }

    get nonCoefficient() {
        return this.#nonCoefficient;
    }

    add(other) {
        // Addition operation
        if (other instanceof BigMVariable) {

            this.#coefficient = this.#coefficient.add(other.#coefficient);
            this.#nonCoefficient = this.#nonCoefficient.add(other.#nonCoefficient); 
        }

        else 
            this.#nonCoefficient = this.#nonCoefficient.add(other);
        
    }

    subtract(other) {
        // Subtraction operation
        if (other instanceof BigMVariable) {

            this.#coefficient = this.#coefficient.sub(other.#coefficient);
            this.#nonCoefficient = this.#nonCoefficient.sub(other.#nonCoefficient); 
        }

        else 
            this.#nonCoefficient = this.#nonCoefficient.sub(other);
    }

    multiply(factor) {
        // Multiplication operation
        
        this.#coefficient = this.#coefficient.mul(factor);
        this.#nonCoefficient = this.#nonCoefficient.mul(factor);
        
    }

    divide(factor) {
        // Division operation

        if (factor.compare(0) == 0) 
            throw new Error("Can't divide by 0");

        this.#coefficient = this.#coefficient.div(factor);
        this.#nonCoefficient = this.#nonCoefficient.div(factor);


    }

    toString() {
        // Convert coefficient and non-coefficient to strings
        const coefficientStr = this.#coefficient.toFraction();
        const nonCoefficientStr = this.#nonCoefficient.toFraction();
        
        // Initialize display string
        let display = '';
    
        // Case: coefficient is zero
        if (this.#coefficient.compare(0) == 0) {
            return nonCoefficientStr;
        }
    
        // Case: coefficient is 1 or -1
        if (this.#coefficient.compare(1) == 0 || this.#coefficient.compare(-1) == 0) {
            display += this.#coefficient.compare(1) == 0 ? "<i>M</i>" : "-<i>M</i>";
            
            if (this.#nonCoefficient.compare(0) != 0) {
                display += this.#nonCoefficient.compare(0) == -1 ? 
                           " - " + this.#nonCoefficient.mul(-1).toFraction() : 
                           " + " + nonCoefficientStr;
            }
            
            return display;
        }
    
        // Handle non-coefficient sign and format the coefficient if it contains a fraction
        const formattedCoefficient = coefficientStr.includes('/') ? `(${coefficientStr})` : coefficientStr;
    
        if (this.#nonCoefficient.compare(0) < 0) {
            display = `${formattedCoefficient}<i>M</i> - ${this.#nonCoefficient.mul(-1).toFraction()}`;
        } else if (this.#nonCoefficient.compare(0) > 0) {
            display = `${formattedCoefficient}<i>M</i> + ${nonCoefficientStr}`;
        } else {
            display = `${formattedCoefficient}<i>M</i>`;
        }
    
        return display;
    }
    
    

}


