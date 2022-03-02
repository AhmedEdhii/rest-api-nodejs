const mongoose = require("mongoose")
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
 
const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phonenumber:{
        type: String,
        required: true,
        maxlength: 11,
        trim: true
    },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"]
      },
    encrypted_password:{
        type: String,
        required: true
    },
    salt: String,
}, {timestamps: true})

userSchema.virtual("password")
.set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.encrypted_password = this.securePassword(password)
})
.get(function() {
    return this._password
})

userSchema.methods = {
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encrypted_password
    },

    securePassword: function(plainpassword){
        if(!plainpassword) return "";

        try{
            return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex")
        }
        catch{
            return ""
        }
    }
}

module.exports = mongoose.model("User", userSchema)



