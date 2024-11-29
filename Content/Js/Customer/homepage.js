$(function() {
    let limit = 3;

    // gets data from products on json-server
    fetch('http://localhost:3000/products').then(r => r.json()).then(data => {
        data.forEach(d => {
            if (limit != 0) {
            let image = d.image != "" ? d.image : "/Content/images/Admin/placeholder.png";

            $(".carousel-inner").append(`
                <div class="carousel-item c-item" id="car-${d.id}">
                        <img src="/Content/images/Customer/background_display.jpg" class="d-block w-100 c-img" alt="Slide">
                          <img src="${image}" id="img-${d.id}" class="product-img" alt="Product ${d.name}">
                        <div class="carousel-caption d-md-block">
                            <h2 class="txtDetail"><b>${d.name}</b></h2>
                            <p class="txtDetail">${d.description}</p>
                        </div>
                    </div>
            `);

            $("#img-" + d.id).click(function() {
                window.location.href = "ViewProduct.html?id=" + d.id;
            });

            if (limit == 3) {
                $("#car-" + d.id).addClass('active');
            }
            limit--;
            }
        });
    });
});