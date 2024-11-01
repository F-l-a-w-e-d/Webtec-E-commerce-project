$(function() {
    fetch("http://localhost:3000/products").then(response => response.json()).then(data => {
        data.forEach(d => {
            $("#product-list-container").append(`
                    <div>
                    <p>${d["name"]}</p>
                    <ul>
                        <li>${d["description"]}</li>
                        <li>${d["price"]}</li>
                        <li>${d["rarity"]}</li>
                    </ul>

                    <button>Update</button>
                    <button>Delete</button>
                    </div>
                `);
        });
    });
});

function Create() {
    
}