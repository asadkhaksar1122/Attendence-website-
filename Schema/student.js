const mongoose=require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/student");
}
const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    admin: {
        type:Boolean
    }
})
studentSchema.plugin(passportLocalMongoose);
const Student = mongoose.model("Student", studentSchema)
// // Student.deleteMany({}).then((result) => console.log(result));


module.exports = { Student };
