$(function () {
    LoadProducts();

    $("#btnSearch").click(function() {
        $("#product-list-container").html("");
        LoadProducts($("#search").val(), $("#rarity").val(), $("#category").val());
    });

    $("#search").change(function() {
        $("#product-list-container").html("");
        LoadProducts($(this).val(), $("#rarity").val(), $("#category").val());
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

                let priceHtml = `<span class="price-tag">$${(d["price"] - (d["price"] * d["discount"])).toFixed(2)}</span> `;
                    priceHtml += d["discount"] != null ? `<span style="color:rgba(255, 0, 0, 0.445);">$${d["price"]}</span>` : "";

                let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";
                let id = "btn-" + d.id;
            $("#product-list-container").append(`
                <div class="col-md-4 mb-4 r-${d["rarity"]} rarity">
                    <div class="card h-100">
                        <div class="card-body" id="view-${id}">
                            <h5 class="card-title">${d["name"]}</h5>
                             <div class="img-wrapper">
                                <img src="${image}" alt="${d.name}">
                                <div class="sold-image ${d["quantity"] == 0 ? 'is-sold-out' : ''}"></div>
                             </div>
                            <h6 class="card-text">${d["category"]}</h6>
                            <p class="card-text">${d["description"]}</p>
                            <ul class="list-unstyled">
                                <li>Price: ${priceHtml}</li>
                                <br>
                                <li>${d["sold"]} Sold(s)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `);

            $("#view-" + id).click(function () {
                window.location.href = "ViewProduct.html?id=" + d.id;
            });
         }
        });
    });
}