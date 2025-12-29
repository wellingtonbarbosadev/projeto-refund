
const form = document.querySelector("form");
const expenseName = document.querySelector("#expense")
const expenseCategory = document.querySelector("#category")
const expenseAmount = document.querySelector("#amount")
const header = document.querySelector("header")
const totalExpensesAmountElement = document.querySelector("header h2")
const numberOfExpenses = document.querySelector("header p span")
const ul = document.querySelector("ul")

// Função simples para converter string BRL para número
function parseBRL(value) {
    return Number(
        value.replace(/R\$|\s/g, "")
                 .replace(/\./g, "")
                 .replace(",", ".")
    )
}

function formatNumberInBRL(value) {
    // Se for string, faz o parsing, se for número, usa direto
    let number = value;
    if (typeof value === "string") {
        number = Number(
            value.replace(/R\$|\s/g, "")
                .replace(/\./g, "")
                .replace(",", ".")
        );
    }
    // Formata para BRL
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "").trim();
}

function formatNumberInString(value) {
    // Remove pontos apenas antes da vírgula (milhares), troca vírgula por ponto, remove R$ e espaços
    value = value.replace("R$", "").trim();
    // Se houver vírgula, remove pontos só antes dela
    if (value.includes(",")) {
        const [inteiro, decimal] = value.split(",");
        return inteiro.replace(/\./g, "") + "." + decimal;
    } else {
        // Se não houver vírgula, remove todos os pontos
        return value.replace(/\./g, "");
    }
}

function changeNumberOfExpenses() {
    const totalExpensesAmount = document.querySelectorAll(".expense-amount")
    numberOfExpenses.textContent = totalExpensesAmount.length
}

function addProductInList(expense) {
    const liElement = document.createElement("li")
    const imgElement = document.createElement("img")
    const imgDeleteElement = document.createElement("img")
    const divElement = document.createElement("div")
    const spanCategoryExpenseElement = document.createElement("span")
    const spanAmountExpenseElement = document.createElement("span")
    const strongElement = document.createElement("strong")
    const smallElement = document.createElement("small")
    let expenseNameBR

    let imgSrc = `./img/${expense.category}.svg`
    imgElement.setAttribute("src", imgSrc)
    imgElement.setAttribute("alt", "Ícone de tipo da despesa")


    strongElement.textContent = expense.name
    divElement.appendChild(strongElement)

    switch (expense.category) {
        case "food":
            expenseNameBR = "Alimentação"
            break;
        case "accommodation":
            expenseNameBR = "Hospedagem"
            break
        case "services":
            expenseNameBR = "Serviços"
            break
        case "transport":
            expenseNameBR = "Transporte"
            break
        default:
            expenseNameBR = "Outros"
            break;
    }

    spanCategoryExpenseElement.textContent = expenseNameBR
    divElement.appendChild(spanCategoryExpenseElement)
    divElement.classList.add("expense-info")
    
    valueFormattedBRL = formatNumberInBRL(expense.amount)
    smallElement.textContent = "R$"
    spanAmountExpenseElement.textContent = valueFormattedBRL
    spanAmountExpenseElement.classList.add("expense-amount")
    spanAmountExpenseElement.prepend(smallElement)

    imgDeleteElement.setAttribute("src", "./img/remove.svg")
    imgDeleteElement.setAttribute("alt", "remover")
    imgDeleteElement.classList.add("remove-icon")

    liElement.appendChild(imgElement)
    liElement.appendChild(divElement)
    liElement.appendChild(spanAmountExpenseElement)
    liElement.appendChild(imgDeleteElement)
    liElement.classList.add("expense")

    ul.appendChild(liElement)
    calculateTotalExpenses()
    changeNumberOfExpenses()
}

function calculateTotalExpenses() {
    const totalExpensesAmount = document.querySelectorAll(".expense-amount")
    let totalAmount = 0
    totalExpensesAmount.forEach(expenseAmount => {
        totalAmount += parseBRL(expenseAmount.innerText)
    });
    // Apenas exibe o total formatado, mantendo totalAmount como número
    // Remove o h2 anterior, se existir
    const oldH2 = header.querySelector("h2")
    if (oldH2) {
        oldH2.remove()
    }
    const h2Element = document.createElement("h2")
    const smallElement = document.createElement("small")
    smallElement.textContent = "R$"
    h2Element.textContent = formatNumberInBRL(totalAmount)
    h2Element.prepend(smallElement)
    header.append(h2Element)
}



form.onsubmit = (event) => {
    event.preventDefault();
    expense = {
        name: expenseName.value,
        category: expenseCategory.value,
        amount: parseBRL(expenseAmount.value),
    };
    console.log(expense);
    form.reset();
    addProductInList(expense);
};


// Permite digitar normalmente, só formata ao sair do campo
expenseAmount.addEventListener("input", (e) => {
    const input = e.target;
    let value = input.value.replace(/R\$|\s/g, "").trim();
    // Se o usuário está digitando centavos, não formata ainda
    if (value.match(/,\d{0,1}$/)) {
        // Permite digitar até dois dígitos após a vírgula
        return;
    }
    // Se o usuário digitou vírgula e dois dígitos, formata
    if (value.match(/,\d{2}$/)) {
        value = value.replace(/\./g, "").replace(",", ".");
        let number = parseFloat(value);
        if (!isNaN(number)) {
            input.value = number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "").trim();
        }
        return;
    }
    // Calculadora de caixa: só números viram centavos
    let digits = value.replace(/\D/g, "");
    if (!digits) {
        input.value = "";
        return;
    }
    let number = parseFloat(digits) / 100;
    input.value = "R$ " + number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "").trim();
});

// Ao sair do campo, sempre formata
expenseAmount.addEventListener("blur", (e) => {
    const input = e.target;
    let value = input.value.replace(/R\$|\s/g, "").trim();
    if (!value) return;
    value = value.replace(/\./g, "").replace(",", ".");
    let number = parseFloat(value);
    if (!isNaN(number)) {
        input.value =  "R$ " + number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "").trim();
    }
});

ul.addEventListener("click", (event) => {
    let item = event.target.closest("img")
    if (!item) return
    item = item.closest("li")
    item.remove()
    calculateTotalExpenses()
    changeNumberOfExpenses()
})

document.addEventListener("onload", calculateTotalExpenses(), changeNumberOfExpenses())