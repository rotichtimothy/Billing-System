document.addEventListener("DOMContentLoaded", function() {
    const addProductButton = document.getElementById("addProduct");
    const saveInvoiceButton = document.getElementById("saveInvoice");
    const loadInvoiceButton = document.getElementById("loadInvoice");
    const invoiceTableBody = document.querySelector("#invoiceTable tbody");
    const totalAmountSpan = document.getElementById("totalAmount");
    let totalAmount = 0;

    addProductButton.addEventListener("click", function() {
        const productName = document.getElementById("productName").value.trim();
        const quantity = parseInt(document.getElementById("quantity").value);
        const price = parseFloat(document.getElementById("price").value);
        const discount = parseFloat(document.getElementById("discount").value) || 0;
        const tax = parseFloat(document.getElementById("tax").value) || 0;

        if (productName === "" || isNaN(quantity) || isNaN(price)) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const total = calculateTotal(quantity, price, discount, tax);
        totalAmount += total;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${productName}</td>
            <td>${quantity}</td>
            <td>$${price.toFixed(2)}</td>
            <td>${discount}%</td>
            <td>${tax}%</td>
            <td>$${total.toFixed(2)}</td>
        `;

        invoiceTableBody.appendChild(row);

        totalAmountSpan.textContent = totalAmount.toFixed(2);

        // Clear input fields
        document.getElementById("productName").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
        document.getElementById("discount").value = "0";
        document.getElementById("tax").value = "0";

        // Focus on the product name field for quick entry
        document.getElementById("productName").focus();
    });

    saveInvoiceButton.addEventListener("click", function() {
        const invoiceData = {
            totalAmount: totalAmount,
            products: [],
        };

        const rows = invoiceTableBody.querySelectorAll("tr");
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const product = {
                productName: cells[0].textContent,
                quantity: parseInt(cells[1].textContent),
                price: parseFloat(cells[2].textContent.replace('$', '')),
                discount: parseFloat(cells[3].textContent.replace('%', '')),
                tax: parseFloat(cells[4].textContent.replace('%', '')),
                total: parseFloat(cells[5].textContent.replace('$', '')),
            };
            invoiceData.products.push(product);
        });

        localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
        alert("Invoice saved!");
    });

    loadInvoiceButton.addEventListener("click", function() {
        const savedData = localStorage.getItem('invoiceData');
        if (savedData) {
            const invoiceData = JSON.parse(savedData);
            invoiceTableBody.innerHTML = ''; // Clear existing rows
            invoiceData.products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.productName}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.discount}%</td>
                    <td>${product.tax}%</td>
                    <td>$${product.total.toFixed(2)}</td>
                `;
                invoiceTableBody.appendChild(row);
            });

            totalAmount = invoiceData.totalAmount;
            totalAmountSpan.textContent = totalAmount.toFixed(2);
        } else {
            alert("No saved invoice found.");
        }
    });

    function calculateTotal(quantity, price, discount, tax) {
        const discountAmount = (discount / 100) * (quantity * price);
        const taxAmount = (tax / 100) * (quantity * price - discountAmount);
        return (quantity * price) - discountAmount + taxAmount;
    }
});
