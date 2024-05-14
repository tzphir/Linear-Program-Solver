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
        // Convert the value to string for display

        // null M, just show non-coefficient
        if (this.#coefficient.compare(0) == 0) 
            return (this.#nonCoefficient).toString();

        // M == 1 or -1
        else if (this.#coefficient.compare(1) == 0 || this.#coefficient.compare(-1) == 0) {

            let display = '';
            display += this.#coefficient.compare(1) == 0? "<i>M</i>" : "-<i>M</i>";
            
            // Handle non-coefficients
            if (this.#nonCoefficient.compare(0) != 0) 
                display += (this.#nonCoefficient.compare(0) == -1 ? " - " + this.#nonCoefficient.mul(-1).toString() : " + " + (this.#nonCoefficient).toString());
            
            return display;
        }

        else if (this.#nonCoefficient < 0)
            return this.#coefficient.toString() + "<i>M</i> - " + (this.#nonCoefficient.mul(-1)).toString();

        else if (this.#nonCoefficient > 0)
            return (this.#coefficient).toString() + "<i>M</i> + " + (this.#nonCoefficient).toString();

        // non coefficient is empty
        return (this.#coefficient).toString() + "<i>M</i>";
    }
    

}


