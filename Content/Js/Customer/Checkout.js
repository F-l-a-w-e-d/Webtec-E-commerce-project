$(function() {

    // updates the quantity and sold when the checkout is successful
    $("#frmcheckOut").submit(function(e) {
        e.preventDefault();

        const process = toRemoveQtyId.map(q => {
            return fetch('http://localhost:3000/products/' + q.productId)
                .then(response => response.json())
                .then(product => {
                    const updatedQuantity = product.quantity - q.quantity;
                    const updatedSold = product.sold + q.quantity;
        
                    return fetch('http://localhost:3000/products/' + q.productId, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            quantity: updatedQuantity, 
                            sold: updatedSold         
                        }),
                    });
                });
        });

        // Deletes the checkout and cart items selected
        itemsId.forEach(i => {
            fetch('http://localhost:3000/checkout/' + i, {
                method: 'DELETE',
            });

            fetch('http://localhost:3000/carts/' + i, {
                method: 'DELETE',
            });
        });
        
        // processes all first before proceeding to another line of code.
        Promise.all(process)
            .then(() => {
                window.location.href = "/Content/Pages/Customer/ProductList.html";
                alert("Successfully checked out!");
            })
            .catch(error => {
                alert("An error occurred while updating the products.");
            });
    });

    let itemsId = [];
    let toRemoveQtyId = [];

    // Display checkout items
    fetch('http://localhost:3000/checkout').then(r => r.json()).then(data => {
       let total = 0;
       let totalQty = 0;
       
        data.forEach(d => {
            total += d.total;
            totalQty += d.quantity;
            itemsId.push(d.id);
            toRemoveQtyId.push({ productId: d.productId, quantity: d.quantity });

            let priceHtml = `<span class="price-tag">$${d["discountedPrice"] || d["price"]}</span> `;
                priceHtml += d["discount"] != null ? `<span style="color:red; font-size:17px;"><del>$${d["price"]}</del></span>` : "";
        
            let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";

            $(".cart-container").append(`
                <div class="d-flex justify-content-center">
                            <div class="container my-3 card p-5">
                                <div class="row">
                                    <div class="col-md-6">
                                        <img id="image" src="${image}" class="rounded img-fluid">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <h2 class="display-4">${d.name}</h2>
                    
                                            <p>${priceHtml}</p>
                                            <p>x${d.quantity}</p>

                                            <p>Total: $${d.total.toFixed(2)}<p>
                                    </div>
                                </div>
                            </div>
                        </div>
            `);
            
        });

        $("#total").text("Total: $" + total.toFixed(2));
    });
});