import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true
    },
    product_details: {
        name: { type: String, required: true },
        image: { type: [String], default: [] }
    },
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        default: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address',
        required: true
    },
    subTotalAmount: {
        type: Number,
        default: 0
    },
    invoice_receipt: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
