$(function() {
    // Loads product in carts and gets additional info from product in json-server
    fetch('http://localhost:3000/carts').then(r => r.json()).then(data => {
        data.forEach(c => {
            fetch('http://localhost:3000/products').then(r => r.json()).then(prod => {
                prod.forEach(d => {
                    if (c.productId == d.id) {
                    let priceHtml = `<span class="price-tag">$${d["discountedPrice"] || d["price"]}</span> `;
                    priceHtml += d["discount"] != null ? `<span style="color:red; font-size:17px;"><del>$${d["price"]}</del></span>` : "";
        
                    let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";
        
                    // adds to the page
                    $('.main-container').append(`
                        <div class="d-flex justify-content-center">
                         <input type="hidden" value="${d.quantity}" id="maxQty-${c.id}">
                         <input type="hidden" value="${c.id}" id="id-${c.id}">
                            <div class="container my-3 card p-5">
                                <div class="row">
                                    <div class="col-md-6">
                                        <img id="image-${c.id}" src="${image}" class="rounded img-fluid">
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="text-end">
                                        <button class="btn btn-danger" id="del-${c.id}">X</button>
                                        </div>

                                        <h2 class="display-4">${d.name}</h2>
                    
                                        <div id="quantitySection">
                                            <p>${priceHtml}</p>
                                            <p class="text-muted">Quantity:</p>
                                            <div class="quantity-section input-group">
                                                <button class="btn btn-secondary" id="subQty-${c.id}">-</button>
                                                <input class="form-control text-center" value="${c.quantity}" type="text" id="prodQty-${c.id}">
                                                <button class="btn btn-secondary" id="addQty-${c.id}">+</button>
                                            </div>
                                        </div>
                                        
                                        <div class="form-check mt-3">
                                            <input class="form-check-input big-checkbox" id="chk-${c.id}" type="checkbox" style="width: 24px; height: 24px; border:1px solid black;">
                                            <label class="form-check-label h6 p-1" for="bigCheckbox">Check Out</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);

                    // delete from cart
                    $("#del-" + c.id).click(function() {
                        if (confirm("Are you sure you want to delete this item?")) {
                            fetch("http://localhost:3000/carts/" + c.id, {
                                method: "DELETE",
                            }).then(() => alert("Data deleted successfully."))
                            .catch(e => alert("Error: " + e));
                        }
                    });

                    // check item for checkout
                    $("#chk-" + c.id).change(function() {
                        if ($(this).prop('checked')) {
                            let checkOut = {
                                id: c.id,
                                productId: c.productId,
                                name: d.name,
                                quantity: parseInt($("#prodQty-"+ c.id).val()),
                                image: $("#image-" + c.id).attr('src'),
                                price: d.price,
                                discountedPrice: d.discountedPrice,
                                discount: d.discount,
                                total: d.discountedPrice * parseInt($("#prodQty-"+ c.id).val())
                            }

                            checkoutItems.push(checkOut);
                        }
                        else {
                            checkoutItems = checkoutItems.filter(chk => chk.id !== c.id);
                        }

                        // checks if the all carts is checked.
                        if (!selectedAllChk) {
                            let allChecked = true;
                            $("input[type='checkbox']").not("#chkSelectAll").each(function(i, check) {
                                if (!$(check).prop('checked')) {
                                    allChecked = false;
                                }
                            });
                            $("#chkSelectAll").prop('checked', allChecked);
                            }

                        updateCheckout(c.id, d.discountedPrice);
                    });

                    // Quantity restriction checking
                    $("#prodQty-" + c.id).on('input', function () { 
                        if ($(this).val() == 0) {
                            $(this).val(1);
                            updateCheckout(c.id, d.discountedPrice);
                            return;
                        }
                        $(this).val($(this).val().replace(/[^0-9]/g, ''));
                       
                        if ($(this).val() == "") {
                            $(this).val(1);
                        }
                        updateCheckout(c.id, d.discountedPrice);
                    });
                
                    // Quantity restriction checking
                    $("#prodQty-" + c.id).change(function() {
                        if ($(this).val() > $("#maxQty-" + c.id).val()) {
                            $(this).trigger('input');
                        }
                    });
                
                    // Quantity restriction checking
                    $("#subQty-" + c.id).click(function() {
                        if ($("#prodQty-" + c.id).val() != 1) {
                            $("#prodQty-" + c.id).val($("#prodQty-" + c.id).val() - 1);
                            updateCheckout(c.id, d.discountedPrice);
                        }
                    });
                
                    // Quantity restriction checking
                    $("#addQty-" + c.id).click(function() {
                        if ($("#prodQty-" + c.id).val() < $("#maxQty-" + c.id).val()) {
                            $("#prodQty-" + c.id).val(parseInt($("#prodQty-" + c.id).val()) + 1);
                            updateCheckout(c.id, d.discountedPrice);
                        }
                    });

                    }
                });
            });
        });
    });

    // proceeding to checkout
    $("#btncheckOut").click(function() {
        if (checkoutItems.length == 0) {
            alert('Please select an item to check out.');
            return;
        }

        // Deletes existing data from checkout in case user cancels the checkout
        fetch('http://localhost:3000/checkout').then(r => r.json()).then(data => {
            data.forEach(d => {
                fetch('http://localhost:3000/checkout/' + d.id, {
                    method: 'DELETE',
                });
            });
        }).then(s => {
            // adds to checkout from json-server
            checkoutItems.forEach(item => {
                fetch('http://localhost:3000/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item), // Send each object individually
                }).then(response => {
                    if (!response.ok) {
                        console.error(`Failed to add item: ${item.id}`);
                    }
                });
            });
            window.location.href = "/Content/Pages/Customer/Checkout.html";
        });
    });

    // selects all cart items
    $("#chkSelectAll").change(function() {
        $("input[type='checkbox']").not("#chkSelectAll").each(function(i, check) {
            selectedAllChk = true;
            if ($("#chkSelectAll").prop('checked')) {
                if (!$(check).prop('checked')) {
                    $(check).prop('checked', true);
                    $(check).trigger('change');
                }
            } else {
                $(check).prop('checked', false);
                $(check).trigger('change');
            }
         });

         selectedAllChk = false;
    });
});

// updates the checkout for updated quantities or checked items
function updateCheckout(id, discountedPrice) {
    checkoutItems.forEach(i => {
        if (id == i.id) {
            i.quantity = parseInt($("#prodQty-"+ id).val());
            i.total = discountedPrice != null ? discountedPrice * parseInt($("#prodQty-"+ id).val()) : i.price * parseInt($("#prodQty-"+ id).val());
          return;
        }
    });

    let total = 0;
    checkoutItems.forEach(t => total += t.total);

    $("#total").text('Total: $' + total.toFixed(2));
}

let checkoutItems = [];
let selectedAllChk = false;