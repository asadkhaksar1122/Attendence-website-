const mongoose = require("mongoose");
const { Student } = require("./student");
const Schema = mongoose.Schema;
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/student");
}
const attendanceschema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref:"Student"
    },
    date: {
        type: Date,
        required:true,
        default: Date.now(),
    },
    attendence: {
        type: String,
        required: true,
        trim: true,
        anum:["present","absent","leave"]
    }
})
const Attendence = mongoose.model("Attendence", attendanceschema)

module.exports = { Attendence };