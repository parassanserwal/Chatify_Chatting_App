// import mongoose from "mongoose";

// const statusSchema = new mongoose.Schema({
//     uploader: {
//         type: String
//     },
//     imageUrl: {
//         type: String,
//       },
//     content: {
//         type: String,
//         enum: ['text', 'image'],
//     },
//     createdAt: {
//         type: Date,
//     },
//     expiresAt: {
//         type: Date,
//     }
// })





// // creating models
// const Status = mongoose.model("Status",statusSchema);

// export default Status;
import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    uploader: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'Users', // Reference to the User collection
        required: true
         
        
    },
    
    type: {
        type: String,
        enum: ['text', 'image'], // Enum to differentiate between text and image status
        required: true
    },
    content: {
        type: String // No enum, store actual text content here
    },
    imageUrl: {
        type: String // URL of the image, if type is 'image'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 30 * 1000
    }
});
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Creating model
const Status = mongoose.model("Status", statusSchema);

export default Status;
