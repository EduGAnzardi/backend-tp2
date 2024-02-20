const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.productIdCounter = 1;
        this.path = filePath;

        // Cargar productos desde el archivo al iniciar la instancia
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (!Array.isArray(this.products)) {
                this.products = [];
            }
        } catch (error) {
            console.error('Error al cargar productos desde el archivo:', error.message);
        }
    }

    saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data, 'utf8');
        } catch (error) {
            console.error('Error al guardar productos en el archivo:', error.message);
        }
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error("El código del producto ya está en uso.");
            return;
        }

        const newProduct = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        this.saveProducts(); // Guardar productos en el archivo
        console.log("Producto agregado correctamente:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            console.error("Producto no encontrado.");
            return null;
        }

        return product;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);

        if (index === -1) {
            console.error("Producto no encontrado.");
            return;
        }

        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts(); // Guardar productos en el archivo
        console.log("Producto actualizado correctamente:", this.products[index]);
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);

        if (index === -1) {
            console.error("Producto no encontrado.");
            return;
        }

        const deletedProduct = this.products.splice(index, 1)[0];
        this.saveProducts(); // Guardar productos en el archivo
        console.log("Producto eliminado correctamente:", deletedProduct);
    }

    // Método de prueba o ejemplo de uso
    static runExample() {
        const productManager = new ProductManager('productos.json');

        console.log("Productos iniciales:", productManager.getProducts());

        productManager.addProduct({
            title: "Camiseta Argentina",
            description: "Camiseta original de Argentina, campeon del mundo en el año 2022",
            price: 40000,
            thumbnail: "Sin imagen",
            code: "123456",
            stock: 50
        });

        console.log("Productos después de agregar uno:", productManager.getProducts());

        const foundProduct = productManager.getProductById(1);
        console.log("Producto encontrado por ID:", foundProduct);

        productManager.updateProduct(1, { price: 50000 });

        productManager.deleteProduct(1);
    }
}

// Ejecutar el ejemplo de uso solo si se ejecuta este archivo directamente
if (require.main === module) {
    ProductManager.runExample();
}

module.exports = ProductManager;