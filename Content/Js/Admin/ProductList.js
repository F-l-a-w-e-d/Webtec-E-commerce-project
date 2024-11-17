$(function() {
    LoadProducts();

    $("#btnSearch").click(function() {
        $("#product-list-container").html("");
        LoadProducts($("#search").val(), $("#rarity").val(), $("#category").val());
    });

    $("#search").change(function() {
        $("#product-list-container").html("");
        LoadProducts($(this).val(), $("#rarity").val(), $("#category").val());
    });
   
    $("#createProduct").click(function() {
        window.location.href = "Create.html";
    });

    $("#rarity").change(function() {
        $("#product-list-container").html("");
        LoadProducts($("#search").val(), $("#rarity").val(), $("#category").val());
    })

    $("#category").change(function() {
        $("#product-list-container").html("");
        LoadProducts($("#search").val(), $("#rarity").val(), $("#category").val());
    })
});
        
function LoadProducts(search = "", rarity = "", category = "") {
    fetch("http://localhost:3000/products").then(response => response.json()).then(data => {
        let infoHtml = data.length == 0 ? "No products found." : "List of product(s)";
        $("#info").text(infoHtml);

        data.forEach(d => {
            if (d.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || d.description.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                if ((d.category !== category && category !== "")) {
                    return;
                }
                if ((d.rarity !== rarity && rarity !== "")) {
                    return;
                }

                let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";
                let id = "btn-" + d.id;
            $("#product-list-container").append(`
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${d["name"]}</h5>
                            <img src="${image}" alt="${d.name}">
                            <h6 class="card-text">${d["category"]}</h6>
                            <p class="card-text">${d["description"]}</p>
                            <ul class="list-unstyled">
                                <li>Original Price: $${d["price"]}</li>
                                <li>Discounted Price: ${d["discountedPrice"] == null ? "No discount" : "$" + d["discountedPrice"]}</li>
                                <li>Discount: ${d["discount"] * 100}%</li>
                                <li>Rarity: ${d["rarity"]}</li>
                                <li>Quantity: ${d["quantity"]}</li>
                                <li>Sold: ${d["sold"]}</li>
                            </ul>
                        </div>
                        <div class="card-footer text-right">
                            <button id="up-${id}" class="btn btn-sm btn-info">Update</button>
                            <button id="del-${id}" class="btn btn-sm btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            `);

            $("#up-" + id).click(function () {
                window.location.href = "Update.html?id=" + d.id;
            });

            $("#del-" + id).click(function () {
                if (confirm("Are you sure you want to delete this product?")) {
                    fetch("http://localhost:3000/products/" + d.id, {
                        method: "DELETE",
                    }).then(() => alert("Data deleted successfully."))
                    .catch(e => alert("Error: " + e));
                }
            });
         }
        });
    });
}