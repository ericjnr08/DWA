const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const entries = new FormData(event.target);
    const { dividend, divider } = Object.fromEntries(entries);

/**
 * the interges that are present must have a value present, if not
 * the code will not work and error will be thrown. There are rules in place
 * that prevent you from dividing with a negative number as well as enter any 
 * random information in the input fields.
 * */
    if (dividend === "" || divider === "") {
        result.innerText = "Division not performed. Both values are required in inputs. Try again.";
        throw new Error ("Division not performed. Both values are required in inputs. Try again.");
    }
    if (divider <= 0) {
        result.innerText = "Division not performed. Invalid number provided. Try again.";
        throw new Error ("Division not performed. Invalid number provided. Try again.")
    }
    if (isNaN(dividend) || isNaN(divider)) {
        throw new Error ("Something critical went wrong. Please reload the page").stack;
    }
    result.innerText = Math.floor(dividend / divider)
  }
  catch (error){
    console.error(error);
    if (error instanceof Error) {
        result.innerText = error;
} else {
    document.body.innerHTML = /* html */ `
    Something critical went wrong. Please reload the page`;
} 
  }
})